<template>
	<l-details>
		<h1 slot="header" tabindex="-1">{{ $t('CORREOS_CASH.TITLE') }}</h1>

		<c-acrylic-sheet
			data-testid="sheet"
			class="v-correos-cash-dashboard__header-card"
			slot="widget"
		>
			<div class="v-correos-cash-dashboard__title">
				<c-icon src="@icons/correos" size="xl" />
				<h1 class="text-l-bold">{{ $t('CORREOS_CASH.TITLE') }}</h1>
			</div>
		</c-acrylic-sheet>

		<c-translide slot="main-header">
			<div class="v-correos-cash-dashboard__tabs-nav">
				<c-tabs-nav
					data-testid="tabs-nav"
					data-expanded
					v-if="Object.keys(tabs).length"
					:tabs="tabs"
				/>
			</div>
		</c-translide>

		<c-translide>
			<div class="v-correos-cash-dashboard__tabs">
				<c-tabs :external-nav="true">
					<c-tab data-testid="tab-completed">
						<w-correos-cash-deposits data-testid="correos-cash-deposits" key="requested" />
					</c-tab>
				</c-tabs>
			</div>
		</c-translide>

		<w-actions :options="actionOptions" slot="buttons" />
	</l-details>
</template>

<script>
import LDetails from '@layouts/l-details';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CTranslide from '@components/c-translide';
import CIcon from '@components/c-icon';
import CTabs from '@components/c-tabs';
import CTab from '@components/c-tab';
import CTabsNav from '@components/c-tabs-nav';
import WCorreosCashDeposits from '@widgets/w-correos-cash-deposits';
import WActions from '@widgets/w-actions';

export default {
	name: 'v-correos-cash-dashboard',

	components: {
		LDetails,
		CAcrylicSheet,
		CTranslide,
		CIcon,
		CTabs,
		CTab,
		CTabsNav,
		WCorreosCashDeposits,
		WActions,
	},

	props: {
		type: { type: String, default: 'requested' },
	},

	computed: {
		tabs({ type }) {
			const model = {
				requested: {
					hash: 'requested',
					active: false,
					header: this.$t('CORREOS_CASH.REQUESTED'),
				},
			};

			return Object.fromEntries(
				Object.entries(model).map(([key, tab]) => {
					/* istanbul ignore else */
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
					id: 'correos-cash-deposit',
					title: this.$t('CORREOS_CASH.ACTION.NEW'),
					action: () => this.$router.push({ name: 'correos-cash-deposit' }),
				},
			];
		},
	},
};
</script>

<style lang="scss" scoped>
.v-correos-cash-dashboard__header-card {
	width: 300px;
}

.v-correos-cash-dashboard__title {
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	padding: 20px 0;
}

.v-correos-cash-dashboard__title .c-icon {
	margin-right: 10px;
	font-size: 30px;
}

.v-correos-cash-dashboard__tabs-nav {
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: RGB(var(--color-text-primary));
	position: relative;
	padding: 0 20px;
}

.v-correos-cash-dashboard__tabs-nav /deep/ .c-tabs-nav__tabs .c-tabs-nav__tab-a {
	justify-content: flex-start;
}
</style>
