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
	color: RGB(var(--color-primary));
	border-top: solid 1px RGB(var(--color-primary-light));
	margin-top: 10px;
}
.c-helper-item__content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 20px;
}
.c-helper-item__title {
	max-width: 270px;
}
.c-helper-item__button-icon {
	color: RGB(var(--color-primary));
}
.c-helper-item__text {
	margin: 20px 0;
	font-size: 1.4rem;
}
</style>
