<template>
	<div class="m-image" @keydown.esc.capture="close">
		<transition name="fade" appear>
			<div class="m-image__overlay" tabindex="-1" @click="close"></div>
		</transition>

		<button
			class="m-image__close-button"
			:title="$t('MODAL.CLOSE')"
			:aria-label="$t('MODAL.CLOSE')"
			@click="close"
			data-testid="modal-close-button"
		>
			<!-- eslint-disable-line vue-i18n/no-raw-text -->
			&times;
		</button>

		<img class="m-image__image" :src="image" alt="" />
	</div>
</template>

<script>
export default {
	name: 'm-image',

	props: {
		image: { type: String },
	},

	methods: {
		close() {
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.fade-enter-active {
	animation: fade 200ms ease;
}

@keyframes fade {
	from {
		opacity: 0;
	}
}

.m-image {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 0;
	left: 0;
}

.m-image__overlay {
	width: 100%;
	height: 100%;
	background-color: RGBA(var(--color-dark-surface), 0.85);
	position: absolute;
	top: 0;
	left: 0;
	margin: 0;
	padding: 0;
	cursor: pointer;
}

.m-image__image {
	z-index: 1;
	box-shadow: 0 10px 20px 0px rgba(0, 0, 0, 0.4);
	max-width: calc(100% - 40px);
	max-height: calc(100% - 40px);
}

.m-image__close-button {
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
	color: white;
	z-index: 1;
	position: absolute;
	top: 10px;
	right: 7px;
}
</style>
