<template>
	<div class="c-slider" :style="{ '--gap': `${gap}px` }">
		<div class="c-slider__container">
			<div class="c-slider__content" ref="wc-touch-area">
				<div class="c-slider__viewport">
					<div class="c-slider__frame">
						<c-slider-wrapper
							ref="scroller"
							class="c-slider__wrapper"
							:active="currentPane"
							:class="{ transition: animating }"
							:style="{ width: `${paneWidth}px` }"
							@select-pane="showPane"
						>
							<slot />
						</c-slider-wrapper>
					</div>
				</div>
			</div>

			<div class="c-slider__indicators" v-if="$slots.default.length > 1" data-testid="indicators">
				<ul ref="bulletsWrapper" class="c-slider__indicators-wrapper">
					<li
						class="c-slider__indicator"
						v-for="(slide, index) in $slots.default.length"
						v-bind:key="index"
					>
						<button
							class="c-slider__indicator-button"
							@click.prevent="onIndicatorClick(index)"
							:aria-pressed="index === currentPane"
							:medium="animateBullets && (index === currentPane - 2 || index === currentPane + 2)"
							:small="animateBullets && (index === currentPane - 3 || index === currentPane + 3)"
							:hidden="animateBullets && (index > currentPane + 3 || index < currentPane - 3)"
							:inert="animateBullets && (index > currentPane + 3 || index < currentPane - 3)"
						/>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import CSliderWrapper from '@components/c-slider-wrapper';

const HammerAsync = () => import(/* webpackChunkName: "hammerjs" */ 'hammerjs');

export default {
	name: 'c-slider',

	components: {
		CSliderWrapper,
	},

	props: {
		locked: {
			type: Boolean,
			default: false,
		},

		selected: {
			type: Number,
			default: 0,
		},
	},

	data() {
		return {
			Hammer: null,
			currentPane: 0,
			hammerInstance: null,
			paneWidth: 0,
			animating: false,
			translateX: 0,
			bulletsWrapperWidth: 0,
		};
	},

	computed: {
		gap: () => 0,
		animateBullets({ $slots }) {
			return $slots?.default.length > 5;
		},
	},

	watch: {
		selected(value) {
			this.showPane(value);
		},

		Hammer(Hammer) {
			const { DIRECTION_HORIZONTAL, Swipe, Pan } = Hammer;

			this.hammerInstance = new Hammer(this.$refs['wc-touch-area']);

			const horizontal = new Pan({
				event: 'pan',
				direction: DIRECTION_HORIZONTAL,
			});

			const swipe = new Swipe({
				event: 'swipe',
				direction: DIRECTION_HORIZONTAL,
			});

			swipe.requireFailure(horizontal);

			const events = 'swipeleft swiperight panleft panright panend pancancel';
			this.hammerInstance.add([swipe, horizontal]);
			this.hammerInstance.on(events, this.hammerHandler.bind(this));
		},

		hammerInstance(hammerInstance) {
			/* istanbul ignore else */
			if (hammerInstance) {
				this.$nextTick(() => {
					this.refresh();
					this.showPane(this.selected);
				});
			}
		},
	},

	methods: {
		refresh() {
			const { width } = this.$slots?.default[0]?.elm?.getBoundingClientRect();
			if (this.animateBullets) {
				this.bulletsWrapperWidth = this.$refs.bulletsWrapper.getBoundingClientRect().width;
			}

			/* istanbul ignore next */
			if (process.env.NODE_ENV === 'development') {
				const { assert } = console;
				assert(Boolean(width), 'You should define a fixed width for slider items.');
			}

			this.paneWidth = width;
		},

		showPane(index) {
			const pane = Math.max(0, Math.min(index, this.$slots.default.length - 1));
			const gap = this.gap * pane;

			this.currentPane = pane;
			this.handleBullets();
			this.setContainerOffsetX(-pane * this.paneWidth - gap, true);
		},

		setContainerOffsetX(offsetX, doTransition) {
			const container = this.$refs.scroller;

			if (doTransition) {
				const onTransitionEnd = () => {
					this.$emit('change', this.currentPane);
					this.animating = false;
					container.removeEventListener('transitionend', onTransitionEnd);
				};
				container.addEventListener('transitionend', onTransitionEnd, {
					once: true,
				});
				this.animating = true;
			}

			container.style.transform = `translateX(${offsetX}px)`;
		},

		handleBullets() {
			if (this.animateBullets) {
				const {
					currentPane,
					$refs: { bulletsWrapper },
					bulletsWrapperWidth,
				} = this;
				const bullets = bulletsWrapper.querySelectorAll('li');
				const bulletWidth = bulletsWrapperWidth / bullets.length;
				this.translateX = bulletsWrapperWidth / 2 - bulletWidth / 2 - currentPane * bulletWidth;

				bulletsWrapper.style.transform = `translateX(${this.translateX}px)`;
			}
		},

		prev() {
			this.showPane(this.currentPane - 1);
		},

		next() {
			this.showPane(this.currentPane + 1);
		},

		hammerHandler(e) {
			/* fix android bug */
			/* istanbul ignore next */
			if (e.srcEvent.type === 'pointercancel') {
				return;
			}

			switch (e.type) {
				case 'swipeleft':
				case 'swiperight':
					this.swipeHandler(e);
					break;
				case 'panleft':
				case 'panright':
				case 'panend':
				case 'pancancel':
					this.panHandler(e);
					break;
			}
		},

		swipeHandler({ direction }) {
			if (direction === this.Hammer.DIRECTION_LEFT) {
				this.next();
			} else if (direction === this.Hammer.DIRECTION_RIGHT) {
				this.prev();
			}
		},

		panHandler(e) {
			const panBoundary = 0.2;
			/* eslint-disable */

			switch (e.type) {
				case 'panleft':
				case 'panright':
					const newXPos = -this.currentPane * this.paneWidth + e.deltaX;
					const isFirstSlide = this.currentPane === 0 && newXPos >= 0;
					const isLastSlide =
						this.currentPane === this.$slots.default.length - 1 &&
						newXPos <= -this.paneWidth * (this.$slots.default.length - 1);

					// Slow down at the first and last pane.
					if (isFirstSlide || isLastSlide || this.locked) {
						e.deltaX *= 0.2;
					}

					/* istanbul ignore else */
					if (!isFirstSlide) {
						e.deltaX -= this.gap * this.currentPane;
					}

					this.setContainerOffsetX(-this.currentPane * this.paneWidth + e.deltaX);

					break;
				case 'panend':
				case 'pancancel':
					e.deltaX += this.gap * this.currentPane;
					if (!this.locked && e.distance > this.paneWidth * panBoundary) {
						if (e.deltaX > 0) {
							this.prev();
						} else {
							this.next();
						}
					} else {
						this.showPane(this.currentPane);
					}
					break;
			}
		},

		onIndicatorClick(index) {
			this.showPane(index);
		},
	},

	async created() {
		this.Hammer = (await HammerAsync()).default;
	},

	/* istanbul ignore next */
	beforeDestroy() {
		if (this.hammerInstance) {
			this.hammerInstance.destroy();
			this.hammerInstance = null;
		}
	},
};
</script>

<style lang="scss" scoped>
.c-slider {
	width: 100%;
	height: 100%;
	position: relative;
	user-select: none;
	--gap: 0px;
}

.c-slider__container {
	display: flex;
	width: 100%;
	height: 100%;
	align-items: center;
	flex-direction: column;
	justify-content: flex-start;
}

.c-slider__content {
	position: relative;
	width: 100%;
}

.c-slider__viewport {
	contain: style layout;
}

.c-slider__frame {
	width: 100%;
	text-align: center;
}

.c-slider__wrapper {
	margin: 0 auto;
}

.c-slider__wrapper.transition {
	transition: transform 0.2s ease-out;
}

.c-slider__indicators-wrapper {
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
	margin: 0;
	padding: 0;
	list-style: none;
	margin-top: 10px;
	transition: transform 200ms ease;
}

.c-slider__indicator-button {
	display: flex;
	position: relative;
	padding: 0;
	border: 5px solid transparent;
	border-radius: 50%;
	background: none;
	color: RGBA(var(--color-primary-light), 0.15);
	flex-direction: column;
	--focus-ring-padding: 4px;
}

.c-slider__indicator-button::after {
	content: '';
	display: block;
	width: 6px;
	height: 6px;
	background-color: currentColor;
	border-radius: 50%;
	transition: transform 200ms ease;
}

.c-slider__indicator > .c-slider__indicator-button[hidden]::after {
	transform: scale(0);
}

.c-slider__indicator > .c-slider__indicator-button[small]::after {
	transform: scale(0.6);
}

@media ($on-desktop) {
	.c-slider__indicator-button:hover {
		color: RGB(var(--color-secondary));
	}

	.c-slider__indicator-button:active,
	.c-slider__indicator-button:focus {
		color: RGB(var(--color-primary-dark));
		padding: 0;
	}
}

@media (hover) {
	.c-slider__indicator-button {
		cursor: pointer;
	}
}

.c-slider__indicator-button[aria-pressed='true']:after {
	color: RGB(var(--color-primary-light));
}
</style>
