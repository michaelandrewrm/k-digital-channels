<template>
	<div class="v-login" data-theme="light">
		<h1 v-a11y-hide ref="welcomeTitle">{{ $t('WELCOME', { project: $t('TITLE') }) }}</h1>

		<l-login>
			<w-login
				ref="widgetLogin"
				v-show="shouldShowContent"
				:visible="shouldShowContent"
				:isPasswordRecoveryOpened="isPasswordRecoveryOpened"
				@open-password-recovery="openPasswordRecovery"
				slot="default"
			/>

			<w-carousel
				slot="aside"
				v-if="shouldShowCarousel"
				ref="widgetCarousel"
				:title="$t('NEWS')"
				:slides="slides"
				:skipable="!isDesktop"
				:navigable="(isTablet && !isDesktop) || isBigScreens"
				@skip-carousel="skipCarousel"
			/>
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
import MPasswordRecovery from '@modals/m-password-recovery';
import MSomethingWrong from '@modals/m-something-wrong';
import communicationsModule from '@modules/communications/m-communications';

const COOKIE_CONSENT = 'cookieconsent_status';

/**
 * We have to adapt this view when we modify the layouts,
 * this means that the button register binded method must be changed,
 * The actual solution to hide the register button is NOT the final solution
 */

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
			carouselSkipped: false,
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

		shouldShowContent({ isDesktop, slides, carouselSkipped }) {
			return !slides.length || carouselSkipped || isDesktop;
		},

		shouldShowCarousel({ isDesktop, slides, carouselSkipped }) {
			return slides.length > 0 && (isDesktop || !carouselSkipped);
		},
	},

	methods: {
		skipCarousel() {
			this.carouselSkipped = true;
			this.$store.dispatch('session/skipNews', this.slides[0]?.id);
			this.$nextTick(() => {
				this.$refs.widgetLogin.focus();
			});
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

		openPasswordRecovery() {
			this.isPasswordRecoveryOpened = true;

			const { dispatch } = this.$store;

			dispatch('authn/loginAnonymous')
				.then(() => dispatch('loading/start'))
				.then(() => dispatch('modal/open', MPasswordRecovery))
				.catch(() => dispatch('modal/open', MSomethingWrong).then(() => dispatch('loading/end')))
				.finally(() => {
					this.isPasswordRecoveryOpened = false;
				});
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

	beforeRouteEnter(to, from, next) {
		next((vm) => {
			if (vm.isEmbedded && window.parent && from.name === 'global') {
				window.parent.postMessage({ name: 'hide-frame' }, '*');
			}

			if (to?.name === 'login' && to?.query?.action === 'pwd-recovery') {
				vm.$store.dispatch('loading/start');
			}
		});
	},

	created() {
		this.$store
			.dispatch('communications/getAnnouncements', 'prelogin')
			.then((items) => {
				this.slides = items;
			})
			.catch(() => {})
			.finally(() => {
				this.carouselSkipped = this.slides[0]?.id === this.$store.state.session.skippedNews;
				window.dispatchEvent(new Event('ready-for-action'));

				const { name, query } = this.$route;

				if (name === 'login' && query?.action === 'pwd-recovery') {
					this.openPasswordRecovery();
				}
			});

		/* istanbul ignore else */
		if (!this.isEmbedded) {
			this.showCookies = this.getCookie(COOKIE_CONSENT) !== 'dismiss';
		}
	},

	mounted() {
		this.$nextTick(() => {
			this.$refs.welcomeTitle.focus();
		});
	},
};
</script>

<style lang="scss" scoped>
.v-login {
	width: 100%;
	height: 100%;
}
</style>
