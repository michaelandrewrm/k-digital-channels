<template>
	<div class="c-transfer-field" :class="classNames">
		<slot />
		<input
			:id="id"
			ref="input"
			:value="value"
			:type="type"
			class="c-transfer-field__input text-fixed-m-book"
			v-bind="$attrs"
			v-on="$listeners"
			:aria-invalid="!valid"
			:aria-describedby="helperId"
			@input="$emit('update:value', $event.target.value)"
		/>
	</div>
</template>

<script>
export default {
	name: 'c-transfer-field',

	inheritAttrs: false,

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		value: { type: String, default: '' },
		valid: { type: Boolean, default: true },
		type: { type: String, default: 'text' },
		id: { type: String },
	},

	computed: {
		classNames({ valid, type }) {
			return {
				'--invalid': !valid,
				[`--type-${type}`]: true,
			};
		},

		helperId({ id }) {
			return id ? `${id}-helper` : '';
		},
	},

	methods: {
		focus() {
			this.$refs.input.focus();
		},
	},
};
</script>

<style lang="scss" scoped>
.c-transfer-field {
	display: flex;
	width: 100%;
	flex-direction: column;
	color: RGB(var(--color-text-primary));
}

.c-transfer-field__input {
	appearance: none;
	display: inline-flex;
	position: relative;
	width: 100%;
	height: 40px;
	overflow: visible;
	color: RGB(var(--color-text-primary));
	padding-left: 10px;
	justify-content: center;
	border-left: 3px solid RGB(var(--color-accent-icon));
	border-radius: $border-radius-s;
	background-color: RGB(var(--color-surface-light));
	outline: none;
	font-variant: inherit;
}

.c-transfer-field__input::placeholder {
	color: RGB(var(--color-accent-icon));
}

.c-transfer-field.--invalid .c-transfer-field__input {
	border: 1px solid;
	border-left: 3px solid;
	border-color: RGB(var(--color-text-error));
	caret-color: RGB(var(--color-text-error));
}
</style>
