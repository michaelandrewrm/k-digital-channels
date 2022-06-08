<template>
	<div class="c-placeholder-detail" aria-hidden="true">
		<div class="c-placeholder-detail__title"></div>
		<div class="c-placeholder-detail__subtitle"></div>
		<div class="c-placeholder-detail__line"></div>
		<div class="c-placeholder-detail__line"></div>
		<div class="c-placeholder-detail__line"></div>
		<div class="c-placeholder-detail__line"></div>
		<div class="c-placeholder-detail__line"></div>
		<div class="c-placeholder-detail__line"></div>
	</div>
</template>

<script>
export default {
	name: 'c-placeholder-detail',
};
</script>

<style lang="scss" scoped>
.c-placeholder-detail {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-direction: column;
}

.c-placeholder-detail__title,
.c-placeholder-detail__subtitle,
.c-placeholder-detail__line {
	position: relative;
	overflow: hidden;
	background: rgba(255, 255, 255, 0.05);
	border-radius: $border-radius-m;
}

.c-placeholder-detail__title {
	width: 160px;
	height: 32px;
}

.c-placeholder-detail__subtitle {
	width: 160px;
	height: 16px;
	margin-top: 10px;
	margin-bottom: 52px;
}

.c-placeholder-detail__line {
	width: 270px;
	height: 32px;
	margin-bottom: 20px;
}

.c-placeholder-detail__line:nth-of-type(2n) {
	margin-bottom: 50px;
}

.c-placeholder-detail__title::after,
.c-placeholder-detail__subtitle::after,
.c-placeholder-detail__line::after {
	content: '';
	display: block;
	background: linear-gradient(
		90deg,
		RGBA(255, 255, 255, 0) 35%,
		RGBA(255, 255, 255, 0.05) 50%,
		RGBA(255, 255, 255, 0) 65%
	);
	width: 100%;
	height: 100%;
	transform: translateX(-65%);
	position: absolute;
	left: 0;
	top: 0;
	animation: shime 1s ease-in-out forwards infinite;
}

@keyframes shime {
	to {
		transform: translateX(65%);
	}
}
</style>
