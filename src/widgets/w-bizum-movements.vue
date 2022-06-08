<template>
	<w-list
		:messageError="$t(`RESOURCE.MOVEMENT.ERROR`)"
		:messageNoResults="$t(`RESOURCE.MOVEMENT.NO_RESULTS`)"
		:messageNextPage="$t(`RESOURCE.MOVEMENT.VIEW_MORE`)"
		:itemComponent="itemComponent"
		:params="params"
		:items="items"
		:error="error"
		:paginationKey="paginationKey"
		@fetch="fetch"
		@item-click="onItemClick"
	></w-list>
</template>

<script>
import WList from '@widgets/w-list';
import WBizumMovement from '@widgets/w-bizum-movement';
import moduleBizum from '@modules/bizum/m-bizum';

export default {
	name: 'w-bizum-movements',

	modules: { bizum: moduleBizum },

	components: {
		WList,
	},

	data() {
		return {
			items: [],
			error: false,
			paginationKey: null,
			itemComponent: WBizumMovement,
		};
	},

	props: {
		status: {
			type: String,
			validator: (value) => ['completed', 'pending'].includes(value),
			default: 'completed',
		},
		query: { type: Object },
	},

	computed: {
		params({ status }) {
			return { status };
		},
	},

	methods: {
		fetch({ status, query, paginationKey }) {
			this.error = false;

			return this.$store
				.dispatch('bizum/getMovements', { status, paginationKey, query })
				.then(({ data, paging }) => {
					this.items = data;
					this.paginationKey = null;

					if (paging?.hasMorePages) {
						this.paginationKey = paging?.nextPaginationKey;
					}
				})
				.catch(() => {
					this.error = true;
				})
				.finally(() => {
					this.$emit('fetch', this.items);
				});
		},

		onItemClick(movementId) {
			const item = this.items.find(({ id }) => id === movementId);

			if (item.type.name === 'SENT-ECOM' && item.status.name === 'PENDING') {
				/* istanbul ignore next */
				if (!item.signatureId) {
					const { error } = console;
					return error(
						`[!] El movimiento de Bizum ${movementId} no tiene signatureId.`,
						'No ha sido posible realizar la redirección.'
					);
				}

				return this.$router.push({
					name: 'signature-detail',
					params: { type: 'pending', signatureId: item.signatureId },
				});
			}

			return this.$router.push({ name: 'bizum-movement', params: { movementId } });
		},
	},
};
</script>

<style lang="scss" scoped></style>
