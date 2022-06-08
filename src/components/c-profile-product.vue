<template>
	<button
		class="c-profile-product"
		:class="{ '--selected': checkboxValue }"
		@click="checkboxValue = !checkboxValue"
	>
		<div class="c-profile-product__checkbox">
			<c-checkbox v-model="checkboxValue" />
		</div>
		<div class="c-profile-product__title text-m-medium">{{ title }}</div>
		<div class="c-profile-product__subtitle text-s-book">{{ subtitle }}</div>
		<div class="c-profile-product__info text-m-medium">{{ info }}</div>
		<div class="c-profile-product__subinfo text-s-book">{{ subinfo }}</div>
	</button>
</template>

<script>
import CCheckbox from '@components/c-checkbox';

export default {
	name: 'c-profile-product',

	model: {
		prop: 'value',
		event: 'update:value',
	},

	components: { CCheckbox },

	props: {
		value: Boolean,
		title: String,
		subtitle: String,
		info: String,
		subinfo: String,
	},

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
.c-profile-product {
	color: RGB(var(--color-text-primary));
	appearance: none;
	display: grid;
	position: relative;
	width: 100%;
	grid-template-columns: min(16px) auto auto;
	column-gap: 20px;
	row-gap: 10px;
	border: 0;
	padding: 10px;
	border-radius: $border-radius-l;
	user-select: none;
	background: RGB(var(--color-surface-dark));
}

.c-profile-product.--selected {
	background: RGB(var(--color-surface-light));
}

.c-profile-product__checkbox .c-checkbox {
	--c-checkbox-color: var(--color-text-primary);
}

.c-profile-product__checkbox {
	grid-row: span 2;
	justify-self: center;
	align-self: center;
}

.c-profile-product__title,
.c-profile-product__subtitle {
	text-align: start;
}

.c-profile-product__subtitle {
	grid-row: 2;
	grid-column: 2;
}

.c-profile-product__info,
.c-profile-product__subinfo {
	text-align: end;
	grid-column: 3;
}
</style>
