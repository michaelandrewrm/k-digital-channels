<template>
	<div class="w-bizum-ong">
		<button class="w-bizum-ong__button">
			<div class="text-m-medium">{{ source.name }}</div>
			<div class="text-m-book">{{ source.id.slice(-5) }}</div>
		</button>
	</div>
</template>

<script>
export default {
	name: 'w-bizum-ong',

	props: {
		source: { type: Object },
		name: { type: String },
	},
};
</script>

<style lang="scss" scoped>
.w-bizum-ong {
	border-top: 2px solid RGB(var(--color-surface-dark));
	padding: 10px 0;
	height: 74px;
}

.w-bizum-ong__button {
	appearance: none;
	border: 0;
	background: none;
	width: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-decoration: none;
	text-align: left;
	padding: 10px 15px;
	border-radius: $border-radius-s;
	color: inherit;
}
</style>
