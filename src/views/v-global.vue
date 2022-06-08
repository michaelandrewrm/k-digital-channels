<template>
	<div class="v-global">
		<l-global
			:disable-sheet="isSheetDisabled"
			:reset-sheet="resetSheet"
			@sheet-lifted="sheetLifted = $event"
		>
			<c-parallax-header class="v-global__header" slot="header">
				<h1 class="a11y-hide" tabindex="-1">{{ $t('GLOBAL_POSITION') }}</h1>
				<span class="a11y-hide">{{ $t('HELLO') }} {{ userName }}</span>

				<transition name="slide-in-top">
					<div
						v-if="!isMultiple && isUserGreeted"
						class="v-global__welcome-text text-m-light"
						data-testid="greeting-message"
					>
						{{ $t('HELLO') }}
						<span class="text-m-medium">{{ userName }}</span>
					</div>
				</transition>
				<div class="v-global__we_will_help_you text-l-book">
					{{ $t('CAN_WE_HELP_YOU') }}
				</div>
				<c-sirvase-icon
					v-if="!isBancofar"
					data-testid="sirvase-efectuar"
					class="v-global__header__icon"
				/>
				<div class="v-global__header__icon v-global__header__icon--bright">
					<c-icon src="@icons/help" size="inherit" />
				</div>

				<div class="v-global__header__balance">
					<div
						v-if="isMultiple && connectedContract.description"
						class="v-global__contract"
						data-testid="contract-button"
						@click="selectContract"
					>
						<span class="v-global__contract-title text-m-light">
							{{ connectedContract.description }}
						</span>
						<span class="v-global__contract-arrow">
							<c-icon src="@icons/back" />
						</span>
					</div>
					<c-translide>
						<c-currency-label v-if="balance != null" :balance="balance" aria-hidden="true" />
					</c-translide>
					<c-translide>
						<div
							v-if="balance != null"
							data-testid="balance-modal"
							class="v-global__balance text-m-book color-text-secondary-light"
							@click="openBalanceModal"
						>
							<span aria-hidden="true">{{ $t('BALANCE') }}</span>
							<c-icon src="@icons/info" />
						</div>
					</c-translide>
					<span v-if="balance != null" class="a11y-hide">
						{{ $nc(balance) }} {{ $t('BALANCE') }}
					</span>
				</div>
				<c-notification-bell
					data-testid="notification-bell"
					class="v-global__header__icon"
					:badge="badge"
					@click="readMessages"
					:aria-label="$t('ACTIONS.READ_MESSAGES')"
				/>
			</c-parallax-header>

			<div v-if="!isSheetDisabled" class="v-global__chart" slot="main-header">
				<w-global-chart :chart="chartType ? 'column' : 'area'" aria-hidden="true" />
			</div>

			<div
				v-if="balance != null && !isSheetDisabled"
				slot="sheet-header"
				class="v-global__chart-buttons"
			>
				<c-icon-button
					v-if="chartType"
					class="v-global__chart-button"
					data-testid="chart-button"
					icon="@icons/graphLine"
					raised
					@click="toggleChart"
					aria-hidden="true"
				/>
				<c-icon-button
					v-else
					class="v-global__chart-button"
					data-testid="chart-button"
					icon="@icons/graphBar"
					raised
					@click="toggleChart"
					aria-hidden="true"
				/>
			</div>

			<c-translide v-if="defaultProfile && defaultProfile.name" slot="profile" immediate>
				<router-link
					class="v-global__profile-link text-m-book"
					:to="{ name: 'profiles-dashboard' }"
				>
					{{ $t('PROFILES.LINK', { name: defaultProfile.name }) }}
				</router-link>
			</c-translide>

			<c-translide slot="alert" appear>
				<router-link
					v-if="numberOfPendingOperations"
					:to="{ name: 'signatures' }"
					class="v-global__alert"
					data-testid="alert"
				>
					<c-alert warning actionable>
						{{ $tc('SIGNATURES.WARNING_TITLE', numberOfPendingOperations) }}
					</c-alert>
				</router-link>
			</c-translide>

			<c-translide slot="alert" appear>
				<router-link
					v-if="numberOfPendingBizums"
					:to="{ name: 'bizum-dashboard', params: { type: 'pending' } }"
					class="v-global__alert"
					data-testid="alert"
				>
					<c-alert warning actionable>
						{{ $tc('BIZUM.USER_HAS_PENDING_OPERATIONS', numberOfPendingBizums) }}
					</c-alert>
				</router-link>
			</c-translide>

			<h2 class="a11y-hide">{{ $t('GLOBAL_POSITION_TEXT_HELP') }}</h2>

			<w-product-list
				class="v-global__list"
				data-testid="product-list"
				:selected-family="familyId"
				@products="getGlobalBalance"
			>
				<div slot="banner" v-if="bannerSlides">
					<w-carousel
						class="v-global__banner"
						:slides="bannerSlides"
						enable-feedback
						:slide-template="slideTemplate"
						@skip-carousel="hideBanner"
						data-style-mini-indicators
					></w-carousel>
				</div>
			</w-product-list>

			<w-legacy-toolbar-for-bancofar v-if="!isBancofar || (isBancofar && !isPrd)" slot="footer" />
		</l-global>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import mq from '@utils/matchMedia';
import { onMobile } from '@theme';
import CIcon from '@components/c-icon';
import CIconButton from '@components/c-icon-button';
import CNotificationBell from '@components/c-notification-bell';
import CSirvaseIcon from '@components/c-sirvase-icon';
import CTranslide from '@components/c-translide';
import CParallaxHeader from '@components/c-parallax-header';
import CCurrencyLabel from '@components/c-currency-label';
import CBannerSlide from '@components/c-banner-slide';
import CAlert from '@components/c-alert';
import LGlobal from '@layouts/l-global';
import WProductList from '@widgets/w-product-list';
import WGlobalChart from '@widgets/w-global-chart';
import WCarousel from '@widgets/w-carousel';
import WLegacyToolbarForBancofar from '@widgets/w-legacy-toolbar-for-bancofar';
import MCommunications from '@modals/m-communications';
import MBalance from '@modals/m-balance';

import iconHome from '@icons/home';
import iconHomeFill from '@icons/homeFill';
import iconTransfer from '@icons/transfer';
import iconUser from '@icons/user';
import iconUserFill from '@icons/userFill';
import iconMore from '@icons/more';

import sumAmounts from '@modules/products/product-sum-amounts';
import { intervenersByTitle } from '@modules/products/product-interveners';
import { typesByTitle } from '@modules/products/product-types';
import { subtypesByTitle } from '@modules/products/product-subtypes';
import SessionCache from '@modules/session/session-cache';

import communicationsModule from '@modules/communications/m-communications';
import bizumModule from '@modules/bizum/m-bizum';
import signatureModule from '@modules/signatures/m-signatures';

const isPrd = window?.VUE_APP_CONFIG?.env === 'prd';

export default {
	name: 'v-global',

	modules: {
		communications: communicationsModule,
		bizum: bizumModule,
		signatures: signatureModule,
	},

	components: {
		CIcon,
		CIconButton,
		CNotificationBell,
		CTranslide,
		CParallaxHeader,
		CCurrencyLabel,
		CAlert,
		LGlobal,
		WProductList,
		WGlobalChart,
		WCarousel,
		WLegacyToolbarForBancofar,
		CSirvaseIcon,
	},

	props: {
		productId: { type: String },
		familyId: { type: String },
	},

	data() {
		return {
			iconHome,
			iconTransfer,
			iconUser,
			iconHomeFill,
			iconUserFill,
			iconMore,
			chartType: false,
			isUserGreeted: false,
			userGreetedHandle: 0,
			userGreetingHandle: 0,
			sheetLifted: false,
			resetSheet: false,
			slides: null,
			slideTemplate: CBannerSlide,
			numberOfPendingBizums: 0,
			balance: null,
			isPrd,
		};
	},

	computed: {
		onMobile: mq(onMobile),

		...mapState('app', ['companyId']),
		...mapState('authn', ['isMultiple']),
		...mapState('communications', { badge: 'unreadMessages' }),
		...mapState('session', ['userName', 'userGreeted']),
		...mapState('contracts', ['connectedContract']),
		...mapState('signatures', ['numberOfPendingOperations']),
		...mapState('profiles', ['defaultProfile']),

		isBancofar({ companyId }) {
			return companyId === 'BF';
		},

		isSheetDisabled({ defaultProfile }) {
			return Boolean(defaultProfile?.id);
		},

		bannerSlides({ slides }) {
			return (
				slides &&
				slides.map(
					({
						id,
						imageURL,
						title,
						body,
						feedback,
						ctaText,
						ctaAction,
						ctaRedirect,
						deeplinks,
					}) => ({
						id,
						imageURL,
						title,
						body,
						feedback,
						ctaText,
						ctaAction,
						link: ctaRedirect || deeplinks?.webLink,
					})
				)
			);
		},
	},

	methods: {
		readMessages() {
			this.$router.push({ name: 'communications', params: { type: 'alerts' } });
		},

		toggleChart() {
			if (!this.sheetLifted) {
				this.chartType = !this.chartType;
			} else {
				this.resetSheet = true;
			}
		},

		greetUser() {
			const initialDelay = 500;
			this.userGreetingHandle = setTimeout(this.showUserGreeting, initialDelay);
		},

		showUserGreeting() {
			const hideGreetingsAfter = 5000;
			this.$store.dispatch('session/markUserGreeted');
			this.isUserGreeted = true;
			this.userGreetedHandle = setTimeout(this.hideUserGreeting, hideGreetingsAfter);
		},

		hideUserGreeting() {
			this.isUserGreeted = false;
		},

		hideBanner() {
			this.slides = null;

			const cache = new SessionCache('messages');
			cache.set('communications/banner', null);
		},

		openBalanceModal() {
			return this.$store.dispatch('modal/open', MBalance);
		},

		getUnreadMessages() {
			return this.$store.dispatch('communications/getUnreadMessages');
		},

		getAnnouncements(type) {
			return this.$store.dispatch('communications/getAnnouncements', type);
		},

		async getPostloginAnnouncements() {
			const items = await this.getAnnouncements('postlogin');

			/* istanbul ignore else */
			if (items?.length) {
				await this.$store.dispatch('modal/open', {
					component: MCommunications,
					props: { slides: items },
				});
			}

			this.greetUser();
		},

		async getBannerAnnouncements() {
			const items = await this.getAnnouncements('banner');

			/* istanbul ignore else */
			if (items?.length) {
				this.slides = items;
			}
		},

		getPendingOperations() {
			return Promise.all([
				this.$store.dispatch('signatures/fetch', { status: 'pending', refresh: true }),
				this.$store
					.dispatch('bizum/requestActive')
					.then(() =>
						this.$store.dispatch('bizum/getMovements', { status: 'pending', refresh: true })
					)
					.then(({ data }) => {
						this.numberOfPendingBizums = data?.length;
					})
					.catch(() => {
						this.numberOfPendingBizums = 0;
					}),
			]);
		},

		async selectContract() {
			this.$store.dispatch('loading/start');

			const response = await this.$store.dispatch('contracts/get');
			const component = await import(
				/* webpackChunkName: "chunk-m-contracts" */ '@modals/m-contracts'
			);
			const contract = await this.$store.dispatch('modal/open', {
				component,
				props: {
					contracts: response,
					username: this.userName,
					connectedContract: this.connectedContract,
				},
			});

			/* istanbul ignore else */
			if (contract && contract?.id !== this.connectedContract?.id) {
				this.$router.replace({ name: 'home' }).catch(() => {});
				await this.$store.dispatch('contracts/set', contract);
			}

			this.$store.dispatch('loading/end');
		},

		getGlobalBalance(products) {
			if (products?.length) {
				this.balance = sumAmounts(
					products,
					'balance',
					({ productType, productSubtype, relationType }) => {
						const isLegalRepresentative =
							relationType.id === intervenersByTitle['legal-representative'];
						const isAttorney = relationType.id === intervenersByTitle.attorney;
						const isHolder = relationType.id === intervenersByTitle.holder;
						const isAccount = productType.id === typesByTitle.account;
						const isDeposit = productType.id === typesByTitle.deposit;
						const isPremiumAccount = productSubtype.id === subtypesByTitle['premium-account'];
						const isPremiumDeposit = productSubtype.id === subtypesByTitle['premium-deposit'];
						const isNotManaged = !productSubtype.id.startsWith('m-');
						const isElegible = isAccount || isDeposit || isPremiumAccount || isPremiumDeposit;
						return isElegible && (isHolder || isLegalRepresentative || isAttorney) && isNotManaged;
					}
				);
			}
		},
	},

	created() {
		this.getUnreadMessages();
		this.getBannerAnnouncements();
		this.getPendingOperations();

		/* istanbul ignore else */
		if (!this.userGreeted) {
			this.getPostloginAnnouncements();
		}
	},

	watch: {
		sheetLifted(value) {
			if (!value) {
				this.resetSheet = false;
			}
		},
	},

	beforeDestroy() {
		clearTimeout(this.userGreetingHandle);
		clearTimeout(this.userGreetedHandle);
	},
};
</script>

<style lang="scss" scoped>
.v-global {
	width: 100%;
	height: 100%;
	background-color: RGB(var(--color-surface-light));
	display: flex;
	position: relative;
}

.v-global__header {
	padding-bottom: 25px;
}

.v-global__header__icon {
	flex-shrink: 0;
	font-size: 22px;
	margin-top: 35px;
	color: RGB(var(--color-accent-icon));
}

.v-global__header__icon--bright {
	color: RGB(var(--color-text-secondary-light));
	filter: drop-shadow(0px 0px 1px currentColor);
	padding: 5px;
	visibility: hidden;
}

.v-global__header__balance {
	flex-shrink: 1;
	flex-grow: 1;
	align-self: center;
	margin-top: 10px;
}

.v-global__balance {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 10px;
	& .c-icon {
		margin-left: 10px;
	}
	& .c-icon {
		@media (hover) {
			cursor: pointer;
		}
	}
}

.v-global__contract {
	display: inline-flex;
	background: RGBA(var(--color-text-primary-light), 0.15);
	border-radius: $border-radius-m;
	align-items: center;
	margin-bottom: 5px;
	@media (hover) {
		cursor: pointer;
	}
}

.v-global__contract-title {
	padding-left: 20px;
	padding-right: 18px;
}

.v-global__contract-arrow {
	display: inline-flex;
	width: 22px;
	height: 24px;
	justify-content: center;
	align-items: center;
	transform: rotate(180deg);
	font-size: 6px;
	background: RGBA(var(--color-text-primary-light), 0.15);
	border-bottom-left-radius: $border-radius-m;
	border-top-left-radius: $border-radius-m;
}

.v-global__chart {
	width: 100%;
	height: 200px;
	margin-bottom: 10px;
}

.v-global__chart-buttons {
	position: relative;
	top: -48px;
	z-index: 1;
	max-width: 800px;
	margin: 0 auto;
}

.v-global__chart-button {
	position: absolute;
	top: 0;
	right: 30px;
	color: RGB(var(--color-accent-secondary));
}

.v-global__alert,
.v-global__profile-link {
	display: block;
	width: 100%;
	max-width: 800px;
	margin: 0 auto 20px;
	text-decoration: none;
	border-radius: $border-radius-s;
	@media (hover) {
		cursor: pointer;
	}
}

.v-global__profile-link {
	color: RGB(var(--color-text-primary));
	max-width: 200px;
	padding: 10px 12px;
	text-align: center;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.v-global__profile-link::after {
	content: '';
	position: absolute;
	top: calc(50% - 3px);
	right: 2px;
	border-right: 1px solid RGB(var(--color-text-primary));
	border-bottom: 1px solid RGB(var(--color-text-primary));
	transform: rotate(-45deg);
	width: 6px;
	height: 6px;
}

.v-global__banner {
	--w-carousel--width: 100%;
	padding: 0;
	padding-top: 10px;
}

.v-global__list {
	margin: 0 auto;
	width: 100%;
	max-width: 800px;
	padding-bottom: 90px;
}

.v-global__welcome-text {
	position: absolute;
	top: 10px;
}

.v-global__we_will_help_you {
	visibility: hidden;
	display: none;
	position: absolute;
	top: 44px;
	left: 50px;
	color: RGB(var(--color-secondary-light));
}

.slide-in-top-enter-active {
	transition: opacity 300ms, transform 300ms ease;
}

.slide-in-top-leave-active {
	transition: opacity 600ms;
}

.slide-in-top-enter,
.slide-in-top-leave-to {
	opacity: 0;
}

.slide-in-top-enter {
	transform: translateY(-4px);
}

@media ($on-tablet) {
	.v-global__we_will_help_you {
		display: block;
	}
}

@media ($on-big-screens) {
	.v-global__chart {
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
	}
}
</style>
