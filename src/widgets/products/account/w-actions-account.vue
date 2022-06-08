<template>
	<w-actions :options="options" />
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import WActions from '@widgets/w-actions';
import WDownloadDocument from '@widgets/w-download-document';
import b64toBlob from '@utils/b64toBlob';
import iconMyTransfers from '@icons/myTransfers';
import iconPDF from '@icons/pdf';
import iconXLS from '@icons/xls';
import iconProfiles from '@icons/interveners';
import iconCertificate from '@icons/certificate';
import { intervenersByTitle } from '@modules/products/product-interveners';

export default {
	name: 'w-actions-account',

	components: { WActions },

	props: {
		product: Object,
	},

	computed: {
		...mapState('resources', ['hasResult']),

		options({ product, $route: { query } }) {
			const isCurrency = product?.productFamily?.startsWith('currency');
			const hasNotProfile = !product?.profiles?.length;
			const isHolder = product?.relationType?.id === intervenersByTitle.holder;

			return [
				{
					id: 'transfer',
					title: this.$t('ACTIONS.TRANSFER'),
					action: () =>
						this.$router.push({
							name: 'transfer',
							params: { action: 'new' },
							query: { origin: product.id },
						}),
					disabled: isCurrency,
					hidden: true,
				},
				{
					id: 'my-transfers',
					icon: iconMyTransfers,
					title: this.$t('ACTIONS.MY_TRANSFERS'),
					action: () =>
						this.$router.push({
							name: 'my-transfers',
							params: { productId: product.id },
						}),
					hidden: isCurrency,
				},
				{
					id: 'download-pdf',
					icon: iconPDF,
					title: this.$t('ACTIONS.DOWNLOAD_DOCUMENT').concat(
						' PDF ',
						this.$t('MOVEMENT.TITLE').toLowerCase()
					),
					action: () => this.$emit('download-document', 'pdf'),
					hidden: !this.hasResult || !query?.search,
				},
				{
					id: 'download-xls',
					icon: iconXLS,
					title: this.$t('ACTIONS.DOWNLOAD_DOCUMENT').concat(
						' XLS ',
						this.$t('MOVEMENT.TITLE').toLowerCase()
					),
					action: () => this.$emit('download-document', 'xls'),
					hidden: !this.hasResult || !query?.search,
				},
				{
					id: 'ownership-certificate',
					icon: iconCertificate,
					title: this.$t('ACTIONS.OWNERSHIP-CERTIFICATE'),
					action: this.downloadCertificate,
					hidden: !isHolder,
				},
				{
					id: 'product-profiles',
					icon: iconProfiles,
					title: hasNotProfile
						? this.$t('ACTIONS.ASSIGN_TO_PROFILE')
						: this.$t('ACTIONS.CHANGE_PROFILE'),
					action: () =>
						this.$router.push({
							name: 'product-profiles',
							params: { familyId: product.productFamily, productId: product.id },
						}),
				},
			];
		},
	},

	methods: {
		downloadCertificate() {
			const channel = new MessageChannel();
			const extension = 'pdf';

			this.$store.dispatch('notification/open', {
				template: Vue.extend(WDownloadDocument),
				props: {
					channel,
					extension: extension.toUpperCase(),
					title: this.$t('INFO.OWNERSHIP_CERTIFICATE'),
				},
				timeout: 5000,
			});

			this.$store
				.dispatch('products/getHolderCertificate', { productId: this.product.id })
				.then((content) => {
					const blobStore = b64toBlob(content, extension);

					channel.port1.postMessage({ name: 'downloaded', blob: blobStore, b64Data: content });
				})
				.catch(() => {
					channel.port1.postMessage({ name: 'error' });
				});
		},
	},
};
</script>
