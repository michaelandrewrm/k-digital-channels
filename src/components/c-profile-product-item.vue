<template>
	<button
		class="c-profile-product-item"
		@click="checkboxValue = !checkboxValue"
		:class="{ '--selected': checkboxValue }"
	>
		<div class="c-profile-product-item__checkbox">
			<c-checkbox v-model="checkboxValue" />
		</div>
		<div class="c-profile-product-item__title text-m-medium">{{ title }}</div>
	</button>
</template>

<script>
import CCheckbox from '@components/c-checkbox';

export default {
	name: 'c-profile-product-item',

	model: {
		prop: 'value',
		event: 'update:value',
	},

	components: { CCheckbox },

	props: { value: Boolean, title: String },

	computed: {
		checkboxValue: {
			get() {
				return this.value;
			},
			set() {
				this.$emit('update:value', !this.value);
				this.$emit('select-item', !this.value);
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.c-profile-product-item {
	color: RGB(var(--color-text-primary));
	appearance: none;
	display: grid;
	position: relative;
	width: 100%;
	height: 56px;
	grid-template-columns: min(16px) auto;
	column-gap: 30px;
	border: 0;
	padding: 20px 10px;
	border-radius: $border-radius-l;
	user-select: none;
	background: RGB(var(--color-surface-dark));
	box-shadow: 0px 5px 10px -10px rgba(0, 0, 0, 0.3);
}

.c-profile-product-item.--selected {
	background: RGB(var(--color-surface-light));
}

.c-profile-product-item__checkbox .c-checkbox {
	--c-checkbox-color: var(--color-text-primary);
}

.c-profile-product-item__checkbox {
	grid-row: span 2;
	width: 16px;
	height: 16px;
	justify-self: center;
	align-self: center;
}

.c-profile-product-item__title {
	text-align: start;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
