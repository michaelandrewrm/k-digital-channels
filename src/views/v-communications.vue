<template>
	<l-page>
		<h1 slot="header" tabindex="-1">{{ $t('COMMUNICATIONS.TITLE') }}</h1>

		<c-translide slot="main-fixed-header">
			<div class="v-communications__search-header">
				<c-tabs-nav
					data-testid="tabs-nav"
					data-expanded
					v-if="Object.keys(tabs).length"
					class="v-communications__search-header__nav"
					:tabs="tabs"
					@select="changeTab(Object.keys(tabs)[$event])"
				/>
			</div>
		</c-translide>
		<c-translide>
			<div class="v-communications__tabs">
				<c-tabs :external-nav="true">
					<c-tab v-if="tabs.alerts.active">
						<w-message-list data-testid="list-alert" key="alerts" type="alerts" />
					</c-tab>
					<c-tab v-if="tabs.statements.active">
						<w-message-list data-testid="list-statement" key="statements" type="statements" />
					</c-tab>
					<c-tab v-if="tabs.documents.active">
						<w-message-list data-testid="list-document" key="documents" type="documents" />
					</c-tab>
				</c-tabs>
			</div>
		</c-translide>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import CTranslide from '@components/c-translide';
import CTabs from '@components/c-tabs';
import CTab from '@components/c-tab';
import CTabsNav from '@components/c-tabs-nav';
import WMessageList from '@widgets/w-message-list';

export default {
	name: 'v-communications',

	components: {
		LPage,
		CTranslide,
		CTabs,
		CTab,
		CTabsNav,
		WMessageList,
	},

	props: {
		type: { type: String, default: 'alerts' },
	},

	computed: {
		tabs({ type }) {
			const model = {
				alerts: {
					hash: 'alerts',
					active: false,
					header: this.$t('COMMUNICATIONS.ALERTS'),
				},
				statements: {
					hash: 'statements',
					active: false,
					header: this.$t('COMMUNICATIONS.FOR_YOU'),
				},
				documents: {
					hash: 'documents',
					active: false,
					header: this.$t('COMMUNICATIONS.DOCUMENTS'),
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
	},

	methods: {
		changeTab(type) {
			this.$router.replace({ name: 'communications', params: { type } });
		},
	},
};
</script>

<style lang="scss" scoped>
.v-communications__tabs {
	margin-top: 15px;
}

.v-communications__search-header {
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: RGB(var(--color-text-primary));
	position: relative;
	padding: 0 20px;
}

.v-communications__search-header__nav {
	flex-grow: 1;
}

.v-communications__search-header__nav:not(:first-child) {
	margin-top: 40px;
}
</style>
