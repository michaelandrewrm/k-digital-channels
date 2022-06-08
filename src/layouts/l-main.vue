<template>
	<div class="l-main">
		<transition-group :name="secondaryTransition" tag="div" class="l-main__container">
			<main class="l-main__primary-view" v-if="$slots.primary && isPrimaryViewActive" key="primary">
				<nav class="l-main__nav-bar" v-if="!isHybrid && (isDesktop || !fullPage)" ref="navbar">
					<slot name="navbar" />
				</nav>

				<slot name="menu" />

				<div
					class="l-main__primary-container"
					data-testid="container-primary"
					:data-transition="primaryTransition"
				>
					<transition :name="primaryTransition">
						<slot name="primary" class="l-main__primary-slot" />
					</transition>
				</div>
			</main>

			<main
				class="l-main__secondary-view"
				v-if="$slots.secondary && isSecondaryViewActive"
				key="secondary"
				data-testid="container-secondary"
				:data-transition="secondaryTransition"
			>
				<div class="l-main__secondary-container">
					<transition :name="secondaryTransition">
						<slot name="secondary" />
					</transition>
				</div>
			</main>

			<main
				class="l-main__secondary-view"
				v-else-if="isDesktop && !fullWidth"
				key="secondary"
				data-testid="container-secondary"
			>
				<div class="l-main__secondary-container">
					<transition :name="secondaryTransition">
						<l-page class="l-main__secondary-blank" :closable="false" />
					</transition>
				</div>
			</main>
		</transition-group>
	</div>
</template>

<script>
import LPage from '@layouts/l-page';
import navigationMap from '@skyline/router/navigation-map';
import mq from '@utils/matchMedia';
import { onMobile, onDesktop } from '@theme';

export default {
	name: 'l-main',

	components: {
		LPage,
	},

	data() {
		return {
			primaryTransition: 'fade',
			secondaryTransition: 'fade',
			isHybrid: navigator.userAgent.includes('Skybrid'),
		};
	},

	computed: {
		isMobile: mq(onMobile),
		isDesktop: mq(onDesktop),
		isVerticalFoldable: mq('(screen-spanning: single-fold-vertical)'),

		hasSecondaryView({ $route: { matched } }) {
			return Boolean(matched.find(({ components }) => components.secondary));
		},

		fullWidth({ $route: { meta }, isVerticalFoldable }) {
			return meta.fullWidth && !isVerticalFoldable;
		},

		fullPage({ $route: { meta } }) {
			return Boolean(meta.fullPage);
		},

		isPrimaryViewActive({ isDesktop, hasSecondaryView }) {
			return isDesktop || !hasSecondaryView;
		},

		isSecondaryViewActive({ isDesktop, hasSecondaryView }) {
			return isDesktop || hasSecondaryView;
		},
	},

	created() {
		this.$router.beforeEach((to, from, next) => {
			// Si es la misma vista primaria, aplicamos transición secundaria
			if (from.matched[0] === to.matched[0]) {
				let direction = 'pull';
				let primaryTransition = 'fade';
				let secondaryTransition = this.isMobile ? 'page' : 'fade';

				if (to.meta.transition) {
					primaryTransition = to.meta.transition;
					secondaryTransition = to.meta.transition;
				}

				if (from.meta.transition) {
					primaryTransition = from.meta.transition;
					secondaryTransition = from.meta.transition;
				}

				if (navigationMap[from.name] && navigationMap[from.name].includes(to.name)) {
					direction = 'push';
				}

				this.primaryTransition = `${direction}-${primaryTransition}`;
				this.secondaryTransition = `${direction}-${secondaryTransition}`;
			}
			next();
		});
	},
};
</script>

<style lang="scss" scoped>
.l-main {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.l-main__container {
	height: 100%;
	flex-grow: 1;
	min-width: 300px;
	display: flex;
}

.l-main__primary-container,
.l-main__secondary-container {
	flex-grow: 1;
	position: relative;
}

.l-main__primary-container > *,
.l-main__secondary-container > * {
	transform-origin: center;
	overflow: hidden;
	position: absolute !important;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1;
}

.l-main__primary-view,
.l-main__secondary-view {
	display: flex;
	flex-direction: row;
	width: 100%;
	flex-grow: 1;
}

.l-main__primary-view {
	--scrollable-safe-margin-bottom: 55px;
}

.l-main__secondary-view {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 2;
}

.l-main__secondary-blank {
	--layout-background: RGB(var(--color-surface-dark));
}

@media ($on-desktop) {
	.l-main__primary-view {
		box-shadow: 0 0px 6px 0px rgba(0, 0, 0, 0.2);
		z-index: 2;
		width: auto;
		flex-basis: calc(50% + 110px);
		--scrollable-safe-margin-bottom: 0;
		--l-main-layout-primary: 1;
	}

	.l-main__secondary-view {
		position: static;
		z-index: auto;
		flex-basis: 50%;
		--l-main-layout-secondary: 1;
	}
}

@media (spanning: single-fold-vertical) {
	.l-main__primary-view {
		flex-basis: calc(100vw - env(fold-right) - env(fold-width));
	}

	.l-main__secondary-view {
		flex-basis: calc(100vw - env(fold-left) - env(fold-width));
		padding-left: env(fold-width);
	}
}

.l-main__nav-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: RGB(var(--color-surface-light));
	height: 55px;
	flex-shrink: 0;
	position: absolute;
	top: auto;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: $layer-popover-z-index;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 200ms;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}

@media ($on-desktop) {
	.l-main {
		flex-direction: row-reverse;
	}

	.l-main__nav-bar {
		position: static;
		height: 100%;
		width: 110px;
		box-shadow: 6px 0px 10px -3px rgba(0, 0, 0, 0.2);
	}
}

.push-fade-leave-active {
	animation: leaveToFade $page-transition-duration both cubic-bezier(0.165, 0.84, 0.44, 1);
	z-index: 0;
}

.push-fade-enter-active {
	animation: enterFromFade $page-transition-duration both cubic-bezier(0.165, 0.84, 0.44, 1);
	z-index: 1;
}

.push-fade-enter {
	position: fixed;
}

.pull-fade-leave-active {
	animation: leaveToFade $page-transition-duration both cubic-bezier(0.165, 0.84, 0.44, 1);
	z-index: 0;
}

.pull-fade-enter-active {
	animation: enterFromFade $page-transition-duration both cubic-bezier(0.165, 0.84, 0.44, 1);
	z-index: 1;
}

@keyframes leaveToFade {
	to {
	}
}

@keyframes enterFromFade {
	from {
		opacity: 0;
	}
}

.push-slide-leave-active {
	animation: slideToLeft $page-transition-duration both ease-out;
	z-index: 0;
}

.push-slide-enter {
	position: fixed;
}

.push-slide-enter-active {
	animation: enterFromRight $page-transition-duration both ease-out;
	z-index: 0;
}

.pull-slide-leave-active {
	animation: leaveToRight $page-transition-duration both ease-out;
	z-index: 0;
}

.pull-slide-enter-active {
	animation: slideFromLeft $page-transition-duration both ease-out;
	z-index: 0;
}

@keyframes slideToLeft {
	to {
		transform: translateX(-100%);
	}
}

@keyframes slideFromLeft {
	from {
		transform: translateX(-100%);
	}
}

.push-page-leave-to {
	animation: leaveToLeft $page-transition-duration cubic-bezier(0.165, 0.84, 0.44, 1) both;
	z-index: 0;
}

.push-page-enter {
	position: fixed;
	opacity: 0;
}

.push-page-enter-to {
	animation: enterFromRight $page-transition-duration cubic-bezier(0.165, 0.84, 0.44, 1) both;
	z-index: 2;
}

.pull-page-leave-to {
	animation: leaveToRight $page-transition-duration cubic-bezier(0.165, 0.84, 0.44, 1) both;
	z-index: 2;
}

.pull-page-enter {
	position: fixed;
	opacity: 0;
}

.pull-page-enter-to {
	animation: enterFromLeft $page-transition-duration ease-out both;
	z-index: 0;
}

@keyframes leaveToLeft {
	to {
		transform: scale(0.9);
		opacity: 0.4;
	}
}

@keyframes enterFromLeft {
	from {
		opacity: 0.7;
	}
}

@keyframes leaveToRight {
	to {
		transform: translateX(100%);
	}
}

@keyframes enterFromRight {
	from {
		transform: translateX(100%);
	}
}

@media print {
	.l-main__primary-view {
		display: none;
	}
}
</style>
