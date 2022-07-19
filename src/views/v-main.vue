<template>
	<l-main class="v-main">
		<router-view name="primary" slot="primary" :key="contractId" />
		<router-view
			name="secondary"
			slot="secondary"
			:key="familyId"
			:class="{ [`v-main__family--${familyId}`]: true }"
			:style="generatePremiumImage"
		/>

		<w-menu
			v-if="openMenu"
			data-testid="menu"
			slot="menu"
			:title="userName"
			:connectedContract="isMultiple ? connectedContract : null"
			:items="menuItems"
			@item-selected="goto"
			@close-menu="openMenu = false"
		/>

		<c-toolbar
			data-testid="toolbar"
			slot="navbar"
			:horizontal="!isDesktop"
			:items="toolbarItems"
			:selected="toolbarActiveItem"
			@item-selected="goto"
			@toggle-menu="openMenu = !openMenu"
		/>
	</l-main>
</template>

<script>
import { mapState } from 'vuex';
import LMain from '@layouts/l-main';
import CToolbar from '@components/c-toolbar';
import WMenu from '@widgets/w-menu';
import iconHome from '@icons/home';
import iconHomeFill from '@icons/homeFill';
import iconTransfer from '@icons/transfer';
import iconCorreos from '@icons/correos';
import iconUser from '@icons/user';
import iconUserFill from '@icons/userFill';
import iconCustomerService from '@icons/customerService';
import iconMore from '@icons/more';
import iconStar from '@icons/star';
import iconStarFill from '@icons/starFill';
import iconPaper from '@icons/paper';
import iconProfiles from '@icons/interveners';
import iconOntime from '@icons/ontime';
import iconSearch from '@icons/search';
import mq from '@utils/matchMedia';
import { onDesktop } from '@theme';
import SessionCache from '@modules/session/session-cache';
import premiumHeader from '@assets/img/premium-header.jpg';

export default {
	name: 'v-main',

	components: {
		LMain,
		CToolbar,
		WMenu,
	},

	props: {
		familyId: { type: String },
	},

	data() {
		return {
			iconHome,
			iconHomeFill,
			iconTransfer,
			iconCorreos,
			iconUser,
			iconUserFill,
			iconCustomerService,
			iconMore,
			iconStar,
			iconStarFill,
			iconProfiles,
			iconOntime,
			iconSearch,
			openMenu: null,
			contractId: null,
		};
	},

	computed: {
		isDesktop: mq(onDesktop),

		...mapState('app', ['companyId']),
		...mapState('authn', ['isEmbedded', 'isMultiple']),
		...mapState('session', ['userName']),
		...mapState('contracts', ['connectedContract']),
		...mapState('profiles', ['defaultProfile', 'lastRequestTimestamp']),

		toolbarActiveItem({ $route }) {
			const matched = $route.matched[$route.matched.length - 1];

			/* istanbul ignore next */
			if (matched?.components?.secondary) {
				return matched.components.primary.name.slice(2);
			}

			if (matched?.name === 'global') {
				return 'home';
			}

			/* istanbul ignore next */
			if (matched?.name?.startsWith('bizum')) {
				return 'transfers';
			}

			return matched?.name;
		},

		generatePremiumImage({ familyId }) {
			/* istanbul ignore next */
			if (familyId === 'subscription') {
				return `--color-gradient-header: url("${premiumHeader}");`;
			}

			return '';
		},

		toolbarItems({ isEmbedded, companyId }) {
			/* istanbul ignore next */
			if (companyId === 'BF') {
				return [
					{
						id: 'sso-rsi',
						icon: iconHome,
						iconActive: iconHomeFill,
						title: this.$t('MENU.HOME'),
					},
					{
						id: 'transfers',
						icon: iconCorreos,
						title: this.$t('CORREOS_CASH.TITLE'),
					},
					{
						id: 'helper',
						icon: iconCustomerService,
						title: this.$t('MENU.CUSTOMER_SERVICE'),
						disabled: isEmbedded,
					},
					{
						id: 'personal-area',
						icon: iconUser,
						iconActive: iconUserFill,
						title: this.$t('MENU.PERSONAL_AREA'),
					},
					{
						id: 'feedback',
						icon: iconStar,
						iconActive: iconStarFill,
						title: this.$t('FEEDBACK.TITLE'),
						disabled: isEmbedded,
					},
					{
						id: 'profiles',
						icon: iconProfiles,
						iconActive: iconProfiles,
						title: this.$t('MENU.PROFILES_MANAGEMENT'),
					},
					{
						id: 'ontime',
						icon: iconOntime,
						iconActive: iconOntime,
						title: this.$t('MENU.ONTIME'),
					},
				];
			}

			return [
				{
					id: 'home',
					icon: iconHome,
					iconActive: iconHomeFill,
					title: this.$t('MENU.GLOBAL_POSITION'),
				},
				{
					id: 'transfers',
					icon: iconTransfer,
					title: this.$t('MENU.TRANSFERS'),
				},
				{
					id: 'helper',
					icon: iconCustomerService,
					title: this.$t('MENU.CUSTOMER_SERVICE'),
					disabled: isEmbedded,
				},
				{
					id: 'personal-area',
					icon: iconUser,
					iconActive: iconUserFill,
					title: this.$t('MENU.PERSONAL_AREA'),
				},
				{
					id: 'feedback',
					icon: iconStar,
					iconActive: iconStarFill,
					title: this.$t('FEEDBACK.TITLE'),
					disabled: isEmbedded,
				},
				{
					id: 'signatures',
					icon: iconPaper,
					iconActive: iconPaper,
					title: this.$t('MENU.SIGNATURES'),
				},
				{
					id: 'profiles',
					icon: iconProfiles,
					iconActive: iconProfiles,
					title: this.$t('MENU.PROFILES_MANAGEMENT'),
				},
				{
					id: 'ontime',
					icon: iconOntime,
					iconActive: iconOntime,
					title: this.$t('MENU.ONTIME'),
				},
				{
					id: 'help',
					icon: iconSearch,
					iconActive: iconSearch,
					title: this.$t('MENU.HELP'),
					disabled: isEmbedded,
				},
			];
		},

		menuItems({ toolbarItems }) {
			const menuItems = toolbarItems.slice(1);
			return menuItems;
		},
	},

	watch: {
		'lastRequestTimestamp': {
			immediate: true,
			handler(next, prev) {
				/* istanbul ignore next */
				if (next && prev !== next) {
					SessionCache.clear();
					this.contractId = `${this.contractId}/${next}`;
				}
			},
		},

		'defaultProfile.id': {
			immediate: true,
			handler(next, prev) {
				/* istanbul ignore next */
				if (prev !== next) {
					this.contractId = `${this.contractId}/${next}`;
				}
			},
		},

		'connectedContract': {
			immediate: true,
			handler(next, prev) {
				/* istanbul ignore next */
				if (next && prev && prev?.id !== next?.id) {
					SessionCache.clear();
					this.contractId = next.id;
				}
			},
		},
	},

	methods: {
		goto(event) {
			if (this.$router.currentRoute.name !== event) {
				return this.$router.push({ name: event }).finally(() => {
					this.openMenu = false;
				});
			}
		},
	},

	created() {
		this.$store.dispatch('liveagent/install');
	},

	mounted() {
		this.$nextTick(() => {
			this.$store.dispatch('loading/end');
		});
	},
};
</script>

<style lang="scss" scoped>
@function toRGB($color) {
	@return red($color) + ', ' + green($color) + ', ' + blue($color);
}

.v-main {
	--safe-area-bottom: 55px;
}

@media screen {
	.v-main__family--subscription {
		--color-surface: #{toRGB(#3d3d3d)};
		--color-surface-dark: #{toRGB(#1d1d1d)};
		--color-surface-light: #{toRGB(#2c2c2c)};

		--color-text-primary: #{toRGB(#ffffff)};
		--color-text-primary-light: #{toRGB(#ffffff)};
		--color-text-secondary: #{toRGB(#ffffff)};

		--color-primary-light: #{toRGB(#ffffff)};
		--color-primary-dark: var(--color-themed-surface);
		--color-accent-primary: #{toRGB(#393a3b)};

		--color-dark-surface: #{toRGB(#eeeef3)};
		--color-dark-text-primary: #{toRGB(#001825)};
		--color-dark-text-secondary: #{toRGB(#001825)};

		--color-themed-surface: #{toRGB(#101010)};
		--color-themed-surface-dark: #{toRGB(#000000)};
		--color-themed-surface-light: #{toRGB(#222222)};

		--color-gradient-chart-line-stop-1: var(--color-secondary-light);
		--color-gradient-chart-line-stop-2: var(--color-secondary);

		--color-gradient-card-item: linear-gradient(to right, #1d1d1d, #1a1a1a);

		--c-acrylic-bg: linear-gradient(
			to right,
			RGB(var(--color-gradient-chart-line-stop-2)),
			RGB(var(--color-gradient-chart-line-stop-1))
		);
		--c-acrylic-dotted-color: RGB(var(--color-gradient-chart-line-stop-1));
		--c-acrylic-color: black;

		--button-color-raised-text: var(--color-dark-text-primary);
	}
}

@media ($on-desktop) {
	.v-main {
		--safe-area-bottom: 0;
	}
}
</style>
