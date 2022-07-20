<template>
	<div class="c-helper-item">
		<div>titulo</div>
		<div></div>
	</div>
</template>

<script>
export default {
	name: 'c-helper-item',

	props: {
		title: String,
		text: String,
	},
};
</script>

<style lang="scss" scoped>
.c-helper-item {
	width: 330px;
	height: 80px;
	border-top: solid 1px RGB(var(--color-primary-light));
	border-bottom: solid 1px RGB(var(--color-primary-light));
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 20px;
}
</style>
