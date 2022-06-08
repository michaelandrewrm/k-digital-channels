<template>
	<div class="c-placeholder-movement" aria-hidden="true">
		<div class="c-placeholder-movement__col1"></div>
		<div class="c-placeholder-movement__col2"></div>
		<div class="c-placeholder-movement__col3"></div>
	</div>
</template>

<script>
export default {
	name: 'c-placeholder-movement',
};
</script>

<style lang="scss" scoped>
.c-placeholder-movement {
	margin-bottom: 10px;
	width: 100%;
	height: 75px;
	border-radius: $border-radius-xs;
	background: RGB(var(--color-surface-light));
	position: relative;
	overflow: hidden;
}

.c-placeholder-movement::after {
	content: '';
	display: block;
	background: linear-gradient(
		90deg,
		RGBA(var(--color-surface-light), 0) 35%,
		RGB(var(--color-surface-light)) 50%,
		RGBA(var(--color-surface-light), 0) 65%
	);
	width: 100%;
	height: 100%;
	transform: translateX(-65%);
	position: absolute;
	left: 0;
	top: 0;
	animation: shime 1s ease-in-out forwards infinite;
}

.c-placeholder-movement__col1,
.c-placeholder-movement__col2,
.c-placeholder-movement__col3 {
	background: RGBA(var(--color-text-primary), 0.05);
	height: 16px;
	border-radius: $border-radius-xs;
	position: absolute;
}

.c-placeholder-movement__col1 {
	top: 15px;
	left: 15px;
	width: 200px;
}

.c-placeholder-movement__col2 {
	top: 15px;
	right: 15px;
	width: 90px;
}

.c-placeholder-movement__col3 {
	bottom: 15px;
	left: 15px;
	width: 90px;
}

@keyframes shime {
	to {
		transform: translateX(65%);
	}
}
</style>
