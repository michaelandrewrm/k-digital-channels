<template>
	<div class="c-placeholder-item" aria-hidden="true">
		<div class="c-placeholder-item__col1"></div>
		<div class="c-placeholder-item__col2"></div>
		<div class="c-placeholder-item__col3"></div>
	</div>
</template>

<script>
export default {
	name: 'c-placeholder-item',
};
</script>

<style lang="scss" scoped>
.c-placeholder-item {
	margin-bottom: 10px;
	width: 100%;
	height: 44px;
	border-radius: $border-radius-xs;
	position: relative;
	overflow: hidden;
}

.c-placeholder-item::after {
	content: '';
	display: block;
	background: linear-gradient(
		90deg,
		RGBA(var(--color-surface), 0) 35%,
		RGB(var(--color-surface)) 50%,
		RGBA(var(--color-surface), 0) 65%
	);
	width: 100%;
	height: 100%;
	transform: translateX(-65%);
	position: absolute;
	left: 0;
	top: 0;
	animation: shime 1s ease-in-out forwards infinite;
}

.c-placeholder-item__col1,
.c-placeholder-item__col2,
.c-placeholder-item__col3 {
	background: RGBA(var(--color-text-primary), 0.065);
	height: 14px;
	border-radius: $border-radius-xs;
	position: absolute;
}

.c-placeholder-item__col1 {
	left: 0;
	width: 20px;
	height: 20px;
}

.c-placeholder-item__col2 {
	left: 40px;
	width: 100%;
}

.c-placeholder-item__col3 {
	top: 20px;
	left: 40px;
	width: 90px;
}

@keyframes shime {
	to {
		transform: translateX(65%);
	}
}
</style>
