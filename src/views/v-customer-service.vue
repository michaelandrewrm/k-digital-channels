<template>
	<l-page>
		<div tabindex="-1" slot="header">{{ $t('CUSTOMER_SERVICE.TITLE') }}</div>
		<div class="v-customer-service">
			<div class="v-customer-service__wrapper" v-if="!isBancofar">
				<button
					@click="goto({ name: 'sirvase' })"
					class="v-customer-service__button"
					data-testid="sirvase"
				>
					<div class="v-customer-service__card">
						<div class="v-customer-service__card-column-1">
							<span class="v-customer-service__icon-wrapper">
								<c-icon class="v-customer-service__icon" src="@icons/sirvaseEfectuar" size="xxl" />
							</span>
						</div>
						<div class="v-customer-service__card-column-2">
							<h2 class="v-customer-service__card-title text-m-medium">
								{{ $t('CUSTOMER_SERVICE.SIRVASE.TITLE') }}
							</h2>
							<p class="v-customer-service__card-desc text-m-light">
								{{ $t('CUSTOMER_SERVICE.SIRVASE.DESC') }}
							</p>
						</div>
					</div>
				</button>
			</div>

			<div class="v-customer-service__wrapper">
				<button
					@click="goto({ name: 'customer-chat' })"
					class="v-customer-service__button"
					data-testid="chat"
				>
					<div class="v-customer-service__card">
						<div class="v-customer-service__card-column-1">
							<span class="v-customer-service__icon-wrapper">
								<c-icon src="@icons/chat" size="xxl" />
							</span>
						</div>
						<div class="v-customer-service__card-column-2">
							<h2 class="v-customer-service__card-title text-m-medium">
								{{ $t('CUSTOMER_SERVICE.CHAT.TITLE') }}
							</h2>
							<p class="v-customer-service__card-desc text-m-light">
								{{ $t('CUSTOMER_SERVICE.CHAT.DESC') }}
							</p>
						</div>
					</div>
				</button>
			</div>

			<div class="v-customer-service__wrapper">
				<div class="v-customer-service__card">
					<div class="v-customer-service__card-column-1">
						<span class="v-customer-service__icon-wrapper">
							<c-icon src="@icons/whatsapp" size="xxl" />
						</span>
					</div>
					<div class="v-customer-service__card-column-2">
						<h2 class="v-customer-service__card-title text-m-medium">
							{{ $t('CUSTOMER_SERVICE.WHATSAPP.TITLE') }}
						</h2>
						<p class="v-customer-service__card-desc text-m-light">
							{{ $t('CUSTOMER_SERVICE.WHATSAPP.DESC') }}
						</p>
					</div>
				</div>
			</div>

			<div class="v-customer-service__wrapper">
				<div class="v-customer-service__card">
					<div class="v-customer-service__card-column-1">
						<span class="v-customer-service__icon-wrapper">
							<c-icon src="@icons/phone" size="xxl" />
						</span>
					</div>
					<div class="v-customer-service__card-column-2">
						<h2 class="v-customer-service__card-title text-m-medium">
							{{ $t('CUSTOMER_SERVICE.ONLINE_BANK.TITLE') }}
						</h2>
						<p class="v-customer-service__card-desc text-m-light">
							{{ $t('CUSTOMER_SERVICE.ONLINE_BANK.DESC') }}
						</p>
						<button
							v-if="!isBancofar"
							@click="goto({ name: 'customer-online' })"
							class="v-customer-service__button"
							data-testid="online"
						>
							<p class="v-customer-service__card-info text-m-bold">
								<u>{{ $t('CUSTOMER_SERVICE.MORE_INFO') }}</u>
							</p>
						</button>
					</div>
				</div>
			</div>

			<div class="v-customer-service__wrapper">
				<div class="v-customer-service__card">
					<div class="v-customer-service__card-column-1">
						<span class="v-customer-service__icon-wrapper">
							<c-icon src="@icons/hands" size="xxl" />
						</span>
					</div>
					<div class="v-customer-service__card-column-2">
						<h2 class="v-customer-service__card-title text-m-medium">
							{{ $t('CUSTOMER_SERVICE.OFFICES.TITLE') }}
						</h2>
						<button
							@click="goto({ name: 'customer-offices' })"
							class="v-customer-service__button"
							data-testid="offices"
						>
							<p class="v-customer-service__card-info text-m-bold">
								<u>{{ $t('CUSTOMER_SERVICE.MORE_INFO') }}</u>
							</p>
						</button>
					</div>
				</div>
			</div>
		</div>
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import mq from '@utils/matchMedia';
import { onDesktop } from '@theme';
import LPage from '@layouts/l-page';
import CIcon from '@components/c-icon';

const isPrd = window?.VUE_APP_CONFIG?.env === 'prd';

export default {
	name: 'v-customer-service',

	components: { LPage, CIcon },

	beforeRouteEnter(to, from, next) {
		next((vm) => vm.gotoHandler(to, from));
	},

	data() {
		return { isPrd };
	},

	computed: {
		...mapState('app', ['companyId']),

		/* istanbul ignore next */
		isBancofar({ companyId }) {
			return companyId === 'BF';
		},

		isDesktop: mq(onDesktop),
	},

	methods: {
		goto(to) {
			/* istanbul ignore next */
			if (this.$route.name !== 'customer-service') {
				window.history.pushState({}, '', this.$router.resolve({ name: 'customer-service' }).href);
			}

			return this.$router.push(to).catch(() => window.history.back());
		},

		gotoHandler(to, from) {
			const { name } = to;
			const { isDesktop } = this;
			const viewLinks = [
				'sirvase-dashboard',
				'customer-chat',
				'customer-online',
				'customer-offices',
			];

			/* istanbul ignore else */
			if (isDesktop && name === 'customer-service' && !viewLinks.includes(from.name)) {
				/* istanbul ignore else */
				if (this.isBancofar) {
					return this.goto({ name: 'customer-chat' });
				}

				this.goto({ name: 'sirvase-dashboard' });
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.v-customer-service {
	width: 100%;
	margin: 0 0;
}

.v-customer-service__wrapper {
	display: flex;
	max-width: 600px;
	padding: 20px 0;
}

.v-customer-service__wrapper:not(:last-child) {
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.v-customer-service__card {
	width: 100%;
	display: grid;
	grid-template-columns: fit-content(100px) 1fr;
	grid-gap: 20px;
	color: RGB(var(--color-text-primary));
	white-space: pre-line;
}

.v-customer-service__icon-wrapper {
	display: flex;
	width: 40px;
	height: 40px;
	background-color: RGB(var(--color-surface-light));
	border-radius: $border-radius-m;
	box-shadow: 0px 5px 10px -10px rgba(0, 0, 0, 0.5);
	align-items: center;
	justify-content: center;
	color: RGB(var(--color-accent-secondary));
}

.sirvase-icon {
	position: relative;
	top: 3px;
	left: 3px;
	transform: rotate(-45deg);
	font-size: 24px;
}

.v-customer-service__button {
	width: 100%;
	border: none;
	outline: none;
	text-align: left;
	padding: 10px 0;
	background-color: var(--background-color, inherit);
	display: block;
	text-decoration: none;
	position: relative;
}

.v-customer-service__button:hover {
	text-decoration: none;
}

.v-customer-service__card-desc {
	margin-top: 5px;
	line-height: 1.5;
}

.v-customer-service__card-info {
	color: RGB(var(--color-text-primary));
}
</style>
