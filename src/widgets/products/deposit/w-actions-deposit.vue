<template>
	<w-actions :options="options" />
</template>

<script>
import WActions from '@widgets/w-actions';
import MDepositInfo from '@modals/m-deposit-info';
import iconPDF from '@icons/pdf';
import iconXLS from '@icons/xls';
import iconProfiles from '@icons/interveners';
import { subtypesById } from '@modules/products/product-subtypes';
import { mapState } from 'vuex';

export default {
	name: 'w-actions-deposit',

	components: { WActions },

	props: { product: Object },

	computed: {
		...mapState('resources', ['hasResult']),

		options({ product, $route: { query } }) {
			const hasNotProfile = !product?.profiles?.length;
			const isDemandDeposit = subtypesById[(product?.productSubtype?.id)] === 'demand-deposit';
			return [
				{
					id: 'deposit',
					title: this.$t('ACTIONS.DEPOSIT'),
					action: () => this.$store.dispatch('modal/open', MDepositInfo),
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
					hidden: !query?.search || !isDemandDeposit || !this.hasResult,
				},
				{
					id: 'download-xls',
					icon: iconXLS,
					title: this.$t('ACTIONS.DOWNLOAD_DOCUMENT').concat(
						' XLS ',
						this.$t('MOVEMENT.TITLE').toLowerCase()
					),
					action: () => this.$emit('download-document', 'xls'),
					hidden: !query?.search || !isDemandDeposit || !this.hasResult,
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
