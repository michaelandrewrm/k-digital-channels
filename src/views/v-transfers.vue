<template>
	<l-page>
		<h1 slot="header" tabindex="-1">{{ $t('MENU.TRANSFERS') }}</h1>

		<div class="v-transfer">
			<div class="v-transfer__wrapper" v-if="!isBancofar">
				<button
					data-testid="new-transfer"
					@click="goto({ name: 'transfer', params: { action: 'new' } })"
					class="v-transfer__button"
				>
					<div class="v-transfer__card">
						<div class="v-transfer__card-column-1">
							<span class="v-transfer__icon --secondary">
								<c-icon src="@icons/newTransfer" size="xl" />
							</span>
						</div>
						<div class="v-transfer__card-column-2">
							<h2 class="v-transfer__card-title text-m-medium">
								{{ $t('TRANSFERS.NEW_TRANSFER.TITLE') }}
							</h2>
							<p class="v-transfer__card-desc text-m-light">
								{{ $t('TRANSFERS.NEW_TRANSFER.DESC') }}
							</p>
						</div>
					</div>
				</button>
			</div>
			<div class="v-transfer__wrapper" v-if="!isBancofar">
				<button
					data-testid="new-transfer"
					@click="goto({ name: 'transfer', params: { action: 'new' } })"
					class="v-transfer__button"
				>
					<div class="v-transfer__card">
						<div class="v-transfer__card-column-1">
							<span class="v-transfer__icon --secondary">
								<c-icon src="@icons/newTransfer" size="xl" />
							</span>
						</div>
						<div class="v-transfer__card-column-2">
							<h2 class="v-transfer__card-title text-m-medium">
								{{ $t('TRANSFERS.ADD_FUNDS.TITLE') }}
							</h2>
							<p class="v-transfer__card-desc text-m-light">
								{{ $t('TRANSFERS.ADD_FUNDS.DESC') }}
							</p>
						</div>
					</div>
				</button>
			</div>

			<div class="v-transfer__wrapper" v-if="!isBancofar">
				<button
					data-testid="my-transfers"
					@click="goto({ name: 'my-transfers', params: { productId: 'first' } })"
					class="v-transfer__button"
				>
					<div class="v-transfer__card">
						<div class="v-transfer__card-column-1">
							<span class="v-transfer__icon">
								<c-icon src="@icons/myTransfers" size="xl" />
							</span>
						</div>
						<div class="v-transfer__card-column-2">
							<h2 class="v-transfer__card-title text-m-medium">
								{{ $t('TRANSFERS.MY_OPERATIONS.TITLE') }}
							</h2>
							<p class="v-transfer__card-desc text-m-light">
								{{ $t('TRANSFERS.MY_OPERATIONS.DESC') }}
							</p>
						</div>
					</div>
				</button>
			</div>

			<div v-if="isBancofar" class="v-transfer__wrapper">
				<button
					data-testid="correos-cash"
					@click="goto({ name: 'correos-cash-dashboard' })"
					class="v-transfer__button"
				>
					<div class="v-transfer__card">
						<div class="v-transfer__card-column-1">
							<span class="v-transfer__icon">
								<c-icon src="@icons/correos" size="xl" />
							</span>
						</div>
						<div class="v-transfer__card-column-2">
							<h2 class="v-transfer__card-title text-m-medium">
								{{ $t('TRANSFERS.CORREOS_CASH.TITLE') }}
							</h2>
							<p class="v-transfer__card-desc text-m-light">
								{{ $t('TRANSFERS.CORREOS_CASH.DESC') }}
							</p>
						</div>
					</div>
				</button>
			</div>
		</div>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import CIcon from '@components/c-icon';

import mq from '@utils/matchMedia';
import { onDesktop } from '@theme';
import { mapState } from 'vuex';

export default {
	name: 'v-transfers',

	components: {
		LPage,
		CIcon,
	},

	beforeRouteEnter(to, from, next) {
		next((vm) => vm.gotoHandler(to, from));
	},

	computed: {
		...mapState('app', ['companyId']),

		isDesktop: mq(onDesktop),

		isBancofar({ companyId }) {
			return companyId === 'BF';
		},
	},

	methods: {
		goto(to) {
			if (this.$route.name !== 'transfers') {
				window.history.pushState({}, '', this.$router.resolve({ name: 'transfers' }).href);
			}

			return this.$router.push(to).catch(() => window.history.back());
		},

		gotoHandler(to, from) {
			const { name } = to;
			const { isDesktop, isBancofar } = this;
			const viewLinks = ['transfer', 'my-transfers'];

			if (isDesktop && name === 'transfers' && !viewLinks.includes(from.name)) {
				if (isBancofar) {
					return this.goto({ name: 'correos-cash-dashboard' });
				}
				this.goto({ name: 'transfer', params: { action: 'new' } });
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.v-transfer {
	margin: 0 auto;
}

.v-transfer__wrapper {
	max-width: 400px;
	padding: 20px 0;
}

.v-transfer__wrapper:not(:last-child) {
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.v-transfer__button {
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

.v-transfer__button:hover {
	text-decoration: none;
}

.v-transfer__card {
	width: 100%;
	display: grid;
	grid-template-columns: fit-content(100px) 1fr;
	grid-gap: 20px;
	color: RGB(var(--color-text-primary));
}

.v-transfer__icon {
	display: flex;
	width: 40px;
	height: 40px;
	background-color: RGB(var(--color-surface-light));
	border-radius: $border-radius-l;
	box-shadow: 0px 5px 10px -10px rgba(0, 0, 0, 0.5);
	align-items: center;
	justify-content: center;
	color: RGB(var(--color-accent-icon));
}

.v-transfer__icon.--secondary {
	color: RGB(var(--color-accent-secondary));
}

.v-transfer__card-desc {
	margin-top: 10px;
}
</style>
