<template>
	<l-action-sheet :loading="loading">
		<span slot="title">{{ title }}</span>
		<div slot="options" class="m-options__list" data-testid="option-list">
			<button
				class="m-options__button"
				v-for="option in options"
				@click="select(option)"
				:key="option.id"
				:data-testid="`option-${option.id}`"
			>
				<c-icon v-if="option.icon" :src="option.icon" class="m-options__icon text-m-book" />
				<span class="text-m-book">{{ option.title }}</span>
			</button>
		</div>
	</l-action-sheet>
</template>

<script>
import LActionSheet from '@layouts/l-action-sheet';
import CIcon from '@components/c-icon';

export default {
	name: 'm-options',

	components: {
		LActionSheet,
		CIcon,
	},

	props: { title: String, options: Array },

	data() {
		return {
			value: null,
			loading: false,
		};
	},

	methods: {
		async select(option) {
			this.loading = true;
			this.value = option;
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.m-options__list {
	display: block;
	flex-grow: 1;
}

.m-options__button {
	appearance: none;
	background: transparent;
	border: 0;
	margin: 0;
	padding: 0;
	display: block;
	width: 100%;
	text-align: left;
	position: relative;
	color: RGB(var(--color-text-primary));
	padding: 10px;
	display: flex;
	flex-direction: row;
}

.m-options__button:not(:first-of-type) {
	margin: 10px 0;
}

.m-options__icon {
	flex-shrink: 0;
	width: 16px;
	margin-right: 10px;
}
</style>
