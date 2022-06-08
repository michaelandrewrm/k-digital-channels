<template>
	<w-list
		data-key="signatureId"
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
import WSignatureListItem from '@widgets/w-signature-list-item';
import signaturesModule from '@modules/signatures/m-signatures';

export default {
	name: 'w-signature-list',

	modules: { signatures: signaturesModule },

	components: { WList },

	data() {
		return {
			items: [],
			error: false,
			paginationKey: 0,
			itemComponent: WSignatureListItem,
		};
	},

	props: {
		status: {
			type: String,
			validator: (value) => ['signed', 'pending'].includes(value),
			default: 'pending',
		},
	},

	computed: {
		params({ status }) {
			return { status };
		},
	},

	methods: {
		async fetch({ status, paginationKey }) {
			this.error = false;

			try {
				const { data, paging } = await this.$store.dispatch('signatures/fetch', {
					status,
					paginationKey,
				});
				this.items = data;
				this.paginationKey = paging?.nextPaginationKey;
			} catch {
				this.error = true;
			}
		},

		onItemClick(signatureId) {
			this.$router.push({ name: 'signature-detail', params: { signatureId, type: this.status } });
		},
	},
};
</script>
