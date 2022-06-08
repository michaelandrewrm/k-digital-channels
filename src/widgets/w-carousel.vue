<template>
	<div class="w-carousel">
		<div class="w-carousel-container">
			<!-- Carousel title starts -->
			<div class="wc-header" :class="textAlignClass" v-if="title">
				<h2 class="h2 wc-title text-xl-medium">{{ title }}</h2>
			</div>
			<!-- Carousel title ends -->
			<!-- Carousel starts -->
			<div class="w-carousel-wrapper" ref="wc-touch-area">
				<!-- Navigation button starts -->
				<div v-if="navigable">
					<div
						v-if="slides.length > 0 && currentPane > 0"
						class="wc-nav-btn-wrapper wc-nav-btn-prev"
					>
						<button
							data-testid="prev-pane-button"
							class="prev"
							@click="prev"
							aria-hidden="true"
							tabindex="-1"
						/>
					</div>
				</div>
				<!-- Navigation button ends -->
				<div class="w-carousel-viewport">
					<div class="w-carousel-frame">
						<ul class="wc-scroll" ref="scroller">
							<li
								class="w-carousel__scroll-item-outer"
								v-for="(slide, index) in computedSlides"
								v-bind:key="index"
								ref="slides"
								tabindex="-1"
							>
								<div class="w-carousel__scroll-item" :class="textAlignClass">
									<component
										:is="slideTemplate"
										data-testid="slide"
										:data="slide"
										@like="onChangeFeedback(slide.id, 'like')"
										@unlike="onChangeFeedback(slide.id, 'unlike')"
										@close="closeCarousel"
										:enable-feedback="enableFeedback"
										:aria-hidden="index !== currentPane"
										:inert="index !== currentPane"
									/>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<!-- Navigation button starts -->
				<div v-if="navigable">
					<div v-if="currentPane !== slides.length - 1" class="wc-nav-btn-wrapper wc-nav-btn-next">
						<button
							data-testid="next-pane-button"
							class="next"
							@click="next"
							aria-hidden="true"
							tabindex="-1"
						/>
					</div>
				</div>
				<!-- Navigation button ends -->
			</div>
			<!-- Carousel ends -->
			<!-- Indicators buttons starts -->
			<div v-if="slides.length > 1" class="wc-indicators" data-testid="indicators">
				<ul class="wc-indicators-wrapper">
					<li class="wc-indicator" v-for="(slide, index) in slides" v-bind:key="index">
						<button
							class="wc-indicator-btn"
							@click.prevent="onIndicatorClick(index)"
							:aria-pressed="index === currentPane"
						/>
					</li>
				</ul>
			</div>
			<!-- Indicators buttons ends -->
			<!-- Skip button starts -->
			<div v-if="skipable" class="wc-skip-btn text-m-medium">
				<a data-testid="skip-button" href="#" @click.prevent="closeCarousel">
					{{ $t('ACTIONS.SKIP') }}
				</a>
			</div>
			<!-- Skip product button ends -->
		</div>
	</div>
</template>

<script>
import communicationsModule from '@modules/communications/m-communications';
import CSlide from '@components/c-slide';

const HammerAsync = () => import(/* webpackChunkName: "hammerjs" */ 'hammerjs');
const paneGap = 28;

export default {
	name: 'w-carousel',

	modules: {
		communications: communicationsModule,
	},

	props: {
		title: { type: String, default: '' },
		skipable: { type: Boolean, default: false },
		slides: { type: Array, default: () => [] },
		textAlign: { type: String, default: '' },
		navigable: { type: Boolean },
		enableFeedback: { type: Boolean },
		slideTemplate: { type: [Object, String], default: () => CSlide },
	},

	data() {
		return {
			Hammer: null,
			currentPane: 0,
			hammerInstance: null,
			paneWidth: 0,
			directionLeft: null,
			directionRight: null,
			resizeObserver: null,
			feedback: [],
			impressions: [],
		};
	},

	computed: {
		textAlignClass({ textAlign }) {
			return {
				'text-align--center': textAlign === 'center',
			};
		},

		computedSlides({ slides, feedback }) {
			return slides.map((slide) => {
				const f = feedback.find(({ id }) => id === slide.id);

				if (f) {
					return { ...slide, ...f };
				}

				return slide;
			});
		},

		currentSlide({ slides, currentPane }) {
			return slides[currentPane];
		},
	},

	watch: {
		Hammer(Hammer) {
			const { DIRECTION_HORIZONTAL, Pan } = Hammer;

			this.hammerInstance = new Hammer(this.$refs['wc-touch-area']);

			const horizontal = new Pan({
				event: 'pan',
				direction: DIRECTION_HORIZONTAL,
			});

			const events = 'panstart panmove panend pancancel';
			this.hammerInstance.add(horizontal);
			this.hammerInstance.on(events, this.hammerHandler.bind(this));
		},

		hammerInstance(hammerInstance) {
			/* istanbul ignore else */
			if (hammerInstance) {
				this.$nextTick(() => {
					this.refresh();
				});
			}
		},

		currentSlide: {
			immediate: true,
			handler(currentSlide) {
				if (currentSlide && this.enableFeedback && !this.impressions.includes(currentSlide.id)) {
					this.impressions.push(currentSlide.id);
					this.$store
						.dispatch('communications/setAnnouncementImpression', currentSlide.id)
						.catch(() => {});
				}
			},
		},
	},

	methods: {
		onChangeFeedback(id, strFeedback) {
			const DIC_FEEDBACK = { like: 1, unlike: 0, neutral: -1 };

			const slide = this.computedSlides.find(({ id: slideId }) => id === slideId);
			const decimalFeedback = DIC_FEEDBACK[strFeedback];
			const feedback = slide.feedback === decimalFeedback ? DIC_FEEDBACK.neutral : decimalFeedback;

			this.feedback.unshift({ id, feedback });
			this.$store.dispatch('communications/setAnnouncementFeedback', { id, feedback }).catch(() => {
				this.feedback.shift();
			});
		},

		refresh() {
			this.paneWidth = this.$refs.scroller.offsetWidth;
			this.showPane(this.currentPane);
		},

		showPane(index) {
			this.currentPane = Math.max(0, Math.min(index, this.slides.length - 1));
			const gap = paneGap * this.currentPane;
			this.setContainerOffsetX(-this.currentPane * this.paneWidth - gap, true);
		},

		setContainerOffsetX(offsetX, doTransition) {
			const container = this.$refs.scroller;

			if (doTransition) {
				const onTransitionEnd = () => {
					container.classList.remove('transition');
					container.removeEventListener('transitionend', onTransitionEnd);
					this.$refs.slides[this.currentPane]?.focus();
				};
				container.addEventListener('transitionend', onTransitionEnd, {
					once: true,
				});
				container.classList.add('transition');
			}

			container.style.transform = `translateX(${offsetX}px)`;
		},

		prev() {
			this.currentPane -= 1;
			this.showPane(this.currentPane);
		},

		next() {
			this.currentPane += 1;
			this.showPane(this.currentPane);
		},

		hammerHandler(e) {
			/* fix android bug */
			/* istanbul ignore next */
			if (e.srcEvent.type === 'pointercancel') {
				return;
			}

			/* eslint-disable */
			switch (e.type) {
				case 'panstart':
				case 'panmove':
				case 'panend':
				case 'pancancel':
					this.panHandler(e);
					break;
			}
		},

		panHandler(e) {
			const panBoundary = 0.1;
			/* eslint-disable */

			switch (e.type) {
				case 'panstart':
					this.$el.dispatchEvent(
						new CustomEvent('recognizer-start', { bubbles: true, detail: this.hammerInstance })
					);
				case 'panmove':
					const newXPos = -this.currentPane * this.paneWidth + e.deltaX;
					const isFirstSlide = this.currentPane === 0 && newXPos >= 0;
					const isLastSlide =
						this.currentPane === this.slides.length - 1 &&
						newXPos <= -this.paneWidth * (this.slides.length - 1);

					// Slow down at the first and last pane.
					if (isFirstSlide || isLastSlide) {
						e.deltaX *= 0.2;
					}

					if (!isFirstSlide) {
						e.deltaX -= paneGap * this.currentPane;
					}

					this.setContainerOffsetX(-this.currentPane * this.paneWidth + e.deltaX);

					break;
				case 'panend':
				case 'pancancel':
					if (Math.abs(e.deltaX) > this.paneWidth * panBoundary) {
						if (e.deltaX > 0) {
							this.prev();
						} else {
							this.next();
						}
					} else {
						this.showPane(this.currentPane);
					}
					this.$el.dispatchEvent(
						new CustomEvent('recognizer-stop', { bubbles: true, detail: this.hammerInstance })
					);

					break;
			}
		},

		onIndicatorClick(index) {
			this.showPane(index);
		},

		closeCarousel() {
			this.$emit('skip-carousel');
		},
	},

	async created() {
		this.Hammer = (await HammerAsync()).default;
	},

	mounted() {
		/* istanbul ignore else */
		if (typeof ResizeObserver !== 'undefined') {
			this.resizeObserver = new ResizeObserver(() => {
				this.refresh();
			});
			this.resizeObserver.observe(this.$el);
		}
	},

	beforeDestroy() {
		/* istanbul ignore else */
		if (this.hammerInstance) {
			this.hammerInstance.destroy();
			this.hammerInstance = null;
		}

		/* istanbul ignore else */
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
	},
};
</script>

<style lang="scss" scoped>
.w-carousel {
	height: 100%;
	position: relative;
	overflow: hidden;
	display: flex;
	padding: 20px 0;
}

.w-carousel-container {
	display: flex;
	width: 100%;
	height: 100%;
	align-items: center;
	flex-direction: column;
	justify-content: flex-start;
	overflow-y: auto;
	margin: auto;
}

.wc-header {
	width: 210px;
	margin-bottom: 22px;
	text-align: center;
}

.text-align--center {
	text-align: center;
}

.wc-title {
	line-height: 1.9;
	display: inline-flex;
	border-bottom: 4px solid RGB(var(--color-secondary));
	color: RGB(var(--color-text-primary-light));
	margin-bottom: 14px;
}

.w-carousel-wrapper {
	position: relative;
	width: var(--w-carousel--width, 474px);
}

.wc-nav-btn-wrapper {
	position: absolute;
	top: 120px;
	width: 70px;
	height: 72px;
}

.wc-nav-btn-prev {
	left: -100px;
}

.wc-nav-btn-next {
	right: -100px;
}

.prev,
.next {
	position: absolute;
	background: transparent;
	border: 1.5px solid white;
	width: 49px;
	height: 49px;
	outline: 0;
	margin: 11px;
	transform: rotate(45deg);
	z-index: 1;
}

.prev {
	border-top: 0;
	border-right: 0;
}

.next {
	border-bottom: 0;
	border-left: 0;
}

.w-carousel-viewport {
	contain: paint;
}

.w-carousel-frame {
	width: 100%;
	overflow: hidden;
}

.wc-scroll {
	display: flex;
	align-items: flex-start;
	width: 100%;
	height: 100%;
	-webkit-overflow-scrolling: touch;
	scrollbar-width: none;
	-ms-overflow-style: none;
	will-change: transform;
}

.wc-scroll.transition {
	transition: transform 0.2s ease-out;
}

.w-carousel__scroll-item-outer {
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: center;
	flex-shrink: 0;
}

.w-carousel__scroll-item-outer + .w-carousel__scroll-item-outer {
	margin-left: 28px;
}

.w-carousel__scroll-item {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	max-width: var(--w-carousel--width, 474px);
}

.wc-scroll.transition {
	transition: transform 0.2s ease-out;
}

.scroll::-webkit-scrollbar {
	display: none;
}

.wc-indicators-wrapper {
	display: flex;
	width: 100%;
	justify-content: center;
	margin: 0;
	padding: 0;
	list-style: none;
}

.wc-indicator-btn {
	position: relative;
	background: none;
	border: none;
	color: #fff;
	display: flex;
	flex-direction: column;
	padding: 0;
	border: 10px solid transparent;
	--focus-ring-padding: 4px;
	border-radius: 50%;
}

.wc-indicator-btn:after {
	content: '';
	display: block;
	width: 8px;
	height: 8px;
	background-color: currentColor;
	border-radius: 50%;
}

.wc-indicator-btn:hover {
	color: RGB(var(--color-secondary));
}

.wc-indicator-btn:active,
.wc-indicator-btn:focus {
	color: RGB(var(--color-secondary-light));
	padding: 0;
}

.wc-indicator:hover .wc-indicator-btn {
	color: RGB(var(--color-secondary));
}

.wc-indicator-btn[aria-pressed='true']:after {
	color: RGB(var(--color-secondary));
}

.wc-skip-btn {
	display: flex;
	text-transform: uppercase;
	text-align: center;
	align-items: center;
	justify-content: center;
	margin-top: 1rem;
	color: RGB(var(--color-accent-secondary));
}

@media ($on-mobile) {
	.wc-header {
		text-align: center;
	}
	.w-carousel-wrapper {
		width: 100%;
		flex-grow: 1;
	}
}

@media ($on-tablet) {
	.wc-header {
		width: 474px;
		text-align: left;
	}

	.wc-title {
		padding-bottom: 0px;
		margin-bottom: 10px;
	}

	.wc-indicator-btn:after {
		width: 10px;
		height: 10px;
	}

	.w-carousel-container {
		height: auto;
		max-height: 100%;
	}
}

[data-style-mini-indicators] .wc-indicator-btn {
	& {
		color: RGBA(var(--color-primary-light), 0.6);
	}

	&[aria-pressed='true']:after {
		color: RGB(var(--color-text-primary));
	}

	&:after {
		width: 6px;
		height: 6px;
	}
}
</style>
