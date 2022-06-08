<template>
	<div class="w-correos-cash-download">
		<c-icon src="@icons/correos" />
		<span class="w-correos-cash-download__flow">{{ title }}</span>
		<a
			v-if="!isHybrid"
			class="w-correos-cash-download__link"
			:href="url"
			:download="name"
			data-testid="link"
		>
			{{ $t('ACTIONS.DOWNLOAD_DOCUMENT') }}
		</a>
		<button
			v-else
			class="w-correos-cash-download__link"
			@click="onDownloadClick"
			data-testid="button"
		>
			{{ $t('ACTIONS.DOWNLOAD_DOCUMENT') }}
		</button>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'w-correos-cash-download',

	components: { CIcon },

	props: { title: String, canvas: HTMLCanvasElement },

	data() {
		return {
			blob: null,
			url: null,
			name: null,
			isHybrid: navigator.userAgent.includes('Skybrid'),
		};
	},

	methods: {
		onDownloadClick() {
			const { canvas } = this;
			const b64Data = canvas.toDataURL('image/png', 1.0);

			return window.dispatchEvent(
				new CustomEvent('bridge-save-file', {
					detail: { b64Data, type: 'image/png' },
				})
			);
		},
	},

	watch: {
		/* istanbul ignore next */
		blob(blob) {
			const { id } = this.canvas;
			const file = new File([blob], `${id}.png`, {
				type: 'image/png',
				lastModified: new Date().getDate(),
			});
			this.url = window.URL.createObjectURL(file);
			this.name = `${id}.png`;
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
.w-correos-cash-download {
	display: flex;
	width: 100%;
	gap: 10px;
	align-items: center;
}

.w-correos-cash-download__flow {
	flex-grow: 1;
	user-select: none;
}

.w-correos-cash-download__link {
	user-select: none;
	color: RGB(var(--color-secondary));
	appearance: none;
	text-decoration: none;
	border: none;
	outline: none;
	background: transparent;
}
</style>
