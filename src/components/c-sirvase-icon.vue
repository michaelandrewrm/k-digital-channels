<template>
	<button class="c-sirvase-icon" @click="$router.push({ name: 'sirvase' })" data-testid="button">
		<c-icon class="c-sirvase-icon__button" src="@icons/sirvaseEfectuar" size="inherit" />
	</button>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'c-sirvase-icon',

	components: {
		CIcon,
	},
};
</script>

<style lang="scss" scoped>
.c-sirvase-icon {
	font-size: 25px !important;
	line-height: 0;
	background: transparent;
	outline: none;
	text-align: left;
	user-select: none;
	appearance: none;
	border: none;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.c-sirvase-icon__button {
	padding-bottom: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: RGB(var(--color-secondary-light));
}
</style>
