<template>
	<div class="c-progress-transfer" :style="{ '--progress': progress }">
		<div class="c-progress-transfer__progress"></div>
		<ol class="c-progress-transfer__legend text-m-light">
			<li
				class="c-progress-transfer__legend-item"
				:aria-current="step === originStep ? 'step' : null"
			>
				{{ $t('TRANSFERS.ORIGIN') }}
			</li>
			<li
				class="c-progress-transfer__legend-item"
				:aria-current="step === amountStep ? 'step' : null"
			>
				{{ $t('TRANSFERS.AMOUNT') }}
			</li>
			<li
				class="c-progress-transfer__legend-item"
				:aria-current="step === destinationStep ? 'step' : null"
			>
				{{ $t('TRANSFERS.DESTINATION') }}
			</li>
			<li
				class="c-progress-transfer__legend-item"
				:aria-current="step === confirmationStep ? 'step' : null"
			>
				{{ $t('TRANSFERS.CONFIRMATION') }}
			</li>
		</ol>
	</div>
</template>

<script>
export default {
	name: 'c-progress-transfer',

	props: {
		step: { type: Number },
	},

	data() {
		return {
			originStep: 1,
			amountStep: 2,
			destinationStep: 3,
			confirmationStep: 4,
		};
	},

	computed: {
		progress({ step }) {
			return Math.min(Math.max(step * (100 / 4), 0), 100);
		},
	},
};
</script>

<style lang="scss" scoped>
.c-progress-transfer {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}

.c-progress-transfer__legend {
	display: flex;
	position: relative;
	width: 100%;
	justify-content: space-between;
	margin-top: 10px;
	color: RGB(var(--color-text-primary));
}

.c-progress-transfer__legend-item {
	display: block;
	width: 100%;
	text-align: center;
}

.c-progress-transfer__legend-item[aria-current='step'] {
	@extend %typo-m-medium;
}

.c-progress-transfer__progress {
	flex-grow: 1;
	background: RGBA(var(--color-primary-light), 0.15);
	height: 5px;
	border-radius: 5px;
	overflow: hidden;
	position: relative;
	min-width: 80px;
}

.c-progress-transfer__progress::before {
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
