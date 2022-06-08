<template>
	<div class="c-step-progress" :style="{ '--progress': progress }">
		<div class="c-step-progress__progress"></div>
		<ol class="c-step-progress__legend text-m-light" data-testid="steps">
			<li
				v-for="(step, index) in steps"
				:key="step"
				:aria-current="index + 1 === realCurrentStep ? 'step' : null"
				class="c-step-progress__legend-item"
				data-testid="step"
			>
				{{ step }}
			</li>
		</ol>
	</div>
</template>

<script>
export default {
	name: 'c-step-progress',

	props: {
		steps: { type: Array },
		current: { type: Number },
	},

	computed: {
		realCurrentStep({ steps, current }) {
			if (current < steps.length) {
				return Math.floor(current);
			}

			return steps.length;
		},

		progress({ steps, current }) {
			return Math.min(Math.max(current * (100 / steps.length), 0), 100);
		},
	},
};
</script>

<style lang="scss" scoped>
.c-step-progress {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}

.c-step-progress__legend {
	display: flex;
	position: relative;
	width: 100%;
	justify-content: space-between;
	margin-top: 8px;
	color: RGB(var(--color-text-primary));
}

.c-step-progress__legend-item {
	display: block;
	width: 100%;
	text-align: center;
}

.c-step-progress__legend-item[aria-current='step'] {
	@extend %typo-m-medium;
}

.c-step-progress__progress {
	flex-grow: 1;
	background: RGBA(var(--color-primary-light), 0.15);
	height: 5px;
	border-radius: 5px;
	overflow: hidden;
	position: relative;
	min-width: 80px;
}

.c-step-progress__progress::before {
	content: '';
	background: RGB(var(--color-primary-light));
	position: absolute;
	width: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	border-radius: 5px;
	transform: translateX(calc((var(--progress) - 100) * 1%));
	transition: transform 500ms ease-out;
	will-change: transform;
}
</style>
