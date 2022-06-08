<template>
	<a v-if="href" :class="classes" :href="href" v-bind="$attrs" role="button" v-on="$listeners">
		<span class="c-button__icon" v-if="$slots.icon"><slot name="icon" /></span>
		<span class="c-button__label"><slot /></span>
	</a>
	<button v-else :class="classes" v-bind="$attrs" v-on="$listeners">
		<span class="c-button__icon" v-if="$slots.icon"><slot name="icon" /></span>
		<span class="c-button__label"><slot /></span>
	</button>
</template>

<script>
export default {
	name: 'c-button',

	inheritAttrs: false,

	props: {
		raised: { type: Boolean },
		unelevated: { type: Boolean },
		outlined: { type: Boolean },
		dense: { type: Boolean },
		href: { type: String, default: '' },
	},

	computed: {
		classes() {
			return {
				'button': true,
				'button--raised': this.raised,
				'button--unelevated': this.unelevated,
				'button--outlined': this.outlined,
				'button--dense': this.dense,
				'text-fixed-m-medium': true,
			};
		},
	},
};
</script>

<style lang="scss" scoped>
$button-height: 48px;
$button-border-radius: $border-radius-m;
$button-dense-button-height: 40px;
$button-outlined-border-width: 1.5px;

// TO-DO: Define these colours in our DSL representation (.scss)
$button-bg-disable: #727475;
$button-text-color-disable: #727475;

.button {
	line-height: 1.14;
	letter-spacing: 0;
	text-decoration: none;
	text-transform: uppercase;
	padding: 0 8px 0 8px;
	display: inline-flex;
	position: relative;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	min-width: 64px;
	height: $button-height;
	border: none;
	outline: none;
	user-select: none;
	appearance: none;
	border-radius: $button-border-radius;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	white-space: nowrap;
	transition: transform 250ms;
	--focus-ring-padding: 10px;
}
.button::-moz-focus-inner {
	padding: 0;
	border: 0;
}
.button:active {
	outline: none;
}
.button:disabled {
	cursor: default;
	background-color: rgba($button-bg-disable, 0.1);
	color: rgba($button-text-color-disable, 0.7);
	pointer-events: none;
}
.button.button--dense {
	border-radius: $button-border-radius;
}
.button:not(:disabled) {
	background-color: rgba(0, 0, 0, 0);
}

.button .c-button__icon > .c-icon {
	display: inline-block;
	width: 18px;
	height: 18px;
	font-size: 18px;
	vertical-align: top;
}

.button:not(:disabled) {
	color: RGB(var(--color-secondary));
}

.c-button__icon {
	margin-right: 8px;
	margin-left: 0;
}

.c-button__label + .c-button__icon {
	margin-left: 8px;
	margin-right: 0;
}

.button /deep/ svg {
	fill: currentColor;
}

.button--raised .c-button__icon,
.button--unelevated .c-button__icon,
.button--outlined .c-button__icon {
	margin-left: -4px;
}

.button--raised .c-button__label + .c-button__icon,
.button--unelevated .c-button__label + .c-button__icon,
.button--outlined .c-button__label + .c-button__icon {
	margin-right: -4px;
}

.button--raised,
.button--unelevated {
	padding: 0 16px 0 16px;
}
.button--raised:disabled,
.button--unelevated:disabled {
	background-color: rgba($button-bg-disable, 0.1);
	color: rgba($button-text-color-disable, 0.7);
}
.button--raised:not(:disabled),
.button--unelevated:not(:disabled) {
	background-color: RGB(var(--color-secondary));
}
.button--raised:not(:disabled),
.button--unelevated:not(:disabled) {
	color: RGB(var(--button-color-raised-text, var(--color-primary)));
}
.button--raised {
	box-shadow: 0 2px 4px 0 RGBA(var(--color-primary-dark), 0.5);
}
.button--raised:disabled {
	box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14),
		0px 0px 0px 0px rgba(0, 0, 0, 0.12);
}
.button--outlined {
	border-style: solid;
	padding: 0 15px 0 15px;
	border-width: $button-outlined-border-width;
}
.button--outlined:disabled {
	border-color: $button-bg-disable;
}
.button--outlined:not(:disabled) {
	border-color: RGB(var(--color-secondary));
}
.button--dense {
	height: $button-dense-button-height;
	font-size: 0.8125rem;
}
.button::after {
	position: absolute;
	border-radius: inherit;
	opacity: 0;
	pointer-events: none;
	content: '';
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: RGB(var(--color-secondary));
	transition: opacity 200ms;
}
.button:active::after {
	transition-duration: 75ms;
	opacity: 0.24;
}
.button--raised::after,
.button--unelevated::after {
	background-color: #fff;
}
</style>
