<template>
	<div class="c-progress-detail" :style="{ '--progress': progress }">
		<div class="c-progress-detail__from">
			<slot name="from" />
		</div>
		<div class="c-progress-detail__progress"></div>
		<div class="c-progress-detail__to">
			<slot name="to" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'c-progress-detail',

	props: {
		from: {
			type: Number,
			default: 0,
		},
		to: {
			type: Number,
			default: 100,
		},
	},

	computed: {
		progress({ from, to }) {
			return (from / to) * 100;
		},
	},
};
</script>

<style lang="scss" scoped>
.c-progress-detail {
	display: flex;
	align-items: center;
}

.c-progress-detail__from {
	min-width: 50px;
	flex-shrink: 0;
	text-align: right;
}

.c-progress-detail__to {
	min-width: 50px;
	flex-shrink: 0;
	text-align: left;
}

.c-progress-detail__progress {
	flex-grow: 1;
	background: RGBA(var(--color-primary-light), 0.15);
	margin: 0 15px;
	height: 5px;
	border-radius: 5px;
	overflow: hidden;
	position: relative;
	min-width: 80px;
}

.c-progress-detail__progress::before {
	content: '';
	background: RGB(var(--color-primary-dark));
	position: absolute;
	top: 0;
	bottom: 0;
	left: -100%;
	width: 100%;
	transform: translateX(calc(var(--progress) * 1%));
	transition: transform 200ms ease-in-out;
	will-change: transform;
}
</style>
