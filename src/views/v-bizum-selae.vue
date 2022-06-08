<template>
	<l-view-modal @close="$router.back()">
		<transition name="placeholder">
			<template v-if="loading">
				<c-placeholder-detail class="v-bizum-qr__placeholder" />
			</template>
		</transition>

		<transition name="content" slot="header">
			<template v-slot:header>
				{{ $t('BIZUM.SELAE.TITLE') }}
			</template>
		</transition>

		<transition name="content">
			<div class="v-bizum-qr__wrapper" v-if="data">
				<div class="v-bizum-qr__container-qr" id="qrcontainer" data-testid="qr" v-if="QRImg">
					<img id="qrcode" :src="QRImg" />
				</div>

				<div data-testid="description">
					<p class="text-m-medium text-description">
						{{ $t('BIZUM.SELAE.DESCRIPTION') }}
					</p>
				</div>

				<div class="operation-timer" data-testid="timer" v-if="data.expirationDate">
					<p class="text-m-medium timer">{{ time }}</p>
					<p class="text-m-medium">{{ $t('BIZUM.SELAE.TIME') }}</p>
				</div>
			</div>
		</transition>
	</l-view-modal>
</template>

<script>
import LViewModal from '@layouts/l-view-modal';
import CPlaceholderDetail from '@components/c-placeholder-detail.vue';

const nthIndex = (str, sub, n) => {
	let i = 0;
	let lastIndex;
	const indexes = [];
	while (i < n) {
		const index = str.indexOf(sub, lastIndex + 1);
		indexes.push(index);
		lastIndex = index;
		i += 1;
	}
	return indexes[n - 1];
};

const parseDate = (str) => {
	// we assume that the date we want is on the actual day, we don't use Date.parse for browser compatibility.
	// 2022-03-18 14:16:54:767 example string date coming from the backend.

	const hour = str.slice(nthIndex(str, ':', 1) - 2, nthIndex(str, ':', 1));
	const minute = str.slice(nthIndex(str, ':', 2) - 2, nthIndex(str, ':', 2));
	const segs = str.slice(nthIndex(str, ':', 2) + 1);

	const formattedDate = new Date();
	formattedDate.setHours(hour);
	formattedDate.setMinutes(minute);
	formattedDate.setSeconds(segs);

	return formattedDate;
};

export default {
	name: 'v-bizum-selae',

	components: {
		LViewModal,
		CPlaceholderDetail,
	},

	data() {
		return {
			timeLeft: 0,
			timer: '',
			data: '',
			QRImg: '',
			loading: true,
		};
	},

	computed: {
		/* istanbul ignore next */
		time() {
			if (!this.timeLeft) {
				return '10:00';
			}
			const timestamp = this.timeLeft;
			const minute = Math.floor(timestamp / 60);
			const seconds = timestamp % 60 ? timestamp % 60 : '0';
			if (seconds < 10) {
				return `${minute}:0${seconds}`;
			}

			return `${minute}:${seconds}`;
		},
	},

	methods: {
		getQR() {
			this.$store
				.dispatch('bizum/getQRCode')
				.then((response) => {
					if (!response?.data?.QR) {
						this.$router.back();
					}
					this.data = response.data;
					this.generateQR();
					this.setCountdown();
				})
				.catch(() => {
					this.$store.dispatch('notification/open', {
						text: this.$t('BIZUM.SELAE.REQUEST.FAIL'),
					});
					this.$router.back();
				})
				.finally(() => {
					this.loading = false;
				});
		},

		generateQR() {
			this.$store
				.dispatch('bizum/getQRImage', this.data)
				.then((res) => {
					this.QRImg = res.image;
				})
				.catch(() => {
					this.$store.dispatch('notification/open', {
						text: this.$t('BIZUM.SELAE.REQUEST.FAIL'),
					});
					this.$router.back();
				});
		},

		setCountdown() {
			const { expirationDate } = this.data;
			let expiration = expirationDate.slice(0, expirationDate.length - 4);
			expiration = parseDate(expiration).getTime();
			this.timer = setInterval(() => {
				const now = new Date().getTime();
				const diff = Math.round((expiration - now) / 1000);
				this.timeLeft = diff;
				/* istanbul ignore if */
				if (this.timeLeft < 0) {
					this.clearAndBack();
				}
				this.checkOperation();
			}, 1000);
		},

		/* istanbul ignore next */
		clearAndBack() {
			clearInterval(this.timer);
			this.$router.back();
		},

		async checkOperation() {
			const { id } = this.data;
			const ERROR_MESSAGE = this.$t('BIZUM.SELAE.FAIL');
			const ERROR_DESCRIPTION = this.$t('BIZUM.SELAE.FAIL_DESCRIPTION');
			await this.$store
				.dispatch('bizum/getSelaeOperation', { id })
				.then((response) => {
					const { status } = response;
					const item = response.data;

					if (status === 200) {
						let successStatus = 'VALIDATED';
						const { operationType } = item.data;

						if (operationType === 'COBRO-APUESTAS') {
							successStatus = 'PENDING';
						}

						if (successStatus === item.data.status) {
							clearInterval(this.timer);
							this.$router.replace({
								name: 'bizum-selae-detail',
								params: {
									success: true,
									source: item.data,
								},
							});
						}
					}
				})
				.catch((response) => {
					const { status } = response;

					if (status === 404) {
						return;
					}

					if (status === 500) {
						clearInterval(this.timer);
						this.$router.replace({
							name: 'bizum-selae-detail',
							params: {
								error: true,
								errorTitle: ERROR_MESSAGE,
								errorDetail: ERROR_DESCRIPTION,
							},
						});
					}
				});
		},
	},

	created() {
		this.getQR();
	},

	beforeDestroy() {
		clearInterval(this.timer);
	},
};
</script>

<style lang="scss" scoped>
.placeholder-enter {
	opacity: 0;
	transform: translateX(-10px);
}

.placeholder-leave-active {
	opacity: 0;
	transform: translateX(10px);
}

.placeholder-enter-active {
	transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
}

.placeholder-leave-active {
	transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
}

.content-enter {
	opacity: 0;
}

.content-leave-active {
	opacity: 0;
}

.content-enter-active {
	transition: opacity 300ms ease-in-out;
	transition-delay: 400ms;
}

.content-leave-active {
	transition: opacity 300ms ease-in-out;
}
.v-bizum-qr__placeholder {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 36px;
	left: 0;
}
.v-bizum-qr__wrapper {
	margin: 20px 0;
}

h2 {
	padding-bottom: 10px;
	border-bottom: 1px solid RGBA(var(--color-text-primary-light), 0.2);
	margin-bottom: 10px;
}

.v-bizum-qr__container-qr {
	margin: 20px;
	padding: 20px;
	text-align: center;
}

.text-description {
	font-size: 16px;
	margin-bottom: 10px;
	padding-top: 10px;
	padding-bottom: 30px;
	display: flex;
	border-bottom: 1px solid RGBA(var(--color-text-primary-light), 0.2);
	text-align: center;
}
.operation-timer {
	text-align: center;
}

.operation-timer p {
	text-align: center;
	font-size: 16px;
	padding: 5px;
}

.timer {
	font-size: 22px !important;
}
</style>
