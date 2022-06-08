<template>
	<w-list
		:messageError="$t(`RESOURCE.TRANSFER.ERROR`)"
		:messageNoResults="$t(`RESOURCE.TRANSFER.NO_RESULTS`)"
		:messageNextPage="$t(`RESOURCE.TRANSFER.VIEW_MORE`)"
		:itemComponent="itemComponent"
		:params="params"
		:items="items"
		:error="error"
		@fetch="fetch"
	></w-list>
</template>

<script>
import WList from '@widgets/w-list';
import moduleResources from '@modules/resources/m-resources';

export default {
	name: 'w-transfer-list',

	modules: { resources: moduleResources },

	components: { WList },

	data() {
		return {
			source: [],
			fetched: false,
			error: false,
			itemComponent: null,
		};
	},

	props: {
		type: { type: String, required: true },
		productId: { type: String },
		resource: { type: String, default: 'transfer' },
	},

	watch: {
		itemComponentName: {
			immediate: true,
			handler(name) {
				import(`@widgets/w-${name}`).then((cmp) => {
					this.itemComponent = cmp.default;
				});
			},
		},
	},

	computed: {
		params({ type }) {
			return { type };
		},

		itemComponentName({ resource, type }) {
			return resource.concat('-', type);
		},

		items({ fetched, source, productId }) {
			if (fetched && source?.length === 0) {
				return [];
			}

			if (!source?.length) {
				return;
			}

			return source.filter(({ orderer }) => orderer?.fromAccount?.id === productId);
		},
	},

	methods: {
		fetch({ type }) {
			this.source = [];
			this.error = false;

			this.$store
				.dispatch('move-money/getTransfers', { type })
				.then((data) => {
					this.source = data;
				})
				.catch(() => {
					this.error = true;
				})
				.finally(() => {
					this.fetched = true;
				});
		},
	},
};
</script>

<style lang="scss" scoped></style>
