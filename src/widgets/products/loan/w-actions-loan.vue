<template>
	<w-actions :options="options" />
</template>

<script>
import WActions from '@widgets/w-actions';
import MAmortizeLoan from '@modals/m-amortize-loan';
import iconAmortization from '@icons/document';
import iconProfiles from '@icons/interveners';

export default {
	name: 'w-actions-loan',

	components: { WActions },

	props: { product: Object },

	data() {
		return {
			detail: null,
		};
	},

	computed: {
		options({ product }) {
			const hasNotProfile = !product?.profiles?.length;

			return [
				{
					id: 'amortize',
					title: this.$t('ACTIONS.AMORTIZE'),
					action: () =>
						this.$store.dispatch('modal/open', {
							component: MAmortizeLoan,
							props: { productNumber: this.detail?.connectedAccount?.value },
						}),
					hidden: true,
				},
				{
					id: 'amortize-table',
					icon: iconAmortization,
					title: this.$t('DETAIL.SHOW_AMORTIZATION_TABLE'),
					action: () =>
						this.$router.push({
							name: 'amortization-table',
							params: { productId: this.product.id },
						}),
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
		async getProductDetail() {
			this.detail = await this.$store.dispatch('products/getDetails', this.product.id);
		},
	},

	created() {
		this.getProductDetail();
	},
};
</script>
