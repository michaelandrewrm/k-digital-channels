<template>
	<div class="l-action-sheet">
		<div class="l-action-sheet__overlay" tabindex="-1" @click="close"></div>
		<transition name="slide" appear>
			<div class="l-action-sheet__dialog" v-if="!loading">
				<div role="document" class="l-action-sheet__document">
					<section class="l-action-sheet__container" ref="container">
						<div class="l-action-sheet__wrapper">
							<header>
								<h1 tabindex="0" class="text-l-medium">
									<slot name="title" />
								</h1>
							</header>

							<div class="shadow-top"></div>

							<div class="scrolling text-m-book">
								<slot name="options" />
							</div>

							<div class="shadow-bottom"></div>

							<div class="buttons" v-if="$slots.buttons">
								<slot name="buttons" />
							</div>
						</div>
					</section>

					<button
						class="l-action-sheet__close-button"
						:title="$t('MODAL.CLOSE')"
						:aria-label="$t('MODAL.CLOSE')"
						@click="close"
						data-testid="modal-close-button"
					>
						<!-- eslint-disable-line vue-i18n/no-raw-text -->
						&times;
					</button>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'l-action-sheet',

	props: { loading: Boolean },

	methods: {
		close() {
			/* istanbul ignore else */
			if (!this.loading) {
				this.$el.dispatchEvent(new Event('close', { bubbles: true }));
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.l-action-sheet {
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
}

.l-action-sheet__overlay {
	width: 100%;
	height: 100%;
	background-color: RGBA(var(--color-primary-dark), 0.7);
	position: fixed;
	top: 0;
	left: 0;
	margin: 0;
	padding: 0;
}

.l-action-sheet__dialog {
	background-color: RGB(var(--color-surface));
	position: relative;
	max-height: 100%;
	width: 100%;
	display: flex;
	border-top-left-radius: $border-radius-l;
	border-top-right-radius: $border-radius-l;
	align-self: flex-end;
}

.l-action-sheet__document {
	display: flex;
	overflow: hidden;
	min-height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
}

.l-action-sheet__container {
	padding-top: 20px;
	padding-bottom: 20px;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.l-action-sheet__close-button {
	position: absolute;
	top: 10px;
	right: 10px;
	height: 26px;
	width: 26px;
	padding: 8px;
	background: transparent;
	border: 0;
	font-size: 26px;
	font-weight: 100;
	line-height: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: content-box;
	font-family: sans-serif;
	color: RGB(var(--color-text-primary));
}

@media ($on-tablet) {
	.l-action-sheet__dialog {
		height: auto;
		max-height: 625px;
		max-width: 630px;
	}
}

@media ($on-desktop) {
	.l-action-sheet__dialog {
		max-height: 780px;
	}
}

.l-action-sheet__wrapper {
	padding: 0 20px;
	text-align: left;
	margin: 0 auto;
	flex-grow: 1;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	width: 100%;
	color: RGB(var(--color-text-primary));
}

header {
	margin-bottom: 20px;
}

h1 {
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.2);
	display: block;
	padding: 0 10px 20px;
	outline: 0;
}

.scrolling {
	overflow-y: auto;
	overflow-y: overlay;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
	overscroll-behavior: contain;
	margin-top: -20px;
	margin-bottom: -20px;
	display: flex;
}

.shadow-bottom,
.shadow-top {
	height: 20px;
	background: linear-gradient(
		to bottom,
		RGB(var(--color-surface)),
		RGBA(var(--color-surface-light), 0)
	);
	position: relative;
	width: 100%;
	left: 0;
	right: 0;
	flex-shrink: 0;
	pointer-events: none;
}

.shadow-bottom {
	background: linear-gradient(
		to top,
		RGB(var(--color-surface)),
		RGBA(var(--color-surface-light), 0)
	);
}

.slide-enter-active,
.slide-leave-active {
	transition: transform 200ms ease-out;
}

.slide-enter,
.slide-leave-to {
	transform: translateY(100%);
}
</style>
