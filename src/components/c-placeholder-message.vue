<template>
	<div class="c-placeholder-message" aria-hidden="true">
		<div class="c-placeholder-message__line"></div>
		<div class="c-placeholder-message__line"></div>
		<div class="c-placeholder-message__button"></div>
	</div>
</template>

<script>
export default {
	name: 'c-placeholder-message',
};
</script>

<style lang="scss" scoped>
.c-placeholder-message {
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
	--c-placeholder-message-color: var(--color-dark-surface);
}

.c-placeholder-message__line,
.c-placeholder-message__button {
	position: relative;
	overflow: hidden;
	background: RGBA(var(--c-placeholder-message-color), 0.05);
	border-radius: $border-radius-m;
}

.c-placeholder-message__line {
	width: 270px;
	height: 20px;
	margin-bottom: 14px;
}

.c-placeholder-message__line:nth-of-type(2n) {
	width: 140px;
	margin-bottom: 72px;
}

.c-placeholder-message__button {
	align-self: center;
	width: 180px;
	height: 50px;
}

.c-placeholder-message__line::after,
.c-placeholder-message__button::after {
	content: '';
	display: block;
	background: linear-gradient(
		90deg,
		RGBA(var(--c-placeholder-message-color), 0) 35%,
		RGBA(var(--c-placeholder-message-color), 0.05) 50%,
		RGBA(var(--c-placeholder-message-color), 0) 65%
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
