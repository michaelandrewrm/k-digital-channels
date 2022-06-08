<template>
	<w-list
		:messageError="$t(`SIRVASE.DASHBOARD.ERROR`)"
		:messageNoResults="''"
		:messageNextPage="$t(`SIRVASE.DASHBOARD.VIEW_MORE`)"
		:itemComponent="itemComponent"
		:items="items"
		:error="error"
		:paginationKey="paginationKey"
		@fetch="fetch"
		@item-click="onItemClick"
		data-testid="list"
	></w-list>
</template>

<script>
import WList from '@widgets/w-list';
import WSirvaseRequest from '@widgets/w-sirvase-request';

export default {
	name: 'w-sirvase-requests',
	components: {
		WList,
	},

	data() {
		return {
			items: [],
			paginationKey: null,
			error: false,
			itemComponent: WSirvaseRequest,
		};
	},
	methods: {
		fetch({ paginationKey }) {
			this.error = false;
			this.$emit('loading', true);

			return this.$store
				.dispatch('sirvase/get', { paginationKey })
				.then(({ data, paging }) => {
					this.items.push(...data);
					this.paginationKey = null;

					/* istanbul ignore next */
					if (paging?.hasMorePages) {
						this.paginationKey = paging?.nextPaginationKey;
					}
				})
				.catch(() => {
					this.error = true;
				})
				.finally(() => {
					this.$emit('loading', false);
					this.$emit('hasItems', !this.items?.length);
				});
		},

		onItemClick(requestId) {
			this.$router.push({ name: 'sirvase-detail', params: { requestId } });
		},
	},
};
</script>

<style lang="scss"></style>
