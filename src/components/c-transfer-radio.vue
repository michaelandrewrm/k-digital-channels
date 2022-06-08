<template>
	<div class="c-transfer-radio" :class="classNames">
		<input
			:id="id"
			type="radio"
			v-bind="$attrs"
			v-on="$listeners"
			:value="value"
			:name="name"
			v-model="radioButtonValue"
			:disabled="disabled"
		/>
		<label :for="id">{{ label }}</label>
	</div>
</template>

<script>
const hasherize = (string) => string.toLowerCase().replace(/\W/g, '_');

export default {
	name: 'c-transfer-radio',

	inheritAttrs: false,

	model: {
		prop: 'model',
		event: 'update:model',
	},

	props: {
		name: { type: String, default: 'radio' },
		label: { type: String, default: '' },
		value: { type: String },
		model: { type: String },
		disabled: { type: Boolean },
		type: {
			type: String,
			validator(value) {
				return ['radio', 'button'].includes(value);
			},
			default: 'radio',
		},
	},

	computed: {
		id({ name, _uid: uid }) {
			return `${hasherize(name)}-${uid}`;
		},

		radioButtonValue: {
			get() {
				return this.model;
			},
			set() {
				this.$emit('update:model', this.value);
			},
		},

		classNames({ type }) {
			return {
				'--type-radio': type === 'radio',
				'--type-button': type === 'button',
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.c-transfer-radio.--type-radio {
	display: flex;

	input[type='radio'] {
		opacity: 0;
		width: 16px;
		height: 16px;
		margin-right: 10px;
	}

	input[type='radio'] + label {
		position: relative;
		display: inline-block;
	}

	@media (hover) {
		input[type='radio'] + label {
			cursor: pointer;
		}
	}

	input[type='radio'] + label::before {
		content: '';
		display: inline-block;
		position: absolute;
		left: -26px;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		background-color: RGBA(var(--color-accent-icon), 0.8);
	}

	input[type='radio'] + label::after {
		content: '';
		position: absolute;
		display: inline-block;
		left: -23px;
		top: 3px;
		border-radius: 50%;
		width: 10px;
		height: 10px;
		background-color: RGB(var(--color-primary));
		transition: transform 100ms ease;
		transform: scale(0);
	}

	input[type='radio']:checked + label::after {
		transform: scale(1);
	}

	input[type='radio']:disabled + label {
		opacity: 0.5;
		cursor: default;
	}

	input[type='radio']:disabled + label::before {
		background-color: RGBA(var(--color-accent-icon), 0.3);
	}

	input[type='radio']:disabled + label::after {
		background-color: RGBA(var(--color-primary), 0.6);
	}

	input[type='radio']:focus:focus-visible + label::before {
		box-shadow: 0 0px 0px 2px RGB(var(--color-secondary));
	}
}

.c-transfer-radio.--type-button {
	display: inline-flex;

	input[type='radio'] {
		position: relative;
		opacity: 0;
		width: 0;
		height: 16px;
	}

	input[type='radio'] + label {
		position: relative;
		display: inline-block;
		padding: 12px 0;
		background-color: RGB(var(--color-surface-light));
		color: RGB(var(--color-text-accent));
		width: 100%;
		text-align: center;
		border-radius: $border-radius-s;
		@extend %typo-m-book;
	}

	@media (hover) {
		input[type='radio'] + label {
			cursor: pointer;
		}
	}

	input[type='radio']:checked + label {
		background-color: RGB(var(--color-accent-icon));
		color: RGB(var(--color-text-primary-light));
	}

	input[type='radio']:disabled + label {
		background-color: RGB(var(--color-surface-dark));
		color: RGBA(var(--color-accent-icon), 0.6);
		cursor: default;
	}

	input[type='radio']:disabled:checked + label {
		background-color: RGBA(var(--color-accent-icon), 0.3);
		color: RGB(var(--color-text-primary-light));
	}

	input[type='radio']:focus:focus-visible + label {
		box-shadow: 0 0px 0px 2px RGB(var(--color-secondary));
	}
}
</style>
