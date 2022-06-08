<template>
	<div class="c-transfer-select-field" :class="classNames">
		<label for="select-input" class="c-transfer-select-field__label">
			<span v-if="selectedOption" class="text-m-book">{{ selectedOption }}</span>
			<span v-else class="c-transfer-select-field__placeholder text-m-book">{{ label }}</span>
			<span class="c-transfer-select-field__arrow">
				<c-icon class="c-transfer-select-field__icon" src="@icons/back" size="none" />
			</span>
		</label>
		<select
			ref="input"
			id="select-input"
			@change="getSelectedOption"
			v-bind="$attrs"
			v-on="$listeners"
		>
			<option v-if="optional" value=""></option>
			<option v-for="opt in options" v-bind:key="opt.id" :value="opt.id">
				{{ opt.label }}
			</option>
		</select>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'c-transfer-select-field',

	inheritAttrs: false,

	components: { CIcon },

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		label: { type: String },
		options: { type: Array },
		valid: { type: Boolean, default: true },
		value: { type: String },
		optional: { type: Boolean, default: true },
	},

	computed: {
		classNames({ valid }) {
			return { '--invalid': !valid };
		},

		selectedOption({ value }) {
			return this.options?.find(({ id }) => id === value)?.label;
		},
	},

	methods: {
		focus() {
			this.$refs.input.focus();
		},

		getSelectedOption({ target }) {
			const { value } = target;

			this.$emit('change', value);
			this.$emit('update:value', value);
		},
	},
};
</script>

<style lang="scss" scoped>
.c-transfer-select-field {
	position: relative;
	height: 40px;
}

.c-transfer-select-field__label {
	display: flex;
	position: absolute;
	width: 100%;
	height: 40px;
	flex-direction: row;
	align-items: center;
	padding-left: 10px;
	border: none;
	border-left: 3px solid RGB(var(--color-accent-icon));
	border-radius: $border-radius-s;
	background: RGB(var(--color-surface-light));
	overflow: hidden;
}

.c-transfer-select-field__placeholder {
	color: RGB(var(--color-text-accent));
}

.c-transfer-select-field__arrow {
	display: flex;
	position: absolute;
	right: 0;
	bottom: 0;
	flex-shrink: 0;
	width: 40px;
	height: 100%;
	background-color: RGB(var(--color-accent-icon));
	justify-content: center;
	align-items: center;
}

.c-transfer-select-field__icon {
	color: RGB(var(--color-text-primary-light));
	transform: rotate(-90deg);
	font-size: 10px;
}

select {
	// Fix for safari CD-3680
	appearance: button;
	width: 100%;
	height: 40px;
	opacity: 0;
}

.c-transfer-select-field.--invalid .c-transfer-select-field__label {
	border: 1px solid;
	border-left: 3px solid;
	border-color: RGB(var(--color-text-error));
	caret-color: RGB(var(--color-text-error));
}
</style>
