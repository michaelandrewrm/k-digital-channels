<template>
	<section class="c-operation-success">
		<header class="c-operation-success__header">
			<div class="c-operation-success__icon-wrapper">
				<div class="c-operation-success__icon-circle">
					<div class="c-operation-success__icon-bg"></div>
				</div>
				<svg class="c-operation-success__icon" width="70" height="70" viewBox="0 0 70 70">
					<polyline
						class="c-operation-success__icon-path"
						points="26 36 34 43 47 27"
						stroke-linecap="round"
					/>
				</svg>
			</div>

			<h1
				tabindex="-1"
				class="text-fixed-xl-bold c-operation-success__title"
				data-testid="success-title"
			>
				<slot name="title" />
			</h1>
		</header>

		<div class="c-operation-success__scrolling">
			<div class="c-operation-success__main" :class="{ '--extra-padding': $slots.snackbar }">
				<slot />
			</div>
		</div>

		<div class="c-operation-success__snackbar">
			<slot name="snackbar" />
		</div>

		<footer class="c-operation-success__footer">
			<div class="c-operation-success__footer-wrapper">
				<slot name="buttons" />
			</div>
		</footer>
	</section>
</template>

<script>
export default {
	name: 'c-operation-success',
};
</script>

<style lang="scss" scoped>
.c-operation-success {
	background-color: RGB(var(--color-surface-light));
	color: RGB(var(--color-text-primary));
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: hidden;
	height: 100%;
}

.c-operation-success__header {
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	max-width: 320px;
	padding: 30px 0;
	text-align: center;
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.c-operation-success__title {
	padding: 0 30px;
	animation: fadeIn 1000ms ease;
}

.c-operation-success__snackbar {
	display: block;
	width: 100%;
	padding: 10px;
	text-decoration: none;
}

@keyframes fadeIn {
	0% {
		opacity: 0;
		transform: translateY(-5px);
	}
	20% {
		opacity: 0;
		transform: translateY(-5px);
	}
}

.c-operation-success__icon-wrapper {
	margin-bottom: 30px;
	position: relative;
	display: flex;
	flex-shrink: 0;
	width: 70px;
	height: 70px;
}

.c-operation-success__icon-circle {
	position: absolute;
	width: 70px;
	height: 70px;
	border-radius: 50%;
	background: RGB(var(--color-accent-secondary));
	animation: expand 1s cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

.c-operation-success__icon-bg {
	position: absolute;
	top: 4px;
	left: 4px;
	width: 62px;
	height: 62px;
	border-radius: 50%;
	background: RGB(var(--color-surface-light));
	animation: expand 1s 200ms cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

@keyframes expand {
	from {
		transform: scale(0);
	}
}

.c-operation-success__icon {
	position: absolute;
	width: 100px;
	height: 100px;
	top: -16px;
	left: -16px;
	transform-origin: center;
	animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0.7s 1 both scaleCheck;
}

.c-operation-success__icon-path {
	fill: transparent;
	stroke-width: 4;
	stroke-dasharray: 36px 36px;
	stroke-dashoffset: 36px;
	stroke-linecap: butt;
	stroke: RGB(var(--color-accent-secondary));
	animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0.7s 1 both drawCheck;
}

@keyframes scaleCheck {
	0% {
		opacity: 0;
	}
	1% {
		opacity: 1;
	}
	100% {
		transform: scale(1);
	}
}

@keyframes drawCheck {
	to {
		stroke-dashoffset: 0;
	}
}

.c-operation-success__scrolling {
	width: 100%;
	overflow-x: hidden;
	overflow-y: overlay;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-grow: 1;
	flex-shrink: 1;
}

.c-operation-success__main {
	max-width: 320px;
	padding: 30px 20px;
	flex-grow: 1;
	width: 100%;
	text-align: center;
}

.c-operation-success__main.--extra-padding {
	padding-bottom: 60px;
}

.c-operation-success__main > *:not(:last-child) {
	margin-bottom: 15px;
}

.c-operation-success__footer {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	flex-shrink: 0;
	background: RGB(var(--color-surface-light));
	box-shadow: 0px -6px 20px -20px black;
	border-top-left-radius: $border-radius-xl;
	border-top-right-radius: $border-radius-xl;
	will-change: transform;
	transition: transform 300ms ease-in-out;
}

.c-operation-success__footer-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: 320px;
	padding: 30px 0;
	text-align: center;
}

.c-operation-success__footer-wrapper /deep/ * {
	width: 100%;
}
</style>
