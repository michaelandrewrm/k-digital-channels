<template>
	<div class="c-transfer-textarea" :class="classes">
		<textarea
			ref="input"
			:value="value"
			class="c-transfer-textarea__input text-fixed-m-book"
			v-bind="$attrs"
			v-on="$listeners"
			@input="$emit('model', $event.target.value)"
		/>
	</div>
</template>

<script>
export default {
	name: 'c-transfer-textarea',

	inheritAttrs: false,

	model: {
		prop: 'value',
		event: 'model',
	},

	props: {
		value: { type: String, default: '' },
		valid: { type: Boolean, default: true },
	},

	computed: {
		classes() {
			return {
				'--invalid': !this.valid,
			};
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
.c-transfer-textarea {
	display: flex;
	width: 100%;
	flex-direction: column;
	color: RGB(var(--color-text-primary));
}

.c-transfer-textarea__input {
	appearance: none;
	display: inline-flex;
	position: relative;
	width: 100%;
	overflow: visible;
	color: RGB(var(--color-text-primary));
	padding: 10px;
	justify-content: center;
	border-left: 3px solid RGB(var(--color-accent-icon));
	border-radius: $border-radius-s;
	background-color: RGB(var(--color-surface-light));
	outline: none;
	resize: none;
}

.c-transfer-textarea__input::placeholder {
	color: RGB(var(--color-accent-icon));
}

.c-transfer-textarea.--invalid .c-transfer-textarea__input {
	border: 1px solid;
	border-left: 3px solid;
	border-color: RGB(var(--color-text-error));
	caret-color: RGB(var(--color-text-error));
}
</style>
