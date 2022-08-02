<template>
	<div class="c-helper-item">
		<div class="c-helper-item__content">
			<h3 class="c-helper-item__title text-m-medium">{{ title }}</h3>
			<c-icon-button class="c-helper-item__button" icon="@icons/more" raised @click="toggle" />
		</div>
		<div class="c-helper-item__text" v-show="active">
			{{ text }}
		</div>
	</div>
</template>

<script>
import CIconButton from '@components/c-icon-button';

export default {
	name: 'c-helper-item',

	components: { CIconButton },

	data() {
		return {
			active: false,
		};
	},

	props: {
		title: String,
		text: String,
	},

	methods: {
		toggle() {
			this.active = !this.active;
		},
	},
};
</script>

<style lang="scss" scoped>
.c-helper-item {
	width: 100%;
	min-height: 80px;
	color: RGB(var(--color-text-primary));
	border-bottom: solid 1px RGB(var(--color-primary-light));
	margin-top: 10px;
	padding: 20px 0;
}
.c-helper-item__content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 20px;
	gap: 30px;
}
.c-helper-item__button {
	min-width: 40px;
}
.c-helper-item__button-icon {
	color: RGB(var(--color-text-primary));
}
.c-helper-item__text {
	margin: 20px 0;
	font-size: 1.4rem;
}
@media ($on-mobile) {
	.c-helper-item__content {
		flex-wrap: wrap;
	}
	.c-helper-item__button {
		width: 100%;
	}
}
</style>
