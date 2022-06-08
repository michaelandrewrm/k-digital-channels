<template>
	<w-actions :options="options" />
</template>

<script>
import WActions from '@widgets/w-actions';
import iconProfiles from '@icons/interveners';

export default {
	name: 'w-actions-equities',

	components: { WActions },

	props: { product: Object },

	computed: {
		options({ product }) {
			const hasNotProfile = !product?.profiles?.length;

			return [
				{
					id: 'operate',
					title: this.$t('ACTIONS.OPERATE'),
					action: () => this.$router.push({ name: 'bolsa-caminos' }),
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
