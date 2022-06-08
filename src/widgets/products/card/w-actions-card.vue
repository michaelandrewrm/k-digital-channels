<template>
	<w-actions :options="options" />
</template>

<script>
import { mapState } from 'vuex';
import MChangeLimit from '@modals/m-change-limit';
import MActivateCard from '@modals/m-activate-card';
import MAmortizeCard from '@modals/m-amortize-card';
import MRequestStatement from '@modals/m-request-statement';
import WActions from '@widgets/w-actions';
import iconPDF from '@icons/pdf';
import iconXLS from '@icons/xls';
import iconProfiles from '@icons/interveners';
import iconValueAccountUnit from '@icons/valueAccountUnit';
import iconProductCard from '@icons/productCard';
import iconReceipt from '@icons/receipt';

export default {
	name: 'w-actions-card',

	components: { WActions },

	props: { product: Object },

	computed: {
		...mapState('resources', ['hasResult']),

		options({ product, $route: { query } }) {
			const hasNotProfile = !product?.profiles?.length;
			const isCreditCard = product?.productFamily === 'credit-card';
			const productNumber = this.$pn(product?.productNumber, 'obfuscated-pan');

			return [
				{
					id: 'change-limit',
					title: this.$t('ACTIONS.CHANGE_LIMIT'),
					action: () =>
						this.$store.dispatch('modal/open', {
							component: MChangeLimit,
							props: { productNumber },
						}),
					hidden: true,
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
					id: 'activate',
					icon: iconProductCard,
					title: this.$t('ACTIONS.ACTIVATE'),
					action: () =>
						this.$store.dispatch('modal/open', {
							component: MActivateCard,
							props: { productNumber },
						}),
				},
				{
					id: 'amortize',
					icon: iconValueAccountUnit,
					title: this.$t('ACTIONS.AMORTIZE'),
					action: () =>
						this.$store.dispatch('modal/open', {
							component: MAmortizeCard,
							props: { productNumber },
						}),
					hidden: !isCreditCard,
				},
				{
					id: 'settlement-statement',
					icon: iconReceipt,
					title: this.$t('ACTIONS.REQUEST_STATEMENT'),
					action: () =>
						this.$store.dispatch('modal/open', {
							component: MRequestStatement,
							props: { productNumber },
						}),
					hidden: !isCreditCard,
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
};
</script>
