<template>
	<div class="v-assisted-sirvase">
		<section class="v-assisted-sirvase__content">
			<table class="v-assisted-sirvase__table">
				<thead>
					<tr class="text-l-light">
						<th>{{ $t('ASSISTED-SIRVASE-DATE-REQUEST_TABLE') }}</th>
						<th>{{ $t('ASSISTED-SIRVASE-DATE-MODIFY_TABLE') }}</th>
						<th>{{ $t('ASSISTED-SIRVASE-TYPOLOGY_TABLE') }}</th>
						<th>{{ $t('ASSISTED-SIRVASE-STATUS_TABLE') }}</th>
						<th>{{ $t('ASSISTED-SIRVASE-MANAGER') }}</th>
					</tr>
				</thead>
				<tbody>
					<tr
						class="v-assisted-sirvase__item text-l-book"
						v-for="item in paginatedItems"
						:key="item.id"
						@click="getDetails(item.id)"
					>
						<td>{{ item.requestDate }}</td>
						<td>{{ itemModificationDate(item) }}</td>
						<td>{{ item.type.name_es }}</td>
						<td class="text-l-bold" :class="itemStatusColor(item)">
							{{ item.status.name_es }}
						</td>
						<td>{{ itemManager(item) }}</td>
					</tr>
				</tbody>
			</table>
		</section>
		<div class="v-assisted-sirvase__footer text-xl-bold">
			<button @click="changePageNumber(-1)" :disabled="this.loading" data-testid="next">
				<span class="previous-page">{{ `&#60;` }}</span>
			</button>
			<span class="actual-page">{{ pageNumber }}</span>
			<button @click="changePageNumber(+1)" :disabled="this.loading" data-testid="previous">
				<span class="next-page">{{ `&#x3e;` }}</span>
			</button>
		</div>
	</div>
</template>

<script>
import MSirvaseDetail from '@modals/m-sirvase-detail';

export default {
	name: 'v-assisted-sirvase',

	data() {
		return {
			pageNumber: 1,
			items: [],
			response: null,
			paginationKey: null,
			details: null,
			loading: true,
			onDetail: false,
		};
	},

	props: {
		session: {
			type: Object,
			required: true,
		},
	},

	computed: {
		paginatedItems() {
			return this.items[this.pageNumber - 1];
		},

		hasMorePages() {
			return this.response.paging.hasMorePages;
		},
	},

	watch: {
		'session.isLoading': {
			inmediate: true,
			handler(isLoading) {
				if (!isLoading) {
					this.fetch();
				}
			},
		},

		'session.sirvase.response': {
			async handler(response) {
				if (!response) {
					return;
				}

				const { data } = response;

				// si lo que llega es un array, se trata de la lista de items
				if (Array.isArray(data)) {
					// si llega una lista, la meto a los items
					this.items[this.pageNumber - 1] = [...data];
					this.items = this.items.slice();
					this.response = response;

					this.paginationKey = null;

					/* istanbul ignore if */
					/* istanbul ignore branch */
					if (response.paging?.hasMorePages) {
						this.paginationKey = response.paging?.nextPaginationKey;
					}
					this.loading = false;
					this.$emit('clear');
				} else {
					// en caso contrario, de los detalles
					this.details = data;

					this.onDetail = true;

					const newDetailId = await this.$store.dispatch('modal/open', {
						component: MSirvaseDetail,
						props: { source: this.details },
					});

					this.onDetail = false;

					if (newDetailId) {
						this.$store
							.dispatch('sirvase/setRequestStatus', {
								requestId: this.details.id,
								status: {
									id: newDetailId,
								},
							})
							.then((res) => {
								this.items.forEach((page) => {
									page.forEach((item) => {
										if (item.id === res.data.id) {
											Object.assign(item, res.data);
										}
									});
								});
							});
					}

					this.$emit('clear');
				}
			},
		},
	},

	methods: {
		fetch(params) {
			/* istanbul ignore if */
			if (params) {
				return this.$emit('sirvase', { ...params, extended: true });
			}
			return this.$emit('sirvase', { extended: true });
		},

		/* istanbul ignore next */
		getDetails(id) {
			if (this.onDetail) {
				return;
			}
			return this.$emit('detail', { requestId: id, extended: true });
		},

		itemStatusColor(item) {
			const statusName = item?.status?.name_en.toUpperCase() || 'color-text-primary';
			const status = {
				REQUESTED: 'color-accent-icon',
				DONE: 'color-accent-success',
				EXPIRED: 'color-accent-error',
				CANCELLED: 'color-accent-error',
			}[statusName];

			return status;
		},

		itemManager(item) {
			return item.manager || '-';
		},

		itemModificationDate(item) {
			return item.modificationDate || '-';
		},

		/* istanbul ignore next */
		changePageNumber(value) {
			const sign = Math.sign(value);

			if (sign < 0) {
				// si estamos en la primera pagina, no podemos retroceder
				if (this.pageNumber === 1) {
					return;
				}
				// retrocedemos una pagina
				this.pageNumber += value;
				return;
			}

			// si hemos llegado al limite y no tiene más paginas, no hacemos nada
			if (!this.hasMorePages && this.pageNumber === this.items.length) {
				return;
			}
			// si tiene más paginas y no tenemos esos items, fetcheamos
			if (this.hasMorePages && !this.items[this.pageNumber]) {
				this.pageNumber += value;
				this.fetch({ paginationKey: this.paginationKey });
				this.loading = true;
				return;
			}

			// en caso de que nada se cumpla, asumimos que tenemos los items y avanzamos
			this.pageNumber += value;
		},
	},

	created() {
		if (!this.session.isLoading) {
			this.fetch();
		}
	},
};
</script>

<style lang="scss">
.v-assisted-sirvase {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	border-radius: 10px;
	width: 100%;
	height: 100%;
	background-color: RGB(var(--color-surface-light));
	z-index: 1;
}

.v-assisted-sirvase__content {
	display: flex;
	padding: 5px;
	flex-direction: column;
	width: 90%;
	height: 80%;
	overflow-y: auto;
	overflow-x: auto;
}

.v-assisted-sirvase__table {
	text-align: center;
	border-collapse: collapse;
}

.v-assisted-sirvase__table th {
	margin: 20px;
	color: RGB(var(--color-secondary-light));
}

.v-assisted-sirvase__head {
	display: flex;
	gap: 20px;
}

.v-assisted-sirvase__item {
	border: 2px solid black;
	margin: 10px;
}

.v-assisted-sirvase__item:hover {
	cursor: pointer;
	background-color: RGB(var(--color-secondary-light));
}
.v-assisted-sirvase__item > td {
	padding: 10px;
}

.v-assisted-sirvase__footer {
	display: flex;
	gap: 10px;
}

.v-assisted-sirvase__footer button {
	all: unset;
	cursor: pointer;
}
</style>
