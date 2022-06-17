<template>
	<div class="v-login" data-theme="light">
		<l-login>
			<div class="v-login__form" slot="default">
				<w-login v-show="shouldShowContent" />
			</div>

			<div v-if="shouldShowCarousel" class="v-login__carousel" slot="aside">
				<w-carousel
					:title="$t('LOGIN.NEWS')"
					:slides="slides"
					:skipable="!isDesktop"
					:navigable="(isTablet && !isDesktop) || isBigScreens"
					@skip-carousel="setNewsId"
				/>
			</div>
		</l-login>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import mq from '@utils/matchMedia';
import { onTablet, onDesktop, onBigScreens } from '@theme';
import LLogin from '@layouts/l-login';
import WLogin from '@widgets/w-login';
import WCarousel from '@widgets/w-carousel';
import MAcceptCookies from '@modals/m-accept-cookies';
import communicationsModule from '@modules/communications/m-communications';

const COOKIE_CONSENT = 'cookieconsent_status';

export default {
	name: 'v-login',

	modules: {
		communications: communicationsModule,
	},

	components: {
		LLogin,
		WLogin,
		WCarousel,
	},

	data() {
		return {
			slides: [],
			isNewsSkipped: false,
			showCookies: false,
			isPasswordRecoveryOpened: false,
		};
	},

	computed: {
		isTablet: mq(onTablet),
		isDesktop: mq(onDesktop),
		isBigScreens: mq(onBigScreens),
		isSmallHeight: mq('(max-height: 800px)'),
		...mapState('authn', ['isEmbedded']),
		...mapState('session', ['newsId']),

		shouldShowContent({ slides, isNewsSkipped, isDesktop }) {
			return !slides?.length || isNewsSkipped || isDesktop;
		},

		shouldShowCarousel({ slides, isNewsSkipped, isDesktop }) {
			return slides?.length && (isDesktop || !isNewsSkipped);
		},
	},

	methods: {
		setNewsId() {
			const [slide] = this.slides;
			const slideId = slide?.id;

			this.isNewsSkipped = true;
			this.$store.dispatch('session/setNewsId', slideId);
		},

		getCookie(name) {
			const value = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
			return value ? value[2] : null;
		},

		setCookie(name, value) {
			const d = new Date();
			d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * 365);
			document.cookie = `${name}=${value};path=/;expires=${d.toGMTString()}`;
		},

		acceptCookies() {
			this.setCookie(COOKIE_CONSENT, 'dismiss');
			this.showCookies = false;
		},

		async getAnnouncements() {
			this.slides = await this.$store.dispatch('communications/getAnnouncements', 'prelogin');
			const [slide] = this.slides;
			const slideId = slide?.id;
			this.isNewsSkipped = slideId === this.newsId;

			window.dispatchEvent(new Event('ready-for-action'));
		},
	},

	watch: {
		async showCookies(value) {
			if (value) {
				const cookieConsent = await this.$store.dispatch('modal/open', MAcceptCookies);
				this.acceptCookies();

				if (cookieConsent && window.dataLayer) {
					window.dataLayer.push('consent', 'update', {
						ad_storage: 'granted',
						analytics_storage: 'granted',
					});
				}
			}
		},
	},

	created() {
		this.getAnnouncements();
		this.showCookies = this.getCookie(COOKIE_CONSENT) !== 'dismiss';
	},
};
</script>

<style lang="scss" scoped>
.v-login {
	width: 100%;
	height: 100%;
}

.v-login__form {
	width: 100%;
	max-width: 320px;
	padding: 20px;
}

.v-login__carousel {
	width: 100%;
	padding: 20px;
}
</style>
