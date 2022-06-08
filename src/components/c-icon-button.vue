<template>
	<button class="c-icon-button" role="button" v-on="$listeners" :class="mainClassNames">
		<c-icon class="c-icon-button__icon" :src="icon" size="inherit" />
	</button>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'c-icon-button',

	components: {
		CIcon,
	},

	props: {
		icon: { type: null },
		raised: { type: Boolean },
		mini: { type: Boolean },
	},

	computed: {
		mainClassNames({ raised, mini }) {
			return {
				'--raised': raised,
				'--mini': mini,
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.c-icon-button {
	line-height: 1;
	letter-spacing: 0;
	width: 40px;
	height: 40px;
	position: relative;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	border: none;
	outline: none;
	user-select: none;
	appearance: none;
	border-radius: $border-radius-s * 2;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	white-space: nowrap;
	color: inherit;
	background-color: transparent;
	font-size: 1.6rem;
}

.c-icon-button:not([hidden]) {
	display: inline-flex;
}

.c-icon-button::-moz-focus-inner {
	padding: 0;
	border: 0;
}

.c-icon-button:active {
	outline: none;
}

.c-icon-button:disabled {
	color: RGBA(var(--color-dark-surface), 0.1);
	background-color: RGBA(var(--color-dark-surface), 0.1);
}

.c-icon-button:not(:disabled) {
	@media (hover) {
		cursor: pointer;
	}
}

.c-icon-button__icon {
	font-size: inherit;
}

.c-icon-button.--raised {
	background-color: RGB(var(--color-surface-light));
	transition: box-shadow 100ms ease, transform 100ms ease;
	box-shadow: 0px 4px 12px -6px RGBA(var(--color-dark-surface), 0.6);
	will-change: transform;
}

.c-icon-button.--raised:active {
	box-shadow: 0px 4px 12px -8px RGBA(var(--color-dark-surface), 0.6);
	transform: translateY(1px);
}

.c-icon-button.--mini {
	width: 26px;
	height: 20px;
}
</style>
