<template>
	<w-actions :options="options" />
</template>

<script>
import WActions from '@widgets/w-actions';
import MFundOperative from '@modals/m-fund-operative';
import iconProfiles from '@icons/interveners';

export default {
	name: 'w-actions-fund',

	components: { WActions },

	props: { product: Object },

	computed: {
		options({ product }) {
			const hasNotProfile = !product?.profiles?.length;
			const isProfileAvailable = !product?.asset;

			return [
				{
					id: 'operate',
					title: this.$t('ACTIONS.ADD_SUBSCRIPTION'),
					action: () => this.$store.dispatch('modal/open', MFundOperative),
					hidden: true,
				},
				isProfileAvailable && {
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
