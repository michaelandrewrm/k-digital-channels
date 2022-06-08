<template>
	<l-view-modal @close="$router.back()" class="v-correos-cash-qr">
		<div class="v-correos-cash-qr__wrapper">
			<c-slider
				v-if="barcodes && barcodes.length"
				data-testid="slider"
				class="v-correos-cash-qr__slider"
				:selected="qrId"
				@change="changeQR($event)"
			>
				<div class="v-correos-cash-qr__slide" v-for="code in barcodes" :key="code.id" :id="code.id">
					<img class="v-correos-cash-qr__code" :src="code.base64Image" />
				</div>
			</c-slider>
		</div>
	</l-view-modal>
</template>

<script>
import LViewModal from '@layouts/l-view-modal';
import CSlider from '@components/c-slider';

export default {
	name: 'v-correos-cash-qr',

	components: {
		LViewModal,
		CSlider,
	},

	props: {
		depositId: { type: String, required: true },
		qrId: { type: [Number, String], required: true },
	},

	data() {
		return {
			source: null,
			barcodes: null,
		};
	},

	watch: {
		depositId: {
			immediate: true,
			async handler(depositId) {
				const { dispatch } = this.$store;
				const deposit = await dispatch('correos-cash/get', { depositId });

				/* istanbul ignore next */
				if (!deposit?.id) {
					return this.$router.back();
				}

				this.source = deposit;
				this.barcodes = await dispatch('correos-cash/getQRCodesFromDeposit', {
					depositId,
					mode: 'vertical',
				});
			},
		},
	},

	methods: {
		changeQR(id) {
			if (id !== this.qrId) {
				return this.$router.replace({
					name: 'correos-cash-qr',
					params: { depositId: this.depositId, qrId: id },
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.v-correos-cash-qr {
	--color-themed-surface-light: 255, 255, 255;
	--color-themed-surface: 255, 255, 255;
	--color-themed-surface-dark: 255, 255, 255;
	--color-text-primary-light: 0, 0, 0;
}

.v-correos-cash-qr__wrapper {
	display: flex;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
	padding: 50px 20px;
	overflow: hidden;
}

.v-correos-cash-qr__slide {
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
}

.v-correos-cash-qr__code {
	height: calc(100vh - 126px);
}

.v-correos-cash-qr__slider /deep/ [data-testid='slider-pane']:not(.--active) {
	opacity: 0;
}

.v-correos-cash-qr__slider /deep/ [data-testid='slider-pane'] .--active {
	opacity: 1;
}
</style>
