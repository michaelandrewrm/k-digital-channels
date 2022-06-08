<template>
	<div class="v-dashboard">
		<div class="v-dashboard__nav-bar">
			<div class="v-dashboard__header text-m-medium">
				<span class="v-dashboard__header-icon">
					<c-icon src="@icons/users" />
				</span>
				<h1 class="v-dashboard__header-title">{{ $t('LOGIN.TITLE') }}</h1>
			</div>

			<div class="v-dashboard__current-company">
				<button
					class="v-dashboard__company-button"
					@click="selectCompany"
					data-testid="company-button"
				>
					<span class="v-dashboard__company-title">
						{{ $t(`DASHBOARD.${currentCompany}`) }}
					</span>
					<span class="v-dashboard__company-arrow">
						<c-icon src="@icons/back" />
					</span>
				</button>
			</div>

			<div class="v-dashboard__action-buttons">
				<button
					v-if="!isMobile"
					class="v-dashboard__logout text-m-medium"
					data-testid="logout-button"
					@click="logout"
				>
					{{ $t('DASHBOARD.CLOSE_SESSION') }}
				</button>
				<div
					class="v-dashboard__menu-toggle"
					:class="{ '--show-menu-toggle': isMobile }"
					@click="isDrawerClosed = !isDrawerClosed"
				>
					<c-icon src="@icons/bars" />
				</div>
			</div>
		</div>

		<aside
			class="v-dashboard__drawer"
			:class="{ '--is-drawer-closed': isDrawerClosed && isMobile, '--is-dismissible': isMobile }"
		>
			<div
				v-if="isMobile"
				class="v-dashboard__drawer-overlay"
				@click="isDrawerClosed = !isDrawerClosed"
			/>
			<div class="v-dashboard__drawer-content">
				<div class="v-dashboard__drawer-container">
					<div class="v-dashboard__drawer-section --border-bottom">
						<div class="v-dashboard__list">
							<button
								class="v-dashboard__list-item text-m-book"
								@click="initSearch"
								data-testid="search-bar"
							>
								<span class="v-dashboard__list-item-title">
									{{ $t('DASHBOARD.INIT_SEARCH') }}
								</span>
								<span class="v-dashboard__list-item-icon">
									<c-icon src="@icons/search" />
								</span>
							</button>
						</div>
					</div>

					<div class="v-dashboard__drawer-section">
						<h2 class="v-dashboard__list-title text-m-medium">
							{{ $t('DASHBOARD.ACTIVE_SESSIONS') }}
						</h2>
						<div class="v-dashboard__list">
							<button
								v-for="session in sessions"
								:key="session.id"
								class="v-dashboard__list-item --session-item"
								:class="{ '--active-item': session.id === activeUserId }"
								data-testid="tab-session"
								@click.stop="selectSession(session)"
							>
								<span v-if="session.isLoading" class="v-dashboard__list-item-title">
									{{ $t('DASHBOARD.LOADING') }}
								</span>
								<span v-else class="v-dashboard__list-item-title text-m-book">
									{{ session.name }} {{ session.surname1 }}
								</span>
								<span
									class="v-dashboard__list-item-icon --more-btn"
									@click.stop="toggleSessionOption(session.id, session.isOptionOpen)"
									data-testid="more-btn"
								>
									{{ String('···') }}
								</span>
								<ul
									v-if="session.isOptionOpen"
									class="v-dashboard__options"
									data-testid="user-options"
								>
									<li
										v-if="!session.isLoading && !isBancofar"
										data-testid="caminos-online"
										class="v-dashboard__options-item text-m-book"
										@click.stop="
											sirvaseRequest = false;
											closeSessionOption(session.id);
										"
									>
										{{ $t('ASSISTED-SIRVASE-BANCO_CAMINOS') }}
									</li>
									<li
										v-if="!session.isLoading && !isBancofar"
										data-testid="sirvase-efectuar"
										class="v-dashboard__options-item text-m-book"
										@click.stop="
											sirvaseRequest = !sirvaseRequest;
											closeSessionOption(session.id);
										"
									>
										{{ $t('ASSISTED-SIRVASE-EFECTUAR') }}
									</li>
									<li
										v-if="!session.isLoading"
										data-testid="unlock-user"
										class="v-dashboard__options-item text-m-book"
										@click.stop="requestUserOption(session.id, 'unlock')"
									>
										{{ $t('DASHBOARD.OPTIONS.UNLOCK_USER') }}
									</li>
									<li
										v-if="!session.isLoading"
										data-testid="reset-password"
										class="v-dashboard__options-item text-m-book"
										@click.stop="requestUserOption(session.id, 'resetPassword')"
									>
										{{ $t('DASHBOARD.OPTIONS.RESET_PASSWORD') }}
									</li>
									<li
										v-if="!session.isLoading"
										data-testid="generate-otp"
										class="v-dashboard__options-item text-m-book"
										@click.stop="requestUserOption(session.id, 'generateOtp')"
									>
										{{ $t('DASHBOARD.OPTIONS.GENERATE_OTP') }}
									</li>
									<li
										v-if="!session.isLoading"
										data-testid="change-otp"
										class="v-dashboard__options-item text-m-book"
										@click.stop="requestUserOption(session.id, 'changeNotificationMode')"
									>
										<span v-if="session.isNotificationByEmail">
											{{ $t('DASHBOARD.CHANGE_NOTIFICATION_TO_SMS') }}
										</span>
										<span v-else>
											{{ $t('DASHBOARD.CHANGE_NOTIFICATION_TO_EMAIL') }}
										</span>
									</li>
									<li
										data-testid="close-session"
										class="v-dashboard__options-item text-m-book"
										@click.stop="closeSession(session.id)"
									>
										{{ $t('DASHBOARD.OPTIONS.CLOSE_SESSION') }}
									</li>
								</ul>
							</button>

							<p v-if="!numberOfSessions" class="v-dashboard__session-help text-m-book">
								{{ $t('DASHBOARD.NO_SESSIONS') }}
							</p>
						</div>
					</div>
				</div>

				<div v-if="isMobile" class="v-dashboard__bottom-info">
					<button
						class="v-dashboard__bottom-info-logout"
						@click="logout"
						data-testid="logout-button"
					>
						<h1 class="text-m-medium">{{ $t('DASHBOARD.CLOSE_SESSION') }}</h1>
					</button>
				</div>
			</div>
		</aside>

		<main class="v-dashboard__content">
			<section class="v-dashboard__sessions" v-for="session in sessions" :key="session.id">
				<v-sso-skyline
					v-show="!sirvaseRequest"
					:session="session"
					:active="session.id === activeUserId && session.isVisible"
					@update-session="updateSession"
					@close-session="closeSession"
					:sirvase="sirvaseRequest"
				/>
				<v-assisted-sirvase
					v-if="sirvaseRequest && !isBancofar"
					:session="session"
					@sirvase="getRequestList(session.id, $event)"
					@detail="getRequestDetail(session.id, $event)"
					@clear="clearSirvase(session.id)"
				/>
			</section>
			<section class="v-dashboard__sessions">
				<div class="v-dashboard__default-section">
					<div class="v-dashboard__aqua-logo">
						<span class="v-dashboard__aqua-icon">
							<c-icon src="@icons/users" />
						</span>
						<h1 class="v-dashboard__aqua-title text-xl-medium">{{ $t('LOGIN.TITLE') }}</h1>
					</div>
				</div>
			</section>
		</main>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import mq from '@utils/matchMedia';
import { onMobile } from '@theme';
import CIcon from '@components/c-icon';
import MSearch from '@modals/m-search';
import MSelectCompany from '@modals/m-select-company.vue';
import VSsoSkyline from '@views/v-sso-skyline';
import VAssistedSirvase from '@views/v-assisted-sirvase';

export default {
	name: 'v-dashboard',

	components: { CIcon, VSsoSkyline, VAssistedSirvase },

	data() {
		return {
			isDrawerClosed: false,
			companies: ['BC', 'BF'],
			sessions: {},
			activeUser: {},
			activeUserId: null,
			timer: null,
			sirvaseRequest: false,
		};
	},

	computed: {
		isMobile: mq(onMobile),

		...mapState('agent', ['currentCompany']),

		isBancofar() {
			return this.currentCompany === 'BF';
		},

		numberOfSessions({ sessions }) {
			return Object.keys(sessions).length;
		},

		loadingSession({ sessions }) {
			return Object.entries(sessions).find(([, { isLoading }]) => isLoading);
		},
	},

	watch: {
		activeUser: {
			deep: true,
			immediate: true,
			handler(session) {
				/* istanbul ignore else */
				if (!session?.companyId || session?.url) {
					return;
				}
				const company = { BC: 'caminos', BF: 'bancofar' }[session.companyId];
				const env = process.env?.VUE_APP_ENDPOINT_MODE || window.VUE_APP_CONFIG?.env;
				const prodURL = {
					caminos: 'https://clientes-bancocaminos.grupocaminos.es',
					bancofar: 'https://www.bancofaronline.es',
				}[company];
				const defaultURL = `https://${company}-${env}.grupocaminos.net`;
				const url = { prd: prodURL, mck: 'http://localhost:8081' }[env] || defaultURL;
				this.updateSession(session.id, { url });
			},
		},
	},

	methods: {
		async selectCompany() {
			if (this.loadingSession) {
				return this.openNotification(this.$t('DASHBOARD.LOADING_SESSION'));
			}

			const companyId = await this.$store.dispatch('modal/open', MSelectCompany);

			/* istanbul ignore next */
			if (!companyId) {
				return;
			}

			this.sirvaseRequest = false;

			this.$store
				.dispatch('agent/setCompany', companyId)
				.then(() => this.openNotification(this.$t('DASHBOARD.CHANGE_COMPANY.SUCCESS')))
				.catch(() => this.openNotification(this.$t('DASHBOARD.CHANGE_COMPANY.ERROR')));
		},

		async initSearch() {
			const { currentCompany, sessions, loadingSession } = this;

			if (loadingSession) {
				return this.openNotification(this.$t('DASHBOARD.LOADING_SESSION'));
			}

			const userData = await this.$store.dispatch('modal/open', {
				component: MSearch,
				props: { currentCompany },
			});

			if (userData) {
				const { id } = userData;

				/* istanbul ignore else */
				if (!sessions[id]) {
					return this.createSession(userData);
				}

				this.activeUserId = id;
			}
		},

		async createSession(userData) {
			const model = {
				url: null,
				isVisible: false,
				isOptionOpen: false,
				isLoading: true,
				isNotificationByEmail: false,
				sirvase: {
					response: null,
					request: null,
				},
			};
			const session = { ...model, ...userData };
			this.sessions = { ...this.sessions, [userData.id]: session };
			this.selectSession(session);
		},

		getRequestList(sessionId, property) {
			const { sessions } = this;

			/* istanbul ignore next */
			if (!sessions[sessionId] || !property) {
				return;
			}
			this.sessions[sessionId].sirvase.request = { ...property };
			this.updateSession(sessionId, { action: 'sirvaseRequest' });
		},

		getRequestDetail(sessionId, property) {
			const { sessions } = this;

			/* istanbul ignore next */
			if (!sessions[sessionId] || !property) {
				return;
			}
			this.sessions[sessionId].sirvase.request = { ...property };
			this.updateSession(sessionId, { action: 'sirvaseRequest' });
		},

		clearSirvase(sessionId) {
			const { sessions } = this;

			/* istanbul ignore next */
			if (!sessions[sessionId]) {
				return;
			}

			this.sessions[sessionId].sirvase.response = null;
			this.sessions[sessionId].sirvase.request = null;
		},

		updateSession(sessionId, property) {
			const { sessions } = this;

			/* istanbul ignore next */
			if (!sessions[sessionId] || !property) {
				return;
			}

			this.sessions = { ...sessions, [sessionId]: { ...sessions[sessionId], ...property } };
			this.activeUser = this.sessions[sessionId];
		},

		selectSession(session) {
			/* istanbul ignore else */
			if (session.id !== this.activeUserId) {
				this.activeUser = session;
				this.activeUserId = session.id;
			}
		},

		async closeSession(sessionId) {
			this.updateSession(sessionId, { isClose: true });

			await this.$nextTick();

			delete this.sessions[sessionId];
			this.sessions = { ...this.sessions };

			/* istanbul ignore else */
			if (sessionId === this.activeUser.id) {
				this.activeUser = {};
				this.activeUserId = null;
			}
		},

		toggleSessionOption(sessionId, value) {
			this.activeUserId = sessionId;
			this.updateSession(sessionId, { isOptionOpen: !value });
		},

		closeSessionOption(sessionId) {
			this.updateSession(sessionId, { isOptionOpen: false });
		},

		requestUserOption(userId, action) {
			this.updateSession(userId, { action });
			this.closeSessionOption(userId);
		},

		logout() {
			return this.$store.dispatch('agent/activeLogout');
		},

		openNotification(text) {
			return this.$store.dispatch('notification/open', { text });
		},
	},

	mounted() {
		this.$nextTick(() => {
			this.$store.dispatch('loading/end');
		});
	},
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 200ms;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.v-dashboard {
	display: flex;
	position: relative;
	width: 100%;
	height: 100%;
	background-color: RGB(var(--color-surface-light));
}

.v-dashboard__nav-bar {
	display: flex;
	position: fixed;
	width: 100%;
	max-height: 52px;
	top: 0;
	left: 0;
	right: 0;
	flex-direction: row;
	padding: 10px;
	background-color: RGB(var(--color-primary));
	box-shadow: RGBA(var(--color-primary-dark, 0.25)) 0px 0px 6px;
	z-index: $layer-modal-z-index;
}

.v-dashboard__header,
.v-dashboard__current-company,
.v-dashboard__action-buttons {
	display: flex;
	width: 100%;
	flex-direction: row;
	align-items: center;
}

.v-dashboard__current-company {
	justify-content: center;
}

.v-dashboard__company-button {
	user-select: none;
	appearance: none;
	color: RGB(var(--color-text-primary-light));
	display: inline-flex;
	padding: 0;
	margin: 0;
	border: 0;
	border-radius: $border-radius-m;
	align-items: center;
	background: RGBA(var(--color-text-primary-light), 0.15);
	@media (hover) {
		cursor: pointer;
	}
}

.v-dashboard__company-title {
	padding: 0 20px;
}

.v-dashboard__company-arrow {
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

.v-dashboard__logout,
.v-dashboard__bottom-info-logout {
	appearance: none;
	background: none;
	display: flex;
	align-items: center;
	border: 1px solid;
	border-radius: 4px;
	padding: 4px 8px;
}

.v-dashboard__logout {
	color: RGB(var(--color-text-primary-light));
}

.v-dashboard__header-icon {
	display: flex;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	padding: 16px;
	align-items: center;
	justify-content: center;
	background-color: RGB(var(--color-secondary));
}

.v-dashboard__header-title {
	margin-left: 10px;
	color: RGB(var(--color-text-primary-light));
}

.v-dashboard__action-buttons {
	justify-content: flex-end;
}

.v-dashboard__menu-toggle {
	display: none;
	left: 10px;
	justify-content: center;
	align-items: center;
	font-size: 24px;
	padding: 8px;
	color: RGB(var(--color-text-primary-light));
}

.v-dashboard__menu-toggle.--show-menu-toggle {
	display: flex;
}

.v-dashboard__drawer {
	display: flex;
	position: relative;
	width: 256px;
	height: 100%;
	padding-top: 52px;
	flex-direction: column;
	flex-shrink: 0;
	box-sizing: border-box;
	border-radius: 0;
	box-shadow: RGBA(var(--color-primary), 0.25) 0px 0px 6px;
	background-color: RGB(var(--color-surface));
	z-index: $layer-dropdown-z-index;
	transition: transform 100ms cubic-bezier(0.4, 0, 0.6, 1);
}

.v-dashboard__drawer.--is-dismissible {
	position: absolute;
}

.v-dashboard__drawer.--is-drawer-closed {
	transform: translateX(-100%);
}

.v-dashboard__drawer-content {
	position: relative;
	height: 100%;
	background-color: RGB(var(--color-surface));
}

.v-dashboard__drawer-container {
	height: 100%;
	padding: 8px;
}

.v-dashboard__drawer-section {
	padding: 16px 0;
	&.--border-bottom {
		border-bottom: 1px solid RGBA(var(--color-primary), 0.5);
	}
}

.v-dashboard__list-title {
	margin-bottom: 10px;
}

.v-dashboard__drawer-overlay {
	width: 100%;
	height: 100%;
	background-color: RGBA(var(--color-primary-dark), 0.7);
	position: fixed;
	top: 0;
	left: 0;
	margin: 0;
	padding: 0;
}

.v-dashboard__list {
	margin: 0;
	line-height: 1.75rem;
	letter-spacing: 0.00937em;
	text-decoration: inherit;
	text-transform: inherit;
	display: flex;
	flex-direction: column;
}

.v-dashboard__list-item {
	display: flex;
	position: relative;
	height: 48px;
	padding-left: 16px;
	align-items: center;
	border: none;
	border-radius: 4px;
	letter-spacing: 0.00714em;
	text-decoration: inherit;
	text-transform: inherit;
	background-color: RGB(var(--color-surface-light));
	box-shadow: RGBA(var(--color-primary), 0.25) 0px 0px 6px;
}

.v-dashboard__list-item:not(:only-child) {
	margin-bottom: 10px;
}

.v-dashboard__list-item.--session-item.--active-item {
	background-color: RGB(var(--color-secondary));
}

.v-dashboard__list-item.--session-item:not(.--active-item) {
	color: RGBA(var(--color-primary), 0.25);
	box-shadow: none;
}

.v-dashboard__list-item-title {
	display: flex;
	width: 100%;
	height: 100%;
	padding: 8px 0;
	align-items: center;
}

.v-dashboard__list-item-icon {
	display: flex;
	position: relative;
	height: 100%;
	border-radius: 50%;
	padding: 0 10px;
	align-items: center;
	justify-content: center;
	font-size: 20px;
}

.v-dashboard__list-item-icon.--more-btn {
	color: RGB(var(--color-text-primary));
	display: inline-flex;
	position: relative;
	font-family: monospace;
	font-size: 16px;
	line-height: 0;
	transform: rotate(90deg);
	padding: 0;
}

.v-dashboard__options {
	display: flex;
	position: absolute;
	width: 100%;
	top: 0;
	left: 100%;
	flex-wrap: wrap;
	padding: 10px;
	margin-left: 8px;
	border: 1px solid RGBA(var(--color-primary), 0.5);
	border-radius: 4px;
	background-color: RGB(var(--color-surface));
	text-align: left;
	z-index: $layer-popover-z-index;
}

@media ($on-mobile) {
	.v-dashboard__options {
		top: 100%;
		left: 0;
		margin-left: 0;
		margin-top: 8px;
	}
}

.v-dashboard__options-item {
	width: 100%;
	margin-left: 10px;
	&:not(:last-child) {
		padding-bottom: 10px;
	}
	&:hover {
		cursor: pointer;
		color: RGB(var(--color-secondary));
	}
	&.--disabled {
		color: RGBA(var(--color-primary), 0.5);
	}
}

.v-dashboard__content {
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;
}

.v-dashboard__default-section {
	display: flex;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background: #cfd8dc;
	z-index: 0;
}

.v-dashboard__sessions {
	position: absolute;
	top: 52px;
	right: 0;
	bottom: 0;
	left: 0;
	padding: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.v-dashboard__aqua-logo {
	opacity: 0.1;
	text-align: center;
	pointer-events: none;
	user-select: none;
}

.v-dashboard__aqua-icon {
	font-size: 100px;
	margin-bottom: 20px;
}

.v-dashboard__bottom-info {
	display: flex;
	position: absolute;
	width: 100%;
	right: 0;
	bottom: 0;
	left: 0;
	padding: 8px;
	justify-content: flex-end;
	background-color: RGB(var(--color-surface-dark));
}

.v-dashboard__bottom-info-logout {
	color: RGB(var(--color-text-primary));
}
</style>
