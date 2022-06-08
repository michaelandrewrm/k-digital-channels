<template>
	<l-page>
		<h1 slot="header" tabindex="-1">{{ title }}</h1>

		<transition name="placeholder" mode="out-in">
			<c-placeholder-message v-if="loading" class="v-communication-detail__placeholder" />

			<div v-else-if="error" class="v-communication-detail__error-wrapper" data-testid="error">
				<c-icon class="v-communication-detail__error-icon" src="@icons/modalExclamation" />

				<p class="text-m-book v-communication-detail__error-text">
					{{ $t('RESOURCE.DOCUMENT.ERROR') }}
				</p>
			</div>

			<div v-else-if="source" class="v-communication-detail__page">
				<div class="v-communication-detail__title text-l-bold">{{ source.description }}</div>
				<div class="v-communication-detail__date text-s-book">
					{{ $d(new Date(source.creationDate), 'numeric') }}
				</div>
				<div class="v-communication-detail__text text-m-book">{{ source.text }}</div>

				<div class="v-communication-detail__download" v-if="base64Document">
					<span
						class="v-communication-detail__download-button text-l-book"
						@click="viewDocument"
						data-testid="view-document-button"
					>
						<c-icon-button
							icon="@icons/attachment"
							raised
							class="v-communication-detail__download-button-icon"
						/>
						{{ $t('COMMUNICATIONS.DOWNLOAD_DOCUMENT') }}
					</span>
				</div>
			</div>
		</transition>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import communicationsModule from '@modules/communications/m-communications';
import CIcon from '@components/c-icon';
import CIconButton from '@components/c-icon-button';
import CPlaceholderMessage from '@components/c-placeholder-message';
import b64toBlob from '@utils/b64toBlob';

export default {
	name: 'v-communication-detail',

	modules: {
		communications: communicationsModule,
	},

	components: {
		LPage,
		CIcon,
		CIconButton,
		CPlaceholderMessage,
	},

	data() {
		return {
			loading: false,
			error: false,
			source: null,
			base64Document: null,
			isHybrid: navigator.userAgent.includes('Skybrid'),
		};
	},

	props: {
		type: { type: String },
		messageId: { type: String },
	},

	computed: {
		title({ type }) {
			return {
				alerts: this.$t('COMMUNICATIONS.ALERTS'),
				statements: this.$t('COMMUNICATIONS.FOR_YOU'),
				documents: this.$t('COMMUNICATIONS.DOCUMENTS'),
			}[type];
		},
	},

	watch: {
		messageId: {
			immediate: true,
			handler(id) {
				const { type } = this;
				const action = {
					alerts: 'communications/getMessage',
					documents: 'communications/getDocument',
				}[type];

				this.source = null;
				this.error = false;
				this.$store.dispatch(action, id).then((data) => {
					this.source = data;
					if (data?.hasAttachment) {
						this.loading = true;
						this.$store
							.dispatch('communications/downloadDocument', { id, type: data.type.id })
							.then(({ pdf }) => {
								this.base64Document = pdf;
							})
							.catch(() => {
								this.error = true;
							})
							.finally(() => {
								this.loading = false;
							});
					} else {
						this.base64Document = null;
						this.loading = false;
					}
				});
			},
		},
	},

	methods: {
		viewDocument() {
			const type = 'application/pdf';
			const blobStore = b64toBlob(this.base64Document, 'pdf');
			const link = window.URL.createObjectURL(blobStore);

			if (this.isHybrid) {
				window.dispatchEvent(
					new CustomEvent('bridge-save-file', { detail: { b64Data: this.base64Document, type } })
				);
			} else {
				const tab = window.open();
				tab.location.replace(link);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.v-communication-detail__page {
	user-select: text;
}

.v-communication-detail__date {
	margin: 15px 0 40px;
}

.v-communication-detail__text {
	line-height: 1.5;
}

.v-communication-detail__download {
	display: flex;
	place-content: center;
}

.v-communication-detail__download-button {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 40px 0;

	@media (hover) {
		cursor: pointer;
	}
}

.v-communication-detail__download-button-icon {
	margin-right: 20px;
}

.v-communication-detail__placeholder {
	position: absolute;
	width: 100%;
	left: 0;
	top: 0;
	padding: 0 20px;
}

.v-communication-detail__error-wrapper {
	text-align: center;
	margin: 10px 0;
}

.v-communication-detail__error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}

.v-communication-detail__error-link {
	text-decoration: underline;
	display: block;
}

.placeholder-enter {
	opacity: 0;
	transform: translateY(-5px);
}

.placeholder-leave-active {
	opacity: 0;
	transform: translateY(5px);
}

.placeholder-enter-active {
	transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
}

.placeholder-leave-active {
	transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
}
</style>
