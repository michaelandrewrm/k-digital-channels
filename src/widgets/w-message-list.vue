<template>
	<w-list
		:messageError="$t(`RESOURCE.${labelEntry}.ERROR`)"
		:messageNoResults="$t(`RESOURCE.${labelEntry}.NO_RESULTS`)"
		:messageNextPage="$t(`RESOURCE.${labelEntry}.VIEW_MORE`)"
		:itemComponent="itemComponent"
		:params="params"
		:items="items"
		:error="error"
		:paginationKey="paginationKey"
		@fetch="fetch"
		@item-click="markItemAsRead"
	></w-list>
</template>

<script>
import WList from '@widgets/w-list';
import WItemMessage from '@widgets/w-message-item';
import communicationsModule from '@modules/communications/m-communications';

export default {
	name: 'w-message-list',

	modules: {
		communications: communicationsModule,
	},

	components: {
		WList,
	},

	data() {
		return {
			items: [],
			error: false,
			paginationKey: null,
			itemComponent: WItemMessage,
		};
	},

	props: {
		type: {
			type: String,
			required: true,
			validator: (value) => ['alerts', 'documents', 'statements'].includes(value),
		},
	},

	computed: {
		params({ type }) {
			return { type };
		},

		labelEntry({ type }) {
			if (type === 'documents') {
				return 'DOCUMENT';
			}

			return 'MESSAGE';
		},
	},

	methods: {
		fetch({ type, paginationKey }) {
			this.error = false;

			const action = {
				alerts: 'communications/getMessages',
				statements: 'communications/getStatements',
				documents: 'communications/getDocuments',
			}[type];

			this.$store
				.dispatch(action, { paginationKey })
				.then(({ data, paging }) => {
					this.items = data;
					this.paginationKey = paging?.nextPaginationKey;
				})
				.catch(() => {
					this.error = true;
				});
		},

		markItemAsRead(id) {
			const { type } = this;
			const itemIndex = this.items.findIndex(({ id: itemId }) => itemId === id);
			const item = this.items[itemIndex];

			const action = {
				alerts: 'communications/markMessageAsRead',
				documents: 'communications/markDocumentAsRead',
			}[type];

			/* istanbul ignore else */
			if (item && !item.reviewDate) {
				const today = new Date().toISOString();

				this.$set(this.items, itemIndex, { ...item, reviewDate: today });
				this.$store.dispatch(action, { id, type: item.type }).catch(() => {});
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
