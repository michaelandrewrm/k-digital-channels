<template>
	<w-actions :options="options" />
</template>

<script>
import MPensionPlanOperative from '@modals/m-pension-plan-operative';
import WActions from '@widgets/w-actions';
import iconProfiles from '@icons/interveners';

export default {
	name: 'w-actions-pension-plan',

	components: { WActions },

	props: { product: Object },

	computed: {
		options({ product }) {
			const hasNotProfile = !product?.profiles?.length;

			return [
				{
					id: 'contribute',
					title: this.$t('ACTIONS.CONTRIBUTE'),
					action: () => this.$store.dispatch('modal/open', MPensionPlanOperative),
					hidden: true,
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
