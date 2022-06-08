<template>
	<div class="w-download-document">
		<template v-if="!error && downloading">
			<span class="w-download-document__animation" aria-hidden="true">
				<span class="w-download-document__arrow"></span>
				<span class="w-download-document__arrow"></span>
			</span>
			<span>{{ $t('GENERATING_DOCUMENT') }}</span>
		</template>

		<template v-else-if="!error && !downloading">
			<c-icon v-if="extension === 'PDF'" src="@icons/pdf" />
			<c-icon v-if="extension === 'XLS'" src="@icons/xls" />
			<span class="w-download-document__flow">{{ title }}</span>
			<a v-if="isDesktop" class="color-secondary" :href="link" :download="fileName">
				{{ $t('ACTIONS.DOWNLOAD_DOCUMENT') }} {{ extension }}
			</a>
			<div v-else class="color-secondary" @click="onDownloadClick" data-testid="download">
				{{ $t('ACTIONS.DOWNLOAD_DOCUMENT') }} {{ extension }}
			</div>
		</template>

		<template v-else-if="error">
			<c-icon class="color-secondary" src="@icons/document" />
			<span class="w-download-document__flow">{{ $t('GENERATED_DOCUMENT_ERROR') }}</span>
		</template>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import mq from '@utils/matchMedia';
import { onDesktop } from '@theme';

export default {
	name: 'w-download-document',

	components: {
		CIcon,
	},

	data() {
		return {
			downloading: false,
			error: false,
			link: null,
			base64Data: null,
			isHybrid: navigator.userAgent.includes('Skybrid'),
		};
	},

	props: {
		channel: { type: [MessageChannel, Object] },
		extension: { type: String },
		title: { type: String },
	},

	computed: {
		isDesktop: mq(onDesktop),

		fileName() {
			return new Date().toISOString().replace(/\D/g, '');
		},
	},

	methods: {
		onMessage({ data }) {
			const { name } = data;

			/* istanbul ignore else */
			if (name === 'downloaded') {
				this.onDownload(data);
			} else if (name === 'error') {
				this.onError();
			}
		},

		onDownload({ blob, b64Data }) {
			this.link = window.URL.createObjectURL(blob);
			this.base64Data = b64Data;
			this.downloading = false;
			this.error = false;
			this.channel.port2.onmessage = null;
		},

		onError() {
			this.error = true;
			this.channel.port2.onmessage = null;
		},

		onDownloadClick() {
			if (this.isHybrid) {
				return window.dispatchEvent(
					new CustomEvent('bridge-save-file', {
						detail: { b64Data: this.base64Data, type: 'application/pdf' },
					})
				);
			}

			const tab = window.open();
			tab.location.replace(this.link);
		},
	},

	mounted() {
		/* istanbul ignore else */
		if (this.channel) {
			this.downloading = true;
			this.channel.port2.onmessage = this.onMessage;
		}
	},
};
</script>

<style lang="scss" scoped>
.w-download-document {
	display: flex;
	width: 100%;
	gap: 10px;
	align-items: center;
}

.w-download-document__flow {
	flex-grow: 1;
	user-select: none;
}

.w-download-document__animation {
	width: 16px;
	height: 16px;
}

.w-download-document__arrow {
	position: absolute;
	bottom: 0;
	margin-left: 0px;
	width: 12px;
	height: 12px;
	background-size: contain;
	top: 20px;
	background-image: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHN0eWxlPi5zdDB7ZmlsbDojZmZmfTwvc3R5bGU+PHBhdGggY2xhc3M9InN0MCIgZD0iTTMxOS4xIDIxN2MyMC4yIDIwLjIgMTkuOSA1My4yLS42IDczLjdzLTUzLjUgMjAuOC03My43LjZsLTE5MC0xOTBjLTIwLjEtMjAuMi0xOS44LTUzLjIuNy03My43UzEwOSA2LjggMTI5LjEgMjdsMTkwIDE5MHoiLz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzE5LjEgMjkwLjVjMjAuMi0yMC4yIDE5LjktNTMuMi0uNi03My43cy01My41LTIwLjgtNzMuNy0uNmwtMTkwIDE5MGMtMjAuMiAyMC4yLTE5LjkgNTMuMi42IDczLjdzNTMuNSAyMC44IDczLjcuNmwxOTAtMTkweiIvPjwvc3ZnPg==);
	transform: translateY(0px) rotate(90deg) scale(1);
	animation-name: bounce;
	animation-duration: 1.4s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
	animation-delay: 0.2s;
}

.w-download-document__arrow + .w-download-document__arrow {
	margin-top: 8px;
	animation-delay: 0s;
}

@keyframes bounce {
	0% {
		opacity: 1;
		transform: translateY(0px) rotate(90deg) scale(1);
	}
	25% {
		opacity: 0;
		transform: translateY(10px) rotate(90deg) scale(0.9);
	}
	26% {
		opacity: 0;
		transform: translateY(-10px) rotate(90deg) scale(0.9);
	}
	55% {
		opacity: 1;
		transform: translateY(0px) rotate(90deg) scale(1);
	}
}
</style>
