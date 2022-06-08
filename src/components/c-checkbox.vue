<template>
	<label
		tabindex="0"
		class="c-checkbox"
		:class="classNames"
		@keyup.space="$emit('update:value', !value)"
		role="checkbox"
	>
		<input
			type="checkbox"
			:value="value"
			:name="name"
			v-bind="$attrs"
			v-on="$listeners"
			v-model="checkboxButtonValue"
			:disabled="disabled"
			tabindex="-1"
		/>
		<div class="c-checkbox__virtual"></div>
		<div class="c-checkbox__invisible_space"></div>
		<span v-if="label" class="c-checkbox__label">{{ label }}</span>
	</label>
</template>

<script>
export default {
	name: 'c-checkbox',

	inheritAttrs: false,

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		name: {
			type: String,
			default() {
				const uid = performance
					.now()
					.toString()
					.replace('.', 7);
				return `checkbox-${uid}`;
			},
		},
		label: { type: String, default: '' },
		value: { type: Boolean },
		disabled: { type: Boolean },
		type: {
			type: String,
			validator(value) {
				return ['checkbox', 'button'].includes(value);
			},
			default: 'checkbox',
		},
	},

	computed: {
		checkboxButtonValue: {
			get() {
				return this.value;
			},
			set() {
				this.$emit('update:value', !this.value);
			},
		},

		classNames({ type }) {
			return {
				'--type-checkbox': type === 'checkbox',
				'--type-button': type === 'button',
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.c-checkbox {
	display: inline-flex;
	align-items: center;
	position: relative;
	outline: none;

	--color: var(--c-checkbox-color, var(--color-accent-icon, currentColor));

	@media (hover) {
		& {
			cursor: pointer;
		}
	}

	input[type='checkbox'] {
		opacity: 0;
		width: 0;
		height: 16px;
		appearance: none;
	}
}

.c-checkbox.--type-checkbox {
	.c-checkbox__invisible_space {
		width: 10px;
		height: 16px;
	}

	.c-checkbox__label {
		position: relative;
		display: inline-block;
		user-select: none;
		outline: 0;
	}

	input[type='checkbox'] + .c-checkbox__virtual {
		position: relative;
		width: 16px;
		height: 16px;
	}

	input[type='checkbox'] + .c-checkbox__virtual::before,
	input[type='checkbox'] + .c-checkbox__virtual::after {
		visibility: visible;
		content: '';
		display: inline-block;
		position: absolute;
		border-radius: 2px;
		width: 16px;
		height: 16px;
		border: 2px solid RGBA(var(--color));
	}

	input[type='checkbox'] + .c-checkbox__virtual::after {
		background-color: RGB(var(--color));
		transition: transform 100ms ease;
		transform: scale(0);
	}

	input[type='checkbox']:checked + .c-checkbox__virtual::after {
		transform: scale(1);
	}

	input[type='checkbox']:disabled + .c-checkbox__virtual {
		opacity: 0.5;
		cursor: default;
	}

	input[type='checkbox']:disabled + .c-checkbox__virtual::before {
		border-color: RGBA(var(--color), 0.3);
	}

	input[type='checkbox']:disabled + .c-checkbox__virtual::after {
		background-color: RGBA(var(--color), 0.3);
	}
}

.c-checkbox.--type-button {
	.c-checkbox__virtual,
	.c-checkbox__invisible_space {
		display: none;
	}

	input[type='checkbox'] ~ .c-checkbox__label {
		position: relative;
		display: inline-block;
		padding: 12px 0;
		background-color: RGB(var(--color-surface-light));
		color: RGB(var(--color));
		width: 100%;
		text-align: center;
		border-radius: $border-radius-s;
		user-select: none;
		@extend %typo-m-light;
	}

	input[type='checkbox']:checked ~ .c-checkbox__label {
		background-color: RGB(var(--color));
		color: RGB(var(--color-text-primary-light));
	}

	input[type='checkbox']:disabled ~ .c-checkbox__label {
		background-color: RGB(var(--color-surface-dark));
		color: RGBA(var(--color), 0.6);
		cursor: default;
	}

	input[type='checkbox']:disabled:checked ~ .c-checkbox__label {
		background-color: RGBA(var(--color), 0.3);
		color: RGB(var(--color-text-primary-light));
	}

	input[type='checkbox']:focus:focus-visible ~ .c-checkbox__label {
		box-shadow: 0 0px 0px 2px RGB(var(--color-secondary));
	}
}
</style>
