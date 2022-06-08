<template>
	<l-page>
		<h1 id="v-pending-operations__title" data-testid="header" tabindex="-1" slot="header">
			{{ $t('SIGNATURES.TITLE') }}
		</h1>

		<c-translide slot="main-fixed-header">
			<div class="v-pending-operations__main-header">
				<div data-testid="tabs" class="v-pending-operations__main-nav">
					<c-tabs-nav
						v-if="Object.keys(tabs).length"
						class="v-pending-operations__main-header-nav"
						:tabs="tabs"
						data-expanded
						data-testid="tabs-nav"
						@select="selectedTab = $event"
					/>
				</div>
			</div>
		</c-translide>

		<div ref="content" data-testid="content" class="v-pending-operations__main">
			<div
				class="v-pending-operations__list"
				role="list"
				aria-labelledby="v-pending-operations__title"
			>
				<w-signature-list :status="status" />
			</div>
		</div>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import CTranslide from '@components/c-translide';
import CTabsNav from '@components/c-tabs-nav';
import WSignatureList from '@widgets/w-signature-list';

export default {
	name: 'v-signatures',

	components: {
		LPage,
		CTranslide,
		CTabsNav,
		WSignatureList,
	},

	data() {
		return {
			selectedTab: 0,
		};
	},

	beforeRouteEnter(to, from, next) {
		next((vm) => vm.tabsHandler(from));
	},

	computed: {
		tabs({ selectedTab }) {
			const activeTab = selectedTab === 1 ? 'signed' : 'pending';
			const model = {
				pending: {
					hash: 'pending',
					enable: true,
					active: false,
					header: this.$t('SIGNATURES.PENDING'),
				},
				signed: {
					hash: 'signed',
					enable: true,
					active: false,
					header: this.$t('SIGNATURES.SIGNED'),
				},
			};

			model[activeTab].active = true;

			return model;
		},
	},

	methods: {
		tabsHandler({ params }) {
			const { type } = params;
			this.selectedTab = type === 'signed' ? 1 : 0;
		},
	},

	watch: {
		selectedTab: {
			handler(tab) {
				this.status = tab === 1 ? 'signed' : 'pending';
			},
			immediate: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.v-pending-operations__main-nav {
	padding: 20px 0px;
}

.v-pending-operations__main-header,
.v-pending-operations__main {
	display: flex;
	width: 100%;
	max-width: 800px;
	margin: 0 auto;
	flex-direction: column;
}

.v-pending-operations__main-header {
	color: RGB(var(--color-text-primary));
	&:not(:empty) {
		padding: 20px 20px 0px;
	}
}

.v-signatures {
	position: relative;
	background: RGB(var(--color-primary));
	display: flex;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
}

.v-pending-operations__list {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	padding-bottom: 70px;
}

.v-pending-operations__message {
	text-align: center;
	margin: 10px 0;
}

.v-pending-operations__message p {
	padding-top: 10px;
}

.v-pending-operations__message-icon {
	font-size: 30px;
}

.v-pending-operations__message-link-text {
	display: block;
	text-decoration: underline;
	padding-top: 10px;
}
</style>
