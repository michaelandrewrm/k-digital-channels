<template>
	<div class="v-bolsa-caminos">
		<iframe
			v-if="showFrame"
			class="v-bolsa-caminos__iframe"
			:class="{ '--is-active': !loading }"
			ref="iframe"
			:src="iframeURL"
			frameborder="0"
			@load.once="onIframeLoad"
		></iframe>
		<div class="v-bolsa-caminos__default-section">
			<div class="v-bolsa-caminos__aqua-logo">
				<span class="v-bolsa-caminos__aqua-icon">
					<c-icon src="@icons/productCaminosEq" size="" />
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import MSomethingWrong from '@modals/m-something-wrong';

export default {
	name: 'v-bolsa-caminos',

	components: {
		CIcon,
	},

	data() {
		return {
			loading: true,
			timer: null,
			iframeURL: null,
		};
	},

	computed: {
		showFrame({ iframeURL }) {
			return Boolean(iframeURL);
		},
	},

	methods: {
		async openSomethingWrongModal() {
			await this.$store.dispatch('modal/open', MSomethingWrong);
			this.$router.back();
		},

		onIframeLoad() {
			clearTimeout(this.timer);
			this.loading = false;
		},
	},

	created() {
		this.loading = true;
		this.$store
			.dispatch('user/ssoBolsaCaminos')
			.then(({ data: { url } }) => {
				this.iframeURL = url;

				this.timer = setTimeout(() => {
					this.openSomethingWrongModal();
				}, 10000);
			})
			.catch(() => {
				this.openSomethingWrongModal();
			});
	},

	destroyed() {
		clearTimeout(this.timer);
	},
};
</script>

<style lang="scss" scoped>
.v-bolsa-caminos {
	width: 100%;
	height: 100%;
}

.v-bolsa-caminos__loading {
	display: flex;
	position: relative;
	width: 100%;
	height: 100%;
	background: RGB(var(--color-surface-dark));
}

.v-bolsa-caminos__iframe {
	width: 100%;
	height: 100%;
	background: RGB(var(--color-surface-dark));
	transition: opacity 400ms 200ms linear;
	opacity: 0;
	padding-bottom: var(--safe-area-bottom);
}

.v-bolsa-caminos__iframe.--is-active {
	opacity: 1;
	z-index: $layer-page-z-index;
}

.v-bolsa-caminos__default-section {
	display: flex;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background: RGB(var(--color-surface-dark));
	color: RGB(var(--color-text-primary));
	z-index: -1;
}

.v-bolsa-caminos__aqua-logo {
	opacity: 0.1;
	text-align: center;
	pointer-events: none;
	user-select: none;
}

.v-bolsa-caminos__aqua-icon {
	font-size: 120px;
}
</style>
