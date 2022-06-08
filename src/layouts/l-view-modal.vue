<template>
	<div class="l-view-modal" @keydown.esc.capture="close">
		<transition name="fade" appear>
			<div class="l-view-modal__overlay" tabindex="-1"></div>
		</transition>
		<div class="l-view-modal__dialog">
			<div role="document" class="l-view-modal__document">
				<header class="l-view-modal__header">
					<h1 v-if="$slots.header" tabindex="-1" class="text-m-bold">
						<slot name="header" />
					</h1>
					<h2 v-if="$slots.subheader" tabindex="-1" class="text-s-medium">
						<slot name="subheader" />
					</h2>
				</header>

				<section class="scrolling">
					<div class="l-view-modal__wrapper">
						<slot />
					</div>
				</section>
			</div>
			<button
				class="l-view-modal__close-button"
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
</template>

<script>
export default {
	name: 'l-view-modal',

	methods: {
		close() {
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.l-view-modal {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.fade-enter-active {
	animation: fade 200ms ease;
}

@keyframes fade {
	from {
		opacity: 0;
	}
}

.l-view-modal__overlay {
	width: 100%;
	height: 100%;
	background: linear-gradient(
		180deg,
		RGB(var(--color-themed-surface-light)) 0,
		RGB(var(--color-themed-surface)) 50%,
		RGB(var(--color-themed-surface-dark)) 100%
	);
	position: absolute;
	top: 0;
	left: 0;
	margin: 0;
	padding: 0;
}

.l-view-modal__wrapper {
	max-width: 400px;
	width: 100%;
	padding: 0 20px;
}

.l-view-modal__dialog {
	position: relative;
	height: 100%;
	width: 100%;
}

.l-view-modal__document {
	overflow: hidden;
	height: 100%;
	width: 100%;
	color: RGB(var(--color-text-primary-light));
	display: flex;
	flex-direction: column;
	margin: 0 auto;
	align-items: center;
}

.l-view-modal__close-button {
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
	color: RGB(var(--color-text-primary-light));
}

.l-view-modal__header {
	padding-top: 40px;
	text-align: center;
	flex-shrink: 0;
	& h1 {
		padding-bottom: 10px;
	}

	& h2 {
		color: RGB(var(--color-text-secondary-light));
		text-align: center;
		padding-bottom: 30px;
	}
}

.scrolling {
	overflow-y: auto;
	overflow-y: overlay;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
	flex-grow: 1;
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
}
</style>
