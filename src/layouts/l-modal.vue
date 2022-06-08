<template>
	<div class="l-modal" :class="classList" @keydown.capture="keyHandler">
		<transition name="fade" appear>
			<div class="l-modal__overlay" tabindex="-1"></div>
		</transition>
		<div class="l-modal__scrollable" @click.self="close">
			<transition name="modal" appear>
				<div class="l-modal__dialog">
					<div role="document" class="l-modal__document">
						<section class="l-modal__container" ref="container">
							<div class="l-modal__wrapper">
								<div class="icon" v-if="$slots.icon">
									<slot name="icon" />
								</div>

								<span
									a11y-focusable
									class="a11y-hide"
									aria-labelledby="l-modal-title"
									tabindex="-1"
								></span>

								<header data-testid="modal-header" v-if="$slots.header">
									<h1 tabindex="-1" class="text-fixed-xl-bold" id="l-modal-title">
										<slot name="header" id="l-modal-header" />
									</h1>
								</header>

								<div class="text-m-book">
									<slot />
								</div>

								<div class="l-modal__buttons" v-if="$slots.buttons" data-testid="modal-buttons">
									<slot name="buttons" />
								</div>

								<div
									class="l-modal__actions text-m-medium"
									v-if="$slots.actions"
									data-testid="modal-actions"
								>
									<slot name="actions" />
								</div>
							</div>
						</section>

						<button
							class="l-modal__close-button"
							:title="$t('MODAL.CLOSE')"
							:aria-label="$t('MODAL.CLOSE')"
							@click="close"
							data-testid="modal-close-button"
							v-if="!modal"
						>
							<!-- eslint-disable-line vue-i18n/no-raw-text -->
							&times;
						</button>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
export default {
	name: 'l-modal',

	props: {
		stretch: { type: Boolean, default: false },
		fullscreen: { type: Boolean, default: false },
		modal: { type: Boolean, default: false },
	},

	computed: {
		classList({ stretch, fullscreen }) {
			return {
				'--stretch': stretch,
				'--fullscreen': fullscreen,
			};
		},
	},

	methods: {
		keyHandler($event) {
			const { keyCode } = $event;
			const buttons = this.$el.querySelectorAll('.button');
			const ESC = 27;
			const ENTER = 13;

			if (keyCode === ESC) {
				this.close();
			}

			if (keyCode === ENTER && buttons?.length) {
				const button =
					document.activeElement.localName === 'button'
						? document.activeElement
						: buttons[buttons.length - 1];

				/* istanbul ignore else */
				if (!button?.disabled && button?.click) {
					$event.preventDefault();
					button.click();
				}
			}
		},

		close() {
			if (!this.modal) {
				this.$el.dispatchEvent(new Event('close', { bubbles: true }));
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.modal-enter-active {
	animation: modalEnter 250ms ease-out;
}

.fade-enter-active {
	animation: fade 200ms ease;
}

@keyframes fade {
	from {
		opacity: 0;
	}
}

@keyframes modalEnter {
	from {
		transform: scale(1.05);
		opacity: 0;
	}
}

.l-modal {
	will-change: transform;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: $layer-modal-z-index;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 24px;
	perspective: 800px;
}

.l-modal__overlay {
	width: 100%;
	height: 100%;
	background-color: RGBA(var(--color-primary-dark), 0.7);
	position: fixed;
	top: 0;
	left: 0;
	margin: 0;
	padding: 0;
}

// @supports (backdrop-filter: none) {
// 	.l-modal__overlay {
// 		background-color: RGBA(var(--color-accent-primary), 0.5);
// 		backdrop-filter: blur(20px);
// 	}
// }

.l-modal__scrollable {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	height: 100%;
	overflow: auto;
	display: grid;
	align-items: center;
	justify-content: stretch;
	padding: 20px;
}

@media (spanning: single-fold-vertical) {
	.l-modal__scrollable {
		width: calc(env(fold-right) - env(fold-width));
	}
}

.l-modal__dialog {
	background-color: RGB(var(--color-surface-light));
	color: RGB(var(--color-text-primary));
	position: relative;
	width: 100%;
	display: flex;
	border-radius: $border-radius-m;
	box-shadow: 0 2px 9px RGBA(var(--color-primary-dark), 0.7);
	margin-bottom: 20px;
	justify-self: center;
}

.l-modal__document {
	min-height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
}

.l-modal__container {
	padding-top: 48px;
	padding-bottom: 20px;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.l-modal__close-button {
	position: absolute;
	top: 10px;
	right: 10px;
	height: 26px;
	width: 26px;
	padding: 8px;
	background: transparent;
	color: RGB(var(--color-text-primary));
	border: 0;
	font-size: 26px;
	font-weight: 100;
	line-height: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: content-box;
	font-family: sans-serif;
	border-radius: 4px;
}

@media ($on-tablet) {
	.l-modal {
		align-items: center;
	}

	.l-modal__dialog {
		width: 100%;
		max-width: 750px;
	}

	.l-modal__container {
		padding: 50px 0 40px;
	}
}

.l-modal__wrapper {
	padding: 0 20px;
	text-align: center;
	max-width: 480px;
	margin: 0 auto;
	flex-grow: 1;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	width: 100%;
}

.l-modal.--stretch .l-modal__wrapper {
	max-width: none;
}

.icon {
	font-size: 40px;
	color: RGB(var(--color-secondary));
}

.icon /deep/ * {
	font-size: inherit;
}

.icon + header {
	margin-top: 24px;
}

h1 {
	line-height: 1;
	margin-bottom: 10px;
	border-bottom: 3px solid RGB(var(--color-secondary));
	display: inline-block;
	padding-bottom: 10px;
	outline: 0;
}

header {
	margin-bottom: 20px;
}

.scrolling {
	overflow-y: auto;
	overscroll-behavior: contain;
	margin-top: -20px;
	margin-bottom: -20px;
	padding-top: 20px;
	padding-bottom: 20px;
	display: flex;
}

.l-modal__buttons {
	width: 100%;
	margin: 20px auto 4px;
	justify-content: stretch;
	display: flex;
	flex-wrap: wrap;
}

.l-modal__buttons /deep/ > .button {
	flex-grow: 1;
	flex-shrink: 0;
	flex-basis: 120px;
	min-width: 140px;
	margin: 8px 10px;
}

.l-modal__buttons /deep/ > .button:first-child:last-child {
	margin-left: 0;
	margin-right: 0;
}

@media ($on-tablet) {
	.l-modal__buttons {
		justify-content: center;
		margin-top: 30px;
	}

	.l-modal__buttons /deep/ > * {
		max-width: 320px;
	}
}

.l-modal.--fullscreen {
	.l-modal__scrollable {
		padding: 0;
		display: flex;
	}

	.l-modal__dialog {
		margin: 0;
		max-width: none;
		width: 100%;
		height: 100%;
		border-radius: 0;
	}
}
</style>
