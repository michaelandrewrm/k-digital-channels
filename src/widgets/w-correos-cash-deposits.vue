<template>
	<w-list
		:messageError="$t(`RESOURCE.MOVEMENT.ERROR`)"
		:messageNoResults="$t(`RESOURCE.MOVEMENT.NO_RESULTS`)"
		:messageNextPage="$t(`RESOURCE.MOVEMENT.VIEW_MORE`)"
		:itemComponent="itemComponent"
		:items="items"
		:error="error"
		:paginationKey="paginationKey"
		@fetch="fetch"
		@item-click="onItemClick"
	></w-list>
</template>

<script>
import WList from '@widgets/w-list';
import WCorreosCashDeposit from '@widgets/w-correos-cash-deposit';
import correosCashModule from '@modules/correos-cash/m-correos-cash';

export default {
	name: 'w-correos-cash-deposits',

	modules: { 'correos-cash': correosCashModule },

	components: { WList },

	data() {
		return {
			items: [],
			error: false,
			paginationKey: null,
			itemComponent: WCorreosCashDeposit,
		};
	},

	methods: {
		fetch({ paginationKey }) {
			this.error = false;

			this.$store
				.dispatch('correos-cash/get', { paginationKey })
				.then(({ data, paging }) => {
					this.items = data;
					this.paginationKey = paging?.nextPaginationKey;
				})
				.catch(() => {
					this.error = true;
				})
				.finally(() => {
					this.$emit('fetch', this.items);
				});
		},

		onItemClick(depositId) {
			this.$router.push({ name: 'correos-cash-detail', params: { depositId } });
		},
	},
};
</script>
