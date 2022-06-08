<template>
	<div class="c-transfer-field-helper-line">
		<div
			class="c-transfer-field-helper-text text-s-book"
			:class="classes"
			v-bind="$attrs"
			aria-hidden="true"
			:id="helperId"
		>
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	name: 'c-transfer-field-helper-text',

	inheritAttrs: false,

	props: {
		persistent: { type: Boolean, default: false },
		for: { type: String },
	},

	computed: {
		classes({ persistent }) {
			return {
				'--persistent': persistent,
			};
		},

		helperId({ for: id }) {
			return id ? `${id}-helper` : '';
		},
	},
};
</script>

<style lang="scss" scoped>
.c-transfer-field-helper-text {
	display: block;
	height: 0;
	margin: 0;
	margin-top: 0;
	color: RGB(var(--color-text-primary));
	line-height: 1.25rem;
	letter-spacing: 0.03333em;
	text-decoration: inherit;
	text-transform: inherit;
	line-height: normal;
	transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1),
		transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
	opacity: 0;
	transform: translateY(-50%);
	will-change: opacity, transform;
}

.c-transfer-field-helper-text.--persistent {
	visibility: visible;
	opacity: 1;
	transform: translateY(0);
	height: auto;
	margin-top: 8px;
}

.c-transfer-field-helper-line {
	.c-transfer-field + &,
	.c-transfer-date-picker + &,
	.c-transfer-select-field + &,
	.c-transfer-textarea + &,
	.c-transfer-radio + &,
	.c-checkbox + &,
	.c-input-phone + &,
	.c-transfer-input-amount + & {
		visibility: hidden;
	}

	.c-transfer-field.--invalid + &,
	.c-transfer-date-picker.--invalid + &,
	.c-transfer-select-field.--invalid + &,
	.c-transfer-textarea.--invalid + &,
	.c-transfer-radio.--invalid + &,
	.c-input-phone.--invalid + &,
	.c-checkbox.--invalid + &,
	.c-transfer-input-amount.--invalid + & {
		visibility: visible;

		.c-transfer-field-helper-text {
			color: RGB(var(--color-text-error));
			opacity: 1;
			transform: translateY(0);
			height: auto;
			margin-top: 8px;
		}
	}
}
</style>
