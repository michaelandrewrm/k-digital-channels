<template>
	<w-actions :options="options" />
</template>

<script>
import WActions from '@widgets/w-actions';
import iconMyTransfers from '@icons/myTransfers';
import iconProfiles from '@icons/interveners';

export default {
	name: 'w-actions-credit',

	components: { WActions },

	props: { product: Object },

	computed: {
		options({ product }) {
			const hasNotProfile = !product?.profiles?.length;

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
