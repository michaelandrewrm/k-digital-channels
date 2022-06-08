<template>
	<div class="w-correos-cash-share">
		<c-icon src="@icons/correos" />
		<span class="w-correos-cash-share__flow">{{ title }}</span>
		<button
			data-testid="share-button"
			class="w-correos-cash-share__button text-m-medium"
			@click="share"
		>
			{{ $t('ACTIONS.SHARE') }}
		</button>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'w-correos-cash-share',

	components: { CIcon },

	props: { title: String, canvas: HTMLCanvasElement },

	data() {
		return { blob: null, isHybrid: navigator.userAgent.includes('Skybrid') };
	},

	methods: {
		share() {
			if (this.isHybrid) {
				const { canvas } = this;
				const b64Data = canvas.toDataURL('image/png', 1.0);

				return window.dispatchEvent(
					new CustomEvent('bridge-share-file', {
						detail: { b64Data, type: 'image/png' },
					})
				);
			}

			const { blob } = this;
			const shareData = {
				files: [
					new File([blob], `${+new Date()}.png`, {
						type: 'image/png',
						lastModified: new Date().getDate(),
					}),
				],
			};

			/* istanbul ignore else */
			if (window.navigator.canShare && window.navigator.canShare(shareData)) {
				return window.navigator.share(shareData);
			}
		},
	},

	/* istanbul ignore next */
	mounted() {
		const { canvas } = this;

		canvas.toBlob(
			(blob) => {
				this.blob = blob;
			},
			'image/png',
			1.0
		);
	},
};
</script>

<style lang="scss" scoped>
.w-correos-cash-share {
	display: flex;
	width: 100%;
	gap: 10px;
	align-items: center;
}

.w-correos-cash-share__flow {
	flex-grow: 1;
	user-select: none;
}

.w-correos-cash-share__button {
	user-select: none;
	color: RGB(var(--color-secondary));
	appearance: none;
	text-decoration: none;
	border: none;
	outline: none;
	background: transparent;
}
</style>
