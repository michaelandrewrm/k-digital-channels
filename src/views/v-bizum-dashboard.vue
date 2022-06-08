<template>
	<l-details>
		<h1 slot="header" tabindex="-1">{{ $t('BIZUM.TITLE') }}</h1>

		<button data-testid="help" class="v-bizum-dashboard__help-icon" slot="help" @click="openHelp">
			<c-icon src="@icons/info" />
		</button>

		<c-acrylic-sheet
			data-testid="sheet"
			class="v-bizum-dashboard__header"
			slot="widget"
			actionable
			@expand="gotoDetails"
		>
			<img src="@assets/img/bizumLogo.svg" alt="" width="110" height="33" />
		</c-acrylic-sheet>

		<c-translide slot="main-header">
			<div class="v-bizum-dashboard__search-header">
				<c-tabs-nav
					data-testid="tabs-nav"
					data-expanded
					v-if="Object.keys(tabs).length"
					class="v-bizum-dashboard__search-header__nav"
					:tabs="tabs"
					@select="changeTab(Object.keys(tabs)[$event])"
				/>
			</div>
		</c-translide>

		<c-translide>
			<div class="v-bizum-dashboard__tabs">
				<c-tabs :external-nav="true">
					<c-tab v-if="tabs.completed.active" data-testid="tab-completed">
						<w-bizum-movements data-testid="list-completed" key="completed" status="completed" />
					</c-tab>
					<c-tab v-if="tabs.pending.active" data-testid="tab-pending">
						<w-bizum-movements
							data-testid="list-pending"
							key="pending"
							status="pending"
							@fetch="onPendingItemsFetch"
						/>
					</c-tab>
				</c-tabs>
			</div>
		</c-translide>

		<w-actions v-if="actionOptions" :options="actionOptions" slot="buttons" />
	</l-details>
</template>

<script>
import LDetails from '@layouts/l-details';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CTranslide from '@components/c-translide';
import CTabs from '@components/c-tabs';
import CTab from '@components/c-tab';
import CTabsNav from '@components/c-tabs-nav';
import WBizumMovements from '@widgets/w-bizum-movements';
import WActions from '@widgets/w-actions';
import iconSendMoney from '@icons/sendMoney';
import iconRequestMoney from '@icons/requestMoney';
import iconDonateMoney from '@icons/donateMoney';
import iconBizumSelae from '@icons/bizumSelae';
import CIcon from '@components/c-icon';

export default {
	name: 'v-bizum-dashboard',

	components: {
		LDetails,
		CAcrylicSheet,
		CTranslide,
		CTabs,
		CTab,
		CTabsNav,
		WBizumMovements,
		WActions,
		CIcon,
	},

	props: {
		type: { type: String, default: 'completed' },
	},

	data() {
		return {
			hasPendingItems: false,
		};
	},

	computed: {
		tabs({ type, hasPendingItems }) {
			const model = {
				completed: {
					hash: 'completed',
					active: false,
					header: this.$t('BIZUM.COMPLETED'),
				},
				pending: {
					hash: 'pending',
					active: false,
					header: hasPendingItems
						? this.$t('BIZUM.PENDING').concat(' •')
						: this.$t('BIZUM.PENDING'),
				},
			};

			return Object.fromEntries(
				Object.entries(model).map(([key, tab]) => {
					if (key === type) {
						Object.assign(tab, { active: true });
					}
					return [key, tab];
				})
			);
		},

		actionOptions() {
			return [
				{
					id: 'send-money',
					title: this.$t('BIZUM.ACTION.TRANSFER'),
					icon: iconSendMoney,
					action: () => this.$router.push({ name: 'bizum-transfer', params: { action: 'send' } }),
				},
				{
					id: 'request-money',
					title: this.$t('BIZUM.ACTION.REQUEST'),
					icon: iconRequestMoney,
					action: () =>
						this.$router.push({ name: 'bizum-transfer', params: { action: 'request' } }),
				},
				{
					id: 'donate-money',
					title: this.$t('BIZUM.ACTION.DONATE'),
					icon: iconDonateMoney,
					action: () => this.$router.push({ name: 'bizum-transfer', params: { action: 'donate' } }),
				},
				{
					id: 'lotteries',
					title: this.$t('BIZUM.SELAE.ACCESS'),
					icon: iconBizumSelae,
					action: () => {
						this.$router.replace({
							name: 'bizum-selae',
						});
					},
				},
			];
		},
	},

	methods: {
		changeTab(type) {
			this.$router.replace({ name: 'bizum-dashboard', params: { type } });
		},

		gotoDetails() {
			this.$router.push({ name: 'bizum-details' });
		},

		openHelp() {
			return this.$router.push({ name: 'bizum-help' });
		},

		onPendingItemsFetch(items) {
			this.hasPendingItems = Boolean(items?.length);
		},
	},
};
</script>

<style lang="scss" scoped>
.v-bizum-dashboard__header {
	width: 300px;
}

.v-bizum-dashboard__tabs {
	margin-top: 15px;
}

.v-bizum-dashboard__search-header {
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: RGB(var(--color-text-primary));
	position: relative;
	padding: 0 20px;
}

.v-bizum-dashboard__search-header__nav {
	flex-grow: 1;
}

.v-bizum-dashboard__search-header__nav:not(:first-child) {
	margin-top: 40px;
}

.v-bizum-dashboard__help-icon {
	appearance: none;
	margin: 5px;
	padding: 10px;
	border: 0;
	background: transparent;
	color: RGB(var(--color-accent-icon));
	font-size: 16px;
	position: relative;
	line-height: 1;
	border-radius: $border-radius-s;
}
</style>
