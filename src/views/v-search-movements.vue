<template>
	<l-page>
		<h1 slot="header">{{ $t('MOVEMENT.SEARCH_TITLE') }}</h1>

		<div slot="widget" v-if="product">
			<span class="text-s-medium" data-testid="subtitle">{{ product.alias }}</span>
		</div>

		<div class="text-m-medium" v-if="product">
			<div class="v-search-movements__group">
				<div class="v-search-movements__cols">
					<span>{{ $t('MOVEMENT.SEARCH_FROM') }}</span>

					<c-transfer-date-picker
						data-testid="date-from"
						v-model="dateFrom"
						:lang="$store.state.session.lang"
						:placeholder="$t('MOVEMENT.SEARCH_FROM')"
						popoverPosition="bottom"
					/>
				</div>
				<div class="v-search-movements__cols">
					<span>{{ $t('MOVEMENT.SEARCH_TO') }}</span>

					<c-transfer-date-picker
						data-testid="date-to"
						v-model="dateTo"
						:lang="$store.state.session.lang"
						:placeholder="$t('MOVEMENT.SEARCH_TO')"
						:max-date="today"
						popoverPosition="bottom"
					/>
				</div>
			</div>
		</div>

		<c-button raised @click="search" slot="buttons" data-testid="search">
			{{ $t('MOVEMENT.SEARCH_ACTION') }}
		</c-button>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import CButton from '@components/c-button';
import CTransferDatePicker from '@components/c-transfer-date-picker';
import moduleProducts from '@modules/products/m-products';

export default {
	name: 'v-search-movements',

	modules: {
		products: moduleProducts,
	},

	components: {
		LPage,
		CButton,
		CTransferDatePicker,
	},

	data() {
		return {
			product: null,
			dateFrom: null,
			dateTo: null,
			reason: null,
		};
	},

	props: {
		productId: { type: null },
		familyId: { type: null },
	},

	computed: {
		today() {
			return this.formatDate(new Date())['YYYY-MM-DD'];
		},
	},

	watch: {
		productId: {
			immediate: true,
			async handler(value) {
				if (value) {
					this.product = await this.$store.dispatch('products/get', value);
				}
			},
		},
	},

	methods: {
		formatDate(date) {
			const d = new Date(date);
			const day = d.getDate();
			const month = d.getMonth() + 1;
			const year = d.getFullYear();
			const currentDay = day.toString().padStart(2, '0');
			const currentMonth = month.toString().padStart(2, '0');
			return {
				'YYYY-MM-DD': `${year}-${currentMonth}-${currentDay}`,
				'DD/MM/YYYY': `${currentDay}/${currentMonth}/${year}`,
			};
		},

		search() {
			const { productId, familyId, dateFrom, dateTo, reason } = this;

			if (!dateFrom && !dateTo && !reason) {
				return this.$router.back();
			}

			const query = { search: true };

			if (dateFrom) {
				Object.assign(query, { dateFrom: dateFrom.replace(/-/g, '') });
			}

			if (dateTo) {
				Object.assign(query, { dateTo: dateTo.replace(/-/g, '') });
			}

			if (reason) {
				Object.assign(query, { reason });
			}

			this.$router.replace({
				name: 'product',
				params: { productId, familyId },
				query,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.v-search-movements__group {
	margin: 20px 0;
}

.v-search-movements__cols {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 20px;
}

.v-search-movements__cols > :first-child {
	width: 80px;
}

.v-search-movements__txt-icon {
	top: calc(50% - 8px);
	font-size: 16px;
	right: 10px;
	position: absolute;
}
</style>
