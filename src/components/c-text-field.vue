<template>
	<div :class="classes" class="mdc-text-field">
		<slot name="leadingIcon" />
		<input
			v-if="!textarea"
			:value="value"
			ref="textfield"
			class="mdc-text-field__input text-fixed-m-book"
			v-bind="$attrs"
			@input="$emit('model', $event.target.value)"
			v-on="$listeners"
		/>
		<textarea
			v-if="textarea"
			:value="value"
			ref="textfield"
			class="mdc-text-field__input text-fixed-m-book"
			v-bind="$attrs"
			@input="$emit('model', $event.target.value)"
			v-on="$listeners"
		/>
		<div v-if="textarea || outlined || !outlined" class="mdc-notched-outline">
			<div class="mdc-notched-outline__leading" />
			<div v-if="$slots.default" class="mdc-notched-outline__notch">
				<slot />
			</div>
			<div class="mdc-notched-outline__trailing" />
		</div>
		<slot v-if="$slots.default && !fullWidth && !textarea && !outlined" />
		<slot name="trailingIcon" />
		<slot v-if="!outlined" name="bottomLine" />
	</div>
</template>

<script>
import { MDCTextField } from '@material/textfield';

export default {
	name: 'c-text-field',
	inheritAttrs: false,
	model: {
		prop: 'value',
		event: 'model',
	},
	props: {
		value: {
			type: String,
			default: '',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		upgraded: {
			type: Boolean,
			default: false,
		},
		outlined: {
			type: Boolean,
			default: false,
		},
		dense: {
			type: Boolean,
			default: false,
		},
		focused: {
			type: Boolean,
			default: false,
		},
		textarea: {
			type: Boolean,
			default: false,
		},
		useNativeValidation: {
			type: Boolean,
			default: true,
		},
		valid: {
			type: Boolean,
			default: true,
		},
		oneBorder: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			mdcTextField: undefined,
			slotObserver: undefined,
		};
	},
	computed: {
		classes() {
			return {
				'mdc-text-field--upgraded': this.upgraded,
				'mdc-text-field--with-leading-icon': this.$slots.leadingIcon,
				'mdc-text-field--with-trailing-icon': this.$slots.trailingIcon,
				'mdc-text-field--outlined': this.outlined,
				'mdc-text-field--dense': this.dense,
				'mdc-text-field--focused': this.focused,
				'mdc-text-field--textarea': this.textarea,
				'mdc-text-field--no-label': !this.$slots.default,
				'mdc-text-field--one-border': this.oneBorder,
			};
		},
	},
	methods: {
		focus() {
			this.$refs.textfield.focus();
		},
	},
	watch: {
		useNativeValidation() {
			this.mdcTextField.useNativeValidation = this.useNativeValidation;
		},
		valid() {
			this.mdcTextField.valid = this.valid;
		},
		value() {
			this.mdcTextField.value = this.value;
		},
		disabled() {
			this.mdcTextField.disabled = this.disabled;
		},
	},
	mounted() {
		this.mdcTextField = MDCTextField.attachTo(this.$el);
		this.mdcTextField.useNativeValidation = this.useNativeValidation;
		this.mdcTextField.valid = this.valid;
		this.mdcTextField.disabled = this.disabled;
	},

	/* istanbul ignore next */
	beforeDestroy() {
		this.mdcTextField.destroy();
	},
};
</script>

<style lang="scss" scoped>
$tf-width: 100%;
$tf-height: 48px;
$tf-bg-color: $color-TEMP_alt;
$tf-bg-color--hovered: rgba(0, 0, 0, 0);
$tf-bg-color-opacity--hovered: 0.04;
$tf-border-radius: $border-radius-m;
$tf-border-color: #fff;
$tf-border-color--focused: #fff;
$tf-border-color--hovered: #fff;

$tf-input-border-bottom-color: rgba(0, 0, 0, 0);
$tf-input-border-bottom-color--hovered: rgba(0, 0, 0, 0);
$tf-input-border-bottom-color-error: rgba(0, 0, 0, 0);

$tf-outline-padding: 16px;
$tf-outline-color: RGB(var(--color-text-primary));
$tf-outline-color--focused: RGB(var(--color-secondary));
$tf-outline-bg-color: rgba(0, 0, 0, 0);
$tf-outline-stroke-width--focused: 1px;

$tf-border-radius--leading: $tf-border-radius 0 0 $tf-border-radius;
$tf-border-radius--trailing: 0 $tf-border-radius $tf-border-radius 0;

.mdc-floating-label {
	line-height: 1.75rem;
	letter-spacing: 0.00937em;
	text-decoration: inherit;
	text-transform: inherit;
	position: absolute;
	left: 0;
	transform-origin: left top;
	transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);
	line-height: 1.15rem;
	text-align: left;
	text-overflow: ellipsis;
	white-space: nowrap;
	cursor: text;
	overflow: hidden;
	will-change: transform;
}
.mdc-floating-label--float-above {
	cursor: auto;
}
.mdc-floating-label--float-above {
	transform: translateY(-50%) scale(0.75);
}
.mdc-floating-label--shake {
	animation: mdc-floating-label-shake-float-above-standard 250ms 1;
}
@keyframes mdc-floating-label-shake-float-above-standard {
	0% {
		transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);
	}
	33% {
		animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);
		transform: translateX(calc(4% - 0%)) translateY(-50%) scale(0.75);
	}
	66% {
		animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);
		transform: translateX(calc(-4% - 0%)) translateY(-50%) scale(0.75);
	}
	100% {
		transform: translateX(calc(0 - 0%)) translateY(-50%) scale(0.75);
	}
}
.mdc-line-ripple {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 2px;
	transform: scaleX(0);
	transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1),
		opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);
	opacity: 0;
	z-index: 2;
}
.mdc-line-ripple--active {
	transform: scaleX(1);
	opacity: 1;
}
.mdc-line-ripple--deactivating {
	opacity: 0;
}
.mdc-notched-outline {
	display: flex;
	position: absolute;
	right: 0;
	left: 0;
	box-sizing: border-box;
	width: 100%;
	max-width: 100%;
	height: 100%;
	text-align: left;
	pointer-events: none;
	border-radius: $tf-border-radius;
}

.mdc-notched-outline .mdc-floating-label {
	display: inline-block;
	position: relative;
	top: 17px;
	bottom: auto;
	max-width: 100%;
}
.mdc-notched-outline .mdc-floating-label--float-above {
	text-overflow: clip;
}
.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
	max-width: calc(100% / 0.75);
}
.mdc-notched-outline--notched .mdc-notched-outline__notch {
	padding-left: 0;
	padding-right: 8px;
	border-top: none;
}

.mdc-notched-outline--no-label .mdc-notched-outline__notch {
	padding: 0;
}
@keyframes mdc-ripple-fg-radius-in {
	from {
		animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);
	}
	to {
		transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));
	}
}
@keyframes mdc-ripple-fg-opacity-in {
	from {
		animation-timing-function: linear;
		opacity: 0;
	}
	to {
		opacity: var(--mdc-ripple-fg-opacity, 0);
	}
}
@keyframes mdc-ripple-fg-opacity-out {
	from {
		animation-timing-function: linear;
		opacity: var(--mdc-ripple-fg-opacity, 0);
	}
	to {
		opacity: 0;
	}
}
.mdc-ripple-surface--test-edge-var-bug {
	--mdc-ripple-surface-test-edge-var: 1px solid #000;
	visibility: hidden;
}
.mdc-ripple-surface--test-edge-var-bug::before {
	border: var(--mdc-ripple-surface-test-edge-var);
}

.mdc-text-field--with-leading-icon .mdc-text-field__icon,
.mdc-text-field--with-trailing-icon .mdc-text-field__icon {
	position: absolute;
	bottom: 0;
	cursor: pointer;
}
.mdc-text-field__icon:not([role='button']) {
	cursor: default;
	pointer-events: none;
}
.mdc-text-field {
	--mdc-ripple-fg-size: 0;
	--mdc-ripple-left: 0;
	--mdc-ripple-top: 0;
	--mdc-ripple-fg-scale: 1;
	--mdc-ripple-fg-translate-end: 0;
	--mdc-ripple-fg-translate-start: 0;
	--c-text-field-text-color: #{$color-TEMP_text-alt};
	--c-text-field-error-text-color: RGB(var(--color-accent-error));

	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	border-radius: $tf-border-radius;
	display: inline-flex;
	position: relative;
	box-sizing: border-box;
	width: $tf-width;
	height: $tf-height;
	overflow: visible;
	will-change: opacity, transform, color;
}
.mdc-text-field::before,
.mdc-text-field::after {
	display: none;
	position: absolute;
	border-radius: 50%;
	opacity: 0;
	pointer-events: none;
	content: '';
}
.mdc-text-field::before {
	transition: opacity 15ms linear, background-color 15ms linear;
	z-index: 1;
}

.mdc-text-field:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
.mdc-text-field:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
.mdc-text-field:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
	border-color: rgba($tf-border-color, 0);
}

.mdc-text-field.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--invalid).mdc-text-field--focused
	.mdc-notched-outline {
	border: 1px solid $tf-outline-color--focused;
}

.mdc-text-field.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--invalid)
	.mdc-notched-outline {
	border: 1px solid $tf-outline-color;
}

.mdc-text-field.mdc-text-field--one-border:not(.mdc-text-field--disabled):not(.mdc-text-field--invalid).mdc-text-field--focused
	.mdc-notched-outline {
	border: none;
	border-left: 3px solid RGB(var(--color-accent-icon));
	background-color: var(--background-color);
}

.mdc-text-field.mdc-text-field--one-border:not(.mdc-text-field--disabled):not(.mdc-text-field--invalid)
	.mdc-notched-outline {
	border: none;
	border-left: 3px solid RGB(var(--color-accent-icon));
	background-color: var(--background-color);
}

.mdc-text-field.mdc-text-field--one-border.mdc-text-field--invalid:not(.mdc-text-field--disabled)
	.mdc-notched-outline {
	border: none;
	border-left: 3px solid var(--c-text-field-error-text-color);
	background-color: var(--background-color);
}

.mdc-text-field:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline {
	border: 1px solid $tf-border-color--focused;
}

.mdc-text-field.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline {
	border: 1px solid var(--c-text-field-error-text-color);
}

.mdc-text-field.mdc-ripple-upgraded::before {
	transform: scale(var(--mdc-ripple-fg-scale, 1));
}

.mdc-text-field.mdc-ripple-upgraded::after {
	top: 0;
	left: 0;
	transform: scale(0);
	transform-origin: center center;
}

.mdc-text-field.mdc-ripple-upgraded--unbounded::after {
	top: var(--mdc-ripple-top, 0);
	left: var(--mdc-ripple-left, 0);
}

.mdc-text-field.mdc-ripple-upgraded--foreground-activation::after {
	animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;
}

.mdc-text-field.mdc-ripple-upgraded--foreground-deactivation::after {
	animation: mdc-ripple-fg-opacity-out 150ms;
	transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));
}

.mdc-text-field::before,
.mdc-text-field::after {
	background-color: $tf-bg-color--hovered;
}

.mdc-text-field:hover::before {
	opacity: $tf-bg-color-opacity--hovered;
}

.mdc-text-field:not(.mdc-ripple-upgraded):focus::before,
.mdc-text-field.mdc-ripple-upgraded--background-focused::before {
	transition-duration: 75ms;
	opacity: 0.12;
}

.mdc-text-field::before,
.mdc-text-field::after {
	top: calc(50% - 100%);
	left: calc(50% - 100%);
	width: 200%;
	height: 200%;
}

.mdc-text-field.mdc-ripple-upgraded::after {
	width: var(--mdc-ripple-fg-size, 100%);
	height: var(--mdc-ripple-fg-size, 100%);
}

.mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label {
	color: var(--c-text-field-text-color);
}

.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input {
	color: var(--c-text-field-text-color);
}

.mdc-text-field.mdc-text-field--outlined:not(.mdc-text-field--disabled) {
	--c-text-field-text-color: RGB(var(--color-text-primary));
}

.mdc-text-field .mdc-text-field__input {
	caret-color: var(--c-text-field-text-color);
}

.mdc-text-field.mdc-text-field--outlined .mdc-text-field__input {
	caret-color: $tf-outline-color;
}

.mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea)
	.mdc-text-field__input {
	border-bottom-color: transparent; // With bottom line could be => $tf-input-border-bottom-color;
}

.mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea)
	.mdc-text-field__input:hover {
	border-bottom-color: transparent; // With bottom line could be => $tf-input-border-bottom-color--hovered;
}

.mdc-text-field .mdc-line-ripple {
	background-color: #6bcdb2;
	background-color: var(--mdc-theme-primary, #6bcdb2);
}

.mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--textarea) {
	border-bottom-color: $tf-outline-color;
}

.mdc-text-field:not(.mdc-text-field--disabled)
	+ .mdc-text-field-helper-line
	.mdc-text-field-helper-text {
	color: rgba(0, 0, 0, 0.6);
}

.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon {
	color: var(--c-text-field-text-color);
}

.mdc-text-field:not(.mdc-text-field--disabled) {
	background-color: $tf-bg-color;
}

.mdc-text-field .mdc-floating-label {
	left: 16px;
	right: initial;
	top: 18px;
	pointer-events: none;
}

.mdc-text-field--textarea .mdc-floating-label {
	left: 4px;
	right: initial;
}

.mdc-text-field--outlined .mdc-floating-label {
	left: 4px;
	right: initial;
	top: 17px;
}

.mdc-text-field--outlined--with-leading-icon .mdc-floating-label {
	left: 36px;
	right: initial;
}

.mdc-text-field--outlined--with-leading-icon .mdc-floating-label--float-above {
	left: 40px;
	right: initial;
}

/* Custom style padding */

.mdc-text-field .mdc-text-field__input {
	padding: 16px;
	&::placeholder {
		color: var(--c-text-field-text-color) !important;
		opacity: 0.74;
	}
}

.mdc-text-field__input {
	line-height: 1.75rem;
	letter-spacing: 0.00937em;
	text-decoration: inherit;
	text-transform: inherit;
	align-self: flex-end;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	padding: 20px 16px 6px;
	transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
	border: none;
	border-bottom: 1px solid;
	border-radius: inherit;
	background: none;
	appearance: none;
	resize: none;
}

.mdc-text-field__input:-ms-input-placeholder {
	color: var(--c-text-field-text-color);
	opacity: 0.74;
}

.mdc-text-field__input:focus {
	outline: none;
}
.mdc-text-field__input:invalid {
	box-shadow: none;
}
.mdc-text-field__input:-webkit-autofill {
	z-index: auto !important;
}
.mdc-text-field--no-label:not(.mdc-text-field--outlined):not(.mdc-text-field--textarea)
	.mdc-text-field__input {
	padding-top: 16px;
	padding-bottom: 16px;
}
.mdc-text-field__input:-webkit-autofill + .mdc-floating-label {
	transform: translateY(-50%) scale(0.75);
	cursor: auto;
}
.mdc-text-field--outlined {
	border: none;
	overflow: visible;
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
	border-color: $tf-outline-color;
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__input:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__leading,
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__input:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__notch,
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__input:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__trailing,
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__icon:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__leading,
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__icon:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__notch,
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__icon:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__trailing {
	border-color: RGBA(var(--color-primary), 0);
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused
	.mdc-notched-outline__leading,
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused
	.mdc-notched-outline__notch,
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused
	.mdc-notched-outline__trailing {
	border-color: $tf-outline-color--focused;
}
.mdc-text-field--outlined .mdc-floating-label--shake {
	animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1;
}

.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {
	border-radius: $tf-border-radius--leading;
}

.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing {
	border-radius: $tf-border-radius--trailing;
}

.mdc-text-field--outlined .mdc-floating-label--float-above {
	transform: translateY(-144%) scale(1);
}
.mdc-text-field--outlined .mdc-floating-label--float-above {
	font-size: 0.75rem;
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,
.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
	transform: translateY(-130%) scale(0.75);
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,
.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
	font-size: 1rem;
}
.mdc-text-field--outlined::before,
.mdc-text-field--outlined::after {
	content: none;
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) {
	background-color: $tf-outline-bg-color;
}
.mdc-text-field--outlined .mdc-text-field__input {
	display: flex;
	padding: $tf-outline-padding;
	border: none;
	background-color: transparent;
	z-index: 1;
}
.mdc-text-field--outlined .mdc-text-field__icon {
	z-index: 2;
}
.mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__leading,
.mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__notch,
.mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__trailing {
	border-width: $tf-outline-stroke-width--focused;
}
.mdc-text-field--outlined.mdc-text-field--disabled {
	background-color: rgba(0, 0, 0, 0);
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__leading,
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__notch,
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__trailing {
	border-color: rgba(0, 0, 0, 0.06);
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {
	border-bottom: none;
}
.mdc-text-field--outlined.mdc-text-field--dense {
	height: 48px;
}
.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above {
	transform: translateY(-134%) scale(1);
}
.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above {
	font-size: 0.8rem;
}
.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded
	.mdc-floating-label--float-above,
.mdc-text-field--outlined.mdc-text-field--dense
	.mdc-notched-outline--upgraded
	.mdc-floating-label--float-above {
	transform: translateY(-120%) scale(0.8);
}
.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded
	.mdc-floating-label--float-above,
.mdc-text-field--outlined.mdc-text-field--dense
	.mdc-notched-outline--upgraded
	.mdc-floating-label--float-above {
	font-size: 1rem;
}
.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--shake {
	animation: mdc-floating-label-shake-float-above-text-field-outlined-dense 250ms 1;
}
.mdc-text-field--outlined.mdc-text-field--dense .mdc-text-field__input {
	padding: 12px 12px 7px;
}
.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label {
	top: 14px;
}
.mdc-text-field--outlined.mdc-text-field--dense .mdc-text-field__icon {
	top: 12px;
}
.mdc-text-field--with-leading-icon .mdc-text-field__icon {
	left: 16px;
	right: initial;
}

.mdc-text-field--with-leading-icon .mdc-text-field__input {
	padding-left: 48px;
	padding-right: 16px;
}

.mdc-text-field--with-leading-icon .mdc-floating-label {
	left: 48px;
	right: initial;
}

.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__icon {
	left: 16px;
	right: initial;
}

.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__input {
	padding-left: 48px;
	padding-right: 16px;
}

.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above {
	transform: translateY(-144%) translateX(-32px) scale(1);
}

.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above {
	font-size: 0.75rem;
}
.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded
	.mdc-floating-label--float-above,
.mdc-text-field--with-leading-icon.mdc-text-field--outlined
	.mdc-notched-outline--upgraded
	.mdc-floating-label--float-above {
	transform: translateY(-130%) translateX(-32px) scale(0.75);
}

.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded
	.mdc-floating-label--float-above,
.mdc-text-field--with-leading-icon.mdc-text-field--outlined
	.mdc-notched-outline--upgraded
	.mdc-floating-label--float-above {
	font-size: 1rem;
}
.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake {
	animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1;
}

.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label {
	left: 36px;
	right: initial;
}

.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense
	.mdc-floating-label--float-above {
	transform: translateY(-134%) translateX(-21px) scale(1);
}

.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense
	.mdc-floating-label--float-above {
	font-size: 0.8rem;
}
.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded
	.mdc-floating-label--float-above,
.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense
	.mdc-notched-outline--upgraded
	.mdc-floating-label--float-above {
	transform: translateY(-120%) translateX(-21px) scale(0.8);
}

.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded
	.mdc-floating-label--float-above,
.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense
	.mdc-notched-outline--upgraded
	.mdc-floating-label--float-above {
	font-size: 1rem;
}
.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense
	.mdc-floating-label--shake {
	animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense 250ms 1;
}

.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense
	.mdc-floating-label {
	left: 32px;
	right: initial;
}

.mdc-text-field--with-trailing-icon .mdc-text-field__icon {
	left: initial;
	right: 12px;
}

.mdc-text-field--with-trailing-icon .mdc-text-field__input {
	padding-left: 16px;
	padding-right: 48px;
}

.mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__icon {
	left: initial;
	right: 16px;
}

.mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__input {
	padding-left: 16px;
	padding-right: 48px;
}

.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon {
	left: 16px;
	right: auto;
}

.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon
	.mdc-text-field__icon
	~ .mdc-text-field__icon {
	right: 12px;
	left: auto;
}

.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__input {
	padding-left: 48px;
	padding-right: 48px;
}

.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon,
.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {
	bottom: 16px;
	transform: scale(0.8);
}
.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon {
	left: 12px;
	right: initial;
}

.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input {
	padding-left: 44px;
	padding-right: 16px;
}

.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-floating-label {
	left: 44px;
	right: initial;
}

.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {
	left: initial;
	right: 12px;
}

.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input {
	padding-left: 16px;
	padding-right: 44px;
}

.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense
	.mdc-text-field__icon {
	left: 12px;
	right: auto;
}

.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense
	.mdc-text-field__icon
	~ .mdc-text-field__icon {
	right: 12px;
	left: auto;
}

.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense
	.mdc-text-field__input {
	padding-left: 44px;
	padding-right: 44px;
}

.mdc-text-field--dense .mdc-floating-label--float-above {
	transform: translateY(-70%) scale(0.8);
}
.mdc-text-field--dense .mdc-floating-label--shake {
	animation: mdc-floating-label-shake-float-above-text-field-dense 250ms 1;
}
.mdc-text-field--dense .mdc-text-field__input {
	padding: 12px 12px 0;
}
.mdc-text-field--dense .mdc-floating-label {
	font-size: 0.813rem;
}
.mdc-text-field--dense .mdc-floating-label--float-above {
	font-size: 0.813rem;
}
.mdc-text-field__input:required ~ .mdc-floating-label::after,
.mdc-text-field__input:required ~ .mdc-notched-outline .mdc-floating-label::after {
	margin-left: 1px;
	content: '*';
}
.mdc-text-field--textarea {
	display: inline-flex;
	width: auto;
	height: auto;
	transition: none;
	overflow: visible;
}
.mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
.mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
.mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
	border-color: rgba(0, 0, 0, 0.38);
}
.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__input:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__leading,
.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__input:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__notch,
.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__input:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__trailing,
.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__icon:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__leading,
.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__icon:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__notch,
.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__icon:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__trailing {
	border-color: rgba(0, 0, 0, 0.87);
}
.mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused
	.mdc-notched-outline__leading,
.mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused
	.mdc-notched-outline__notch,
.mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused
	.mdc-notched-outline__trailing {
	border-color: #6bcdb2;
	border-color: var(--mdc-theme-primary, #6bcdb2);
}
.mdc-text-field--textarea .mdc-floating-label--shake {
	animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1;
}
.mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__leading {
	border-radius: $tf-border-radius--leading;
}

.mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__trailing {
	border-radius: $tf-border-radius--trailing;
}

.mdc-text-field--textarea::before,
.mdc-text-field--textarea::after {
	content: none;
}
.mdc-text-field--textarea:not(.mdc-text-field--disabled) {
	background-color: rgba(0, 0, 0, 0);
}
.mdc-text-field--textarea .mdc-floating-label--float-above {
	transform: translateY(-144%) scale(1);
}
.mdc-text-field--textarea .mdc-floating-label--float-above {
	font-size: 0.75rem;
}
.mdc-text-field--textarea.mdc-notched-outline--upgraded .mdc-floating-label--float-above,
.mdc-text-field--textarea .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
	transform: translateY(-130%) scale(0.75);
}
.mdc-text-field--textarea.mdc-notched-outline--upgraded .mdc-floating-label--float-above,
.mdc-text-field--textarea .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
	font-size: 1rem;
}

.mdc-text-field--textarea .mdc-text-field__input {
	align-self: auto;
	box-sizing: border-box;
	height: auto;
	margin: 8px 1px 1px 0;
	padding: 0 16px 16px;
	border: none;
}
.mdc-text-field--textarea .mdc-text-field-character-counter + .mdc-text-field__input {
	margin-bottom: 28px;
	padding-bottom: 0;
}
.mdc-text-field--textarea .mdc-floating-label {
	top: 17px;
	bottom: auto;
	width: auto;
	pointer-events: none;
}
.mdc-text-field--textarea.mdc-text-field--focused .mdc-notched-outline__leading,
.mdc-text-field--textarea.mdc-text-field--focused .mdc-notched-outline__notch,
.mdc-text-field--textarea.mdc-text-field--focused .mdc-notched-outline__trailing {
	border-width: 2px;
}

.mdc-text-field-helper-line {
	display: flex;
	justify-content: space-between;
	box-sizing: border-box;
}
.mdc-text-field--dense + .mdc-text-field-helper-line {
	margin-bottom: 4px;
}
.mdc-text-field + .mdc-text-field-helper-line {
	padding-right: 16px;
	padding-left: 16px;
}
.mdc-form-field > .mdc-text-field + label {
	align-self: flex-start;
}
.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label {
	color: var(--c-text-field-text-color);
	opacity: 0.87;
}
.mdc-text-field--focused .mdc-text-field__input:required ~ .mdc-floating-label::after,
.mdc-text-field--focused
	.mdc-text-field__input:required
	~ .mdc-notched-outline
	.mdc-floating-label::after {
	color: var(--c-text-field-text-color);
	opacity: 0.87;
}
.mdc-text-field--focused
	+ .mdc-text-field-helper-line
	.mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg) {
	opacity: 1;
	transform: translateY(0);
}
.mdc-text-field--textarea.mdc-text-field--focused:not(.mdc-text-field--disabled)
	.mdc-notched-outline__leading,
.mdc-text-field--textarea.mdc-text-field--focused:not(.mdc-text-field--disabled)
	.mdc-notched-outline__notch,
.mdc-text-field--textarea.mdc-text-field--focused:not(.mdc-text-field--disabled)
	.mdc-notched-outline__trailing {
	border-color: #6bcdb2;
	border-color: var(--mdc-theme-primary, #6bcdb2);
}
.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea)
	.mdc-text-field__input {
	border-bottom-color: transparent;
	border-bottom-color: var(--mdc-theme-error, transparent);
}
.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea)
	.mdc-text-field__input:hover {
	border-bottom-color: transparent;
	border-bottom-color: var(--mdc-theme-error, transparent);
}
.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple {
	background-color: transparent;
	background-color: var(--mdc-theme-error, transparent);
}
.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label {
	color: var(--c-text-field-error-text-color);
}
.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--invalid
	+ .mdc-text-field-helper-line
	.mdc-text-field-helper-text--validation-msg {
	color: var(--c-text-field-error-text-color);
	opacity: 1 !important;
}
.mdc-text-field--invalid .mdc-text-field__input {
	caret-color: var(--c-text-field-error-text-color);
}
.mdc-text-field--invalid .mdc-text-field__input:required ~ .mdc-floating-label::after,
.mdc-text-field--invalid
	.mdc-text-field__input:required
	~ .mdc-notched-outline
	.mdc-floating-label::after {
	color: var(--c-text-field-error-text-color);
}
/* Change icon color when text field invalid */

.mdc-text-field--invalid.mdc-text-field--with-trailing-icon:not(.mdc-text-field--with-leading-icon):not(.mdc-text-field--disabled)
	.mdc-text-field__icon {
	color: var(--c-text-field-text-color);
}
.mdc-text-field--invalid.mdc-text-field--with-trailing-icon.mdc-text-field--with-leading-icon:not(.mdc-text-field--disabled)
	.mdc-text-field__icon
	~ .mdc-text-field__icon {
	color: var(--c-text-field-text-color);
}
.mdc-text-field--invalid + .mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg {
	opacity: 1;
	transform: translateY(0);
	margin-bottom: 8px;
	height: auto;
}
.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled)
	.mdc-notched-outline__leading,
.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled)
	.mdc-notched-outline__notch,
.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled)
	.mdc-notched-outline__trailing {
	border-color: #ff8a8a;
	border-color: var(--mdc-theme-error, #ff8a8a);
}
.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__input:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__leading,
.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__input:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__notch,
.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__input:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__trailing,
.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__icon:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__leading,
.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__icon:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__notch,
.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__icon:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__trailing {
	border-color: #ff8a8a;
	border-color: var(--mdc-theme-error, #ff8a8a);
}
.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused
	.mdc-notched-outline__leading,
.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused
	.mdc-notched-outline__notch,
.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused
	.mdc-notched-outline__trailing {
	border-color: #ff8a8a;
	border-color: var(--mdc-theme-error, #ff8a8a);
}
/*
    Change outline color when text field invalid
*/
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled)
	.mdc-notched-outline__leading,
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled)
	.mdc-notched-outline__notch,
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled)
	.mdc-notched-outline__trailing {
	border-color: var(--c-text-field-error-text-color);
	// border-color: var(--mdc-theme-error, #ff8a8a);
}
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__input:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__leading,
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__input:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__notch,
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__input:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__trailing,
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__icon:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__leading,
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__icon:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__notch,
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused)
	.mdc-text-field__icon:hover
	~ .mdc-notched-outline
	.mdc-notched-outline__trailing {
	border-color: var(--c-text-field-error-text-color);
}
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused
	.mdc-notched-outline__leading,
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused
	.mdc-notched-outline__notch,
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused
	.mdc-notched-outline__trailing {
	border-color: var(--c-text-field-error-text-color);
}
.mdc-text-field--disabled {
	background-color: #fafafa;
	border-bottom: none;
	pointer-events: none;
}
.mdc-text-field--disabled .mdc-text-field__input {
	border-bottom-color: rgba(0, 0, 0, 0);
}
.mdc-text-field--disabled .mdc-floating-label,
.mdc-text-field--disabled .mdc-text-field__input,
.mdc-text-field--disabled + .mdc-text-field-helper-line .mdc-text-field-helper-text,
.mdc-text-field--disabled .mdc-text-field__icon {
	color: var(--c-text-field-text-color);
	opacity: 0.37;
}

.mdc-text-field--disabled:not(.mdc-text-field--textarea) {
	border-bottom-color: rgba(0, 0, 0, 0);
}
.mdc-text-field--disabled .mdc-floating-label {
	cursor: default;
}
.mdc-text-field--textarea.mdc-text-field--disabled {
	background-color: rgba(0, 0, 0, 0);
	background-color: #f9f9f9;
}
.mdc-text-field--textarea.mdc-text-field--disabled .mdc-notched-outline__leading,
.mdc-text-field--textarea.mdc-text-field--disabled .mdc-notched-outline__notch,
.mdc-text-field--textarea.mdc-text-field--disabled .mdc-notched-outline__trailing {
	border-color: rgba(0, 0, 0, 0.06);
}
.mdc-text-field--textarea.mdc-text-field--disabled .mdc-text-field__input {
	border-bottom: none;
}
@keyframes mdc-floating-label-shake-float-above-text-field-dense {
	0% {
		transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);
	}
	33% {
		animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);
		transform: translateX(calc(4% - 0%)) translateY(-70%) scale(0.8);
	}
	66% {
		animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);
		transform: translateX(calc(-4% - 0%)) translateY(-70%) scale(0.8);
	}
	100% {
		transform: translateX(calc(0 - 0%)) translateY(-70%) scale(0.8);
	}
}
@keyframes mdc-floating-label-shake-float-above-text-field-outlined {
	0% {
		transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);
	}
	33% {
		animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);
		transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);
	}
	66% {
		animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);
		transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);
	}
	100% {
		transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);
	}
}
@keyframes mdc-floating-label-shake-float-above-text-field-outlined-dense {
	0% {
		transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);
	}
	33% {
		animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);
		transform: translateX(calc(4% - 0%)) translateY(-120%) scale(0.8);
	}
	66% {
		animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);
		transform: translateX(calc(-4% - 0%)) translateY(-120%) scale(0.8);
	}
	100% {
		transform: translateX(calc(0 - 0%)) translateY(-120%) scale(0.8);
	}
}
@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon {
	0% {
		transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);
	}
	33% {
		animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);
		transform: translateX(calc(4% - 0)) translateY(-130%) scale(0.75);
	}
	66% {
		animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);
		transform: translateX(calc(-4% - 0)) translateY(-130%) scale(0.75);
	}
	100% {
		transform: translateX(calc(0 - 0)) translateY(-130%) scale(0.75);
	}
}
@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense {
	0% {
		transform: translateX(calc(0 - 21px)) translateY(-120%) scale(0.8);
	}
	33% {
		animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);
		transform: translateX(calc(4% - 21px)) translateY(-120%) scale(0.8);
	}
	66% {
		animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);
		transform: translateX(calc(-4% - 21px)) translateY(-120%) scale(0.8);
	}
	100% {
		transform: translateX(calc(0 - 21px)) translateY(-120%) scale(0.8);
	}
}

@keyframes mdc-floating-label-shake-float-above-textarea {
	0% {
		transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);
	}
	33% {
		animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);
		transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);
	}
	66% {
		animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);
		transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);
	}
	100% {
		transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);
	}
}
</style>
