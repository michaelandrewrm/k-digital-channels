<template>
	<component
		class="w-product-actions"
		:is="actionsName"
		v-bind="$attrs"
		v-on="$listeners"
		:product="product"
	/>
</template>

<script>
export default {
	name: 'w-product-actions',

	props: { type: String, product: Object },

	computed: {
		actionsName({ type }) {
			/* istanbul ignore else */
			if (type) {
				return () => import(`@widgets/products/${type}/w-actions-${type}`);
			}

			return '';
		},
	},
};
</script>

<style lang="scss" scoped>
.w-product-actions {
	display: grid;
	width: 100%;
	max-width: 400px;
	gap: 10px;
	grid-auto-flow: column;
	grid-auto-columns: 1fr auto;
}
</style>
