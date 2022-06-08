<template>
	<div class="mdc-text-field-helper-line">
		<div aria-hidden="true" class="mdc-text-field-helper-text text-m-book" v-bind="$attrs">
			<slot />
		</div>
		<slot name="characterCounter" />
	</div>
</template>

<script>
import { MDCTextFieldHelperText } from '@material/textfield/helper-text';

export default {
	name: 'c-text-field-helper-text',
	inheritAttrs: false,
	props: {
		persistent: {
			type: Boolean,
			default: false,
		},
		validationMsg: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			mdcTextFieldHelperText: undefined,
		};
	},
	watch: {
		persistent() {
			this.mdcTextFieldHelperText.foundation.setPersistent(this.persistent);
		},
		validationMsg() {
			this.mdcTextFieldHelperText.foundation.setValidation(this.validationMsg);
		},
	},
	mounted() {
		this.mdcTextFieldHelperText = MDCTextFieldHelperText.attachTo(this.$el.children[0]);
		this.mdcTextFieldHelperText.foundation.setPersistent(this.persistent);
		this.mdcTextFieldHelperText.foundation.setValidation(this.validationMsg);
	},

	/* istanbul ignore next */
	beforeDestroy() {
		this.mdcTextFieldHelperText.destroy();
	},
};
</script>
<style lang="scss" scoped>
$tf-text-color-error: RGB(var(--color-accent-error));

.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--invalid
	+ .mdc-text-field-helper-line
	.mdc-text-field-helper-text--validation-msg {
	color: $tf-text-color-error;
	opacity: 1;
	transform: translateY(0);
	height: auto;
	margin-top: 8px;
}

.mdc-text-field-helper-text {
	line-height: 1.25rem;
	letter-spacing: 0.03333em;
	text-decoration: inherit;
	text-transform: inherit;
	text-align: right;
	display: block;
	margin-top: 0;
	line-height: normal;
	margin: 0;
	transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1),
		transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
	opacity: 0;
	transform: translateY(-50%);
	will-change: opacity, transform;
	color: transparent;
	height: 0;
}
.mdc-text-field-helper-text::before {
	display: inline-block;
	width: 0;
	height: 16px;
	content: '';
	vertical-align: 0;
}
.mdc-text-field-helper-text--persistent {
	color: $tf-text-color-error;
	opacity: 1;
	transform: translateY(0);
	height: auto;
	margin-top: 8px;
}
</style>
