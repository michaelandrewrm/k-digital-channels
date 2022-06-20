<template>
	<div class="w-menu" :class="{ '--is-desktop': isDesktop }" @keydown.esc="close">
		<transition name="fade" appear>
			<div class="w-menu__overlay" tabindex="-1" @click.self="close"></div>
		</transition>
		<transition :name="transitionName" appear mode="in-out" @after-enter="showContent = true">
			<div class="w-menu__container">
				<transition name="fade" appear>
					<div v-show="showContent" class="w-menu__content">
						<div class="w-menu__header-logo">
							<img src="@assets/img/logo-kukentok.svg" alt aria-hidden="true" />
						</div>
						<h1 v-if="title" class="w-menu__header-title text-xl-medium" tabindex="-1">
							{{ $t('MENU.HELLO', { name: title }) }}
						</h1>
						<div v-if="connectedContract" class="w-menu__contract" data-testid="contract-button">
							<button class="w-menu__contract-item" @click="selectContract">
								<c-icon src="@icons/contracts" class="w-menu__contract-icon" />
								<span>{{ connectedContract.description }}</span>
								<span v-if="connectedContract.type === 'owner'" class="text-s-light">
									{{ $t('INFO.CONTRACTS.OWNER') }}
								</span>
							</button>
						</div>
						<ul class="w-menu__content" role="menu">
							<li class="w-menu__list text-m-book" v-for="(item, i) in items" :key="i" role="none">
								<button
									class="w-menu__list-item"
									:class="{ '--highlight': item.highlight }"
									data-testid="menu-item"
									role="menuitem"
									:disabled="item.disabled"
									@click="select(item.id)"
								>
									<c-icon :src="item.icon" class="w-menu__list-icon" />
									<span>{{ item.title }}</span>
									<span v-if="item.subtitle" class="text-s-light">{{ item.subtitle }}</span>
								</button>
							</li>
						</ul>
					</div>
				</transition>
				<div v-if="!isDesktop" class="w-menu__footer">
					<button data-testid="logout-button" class="w-menu__logout-button" @click="logout">
						<c-icon src="@icons/exit" class="w-menu__list-icon" />
						<span class="text-m-medium">{{ $t('ACTIONS.CLOSE_SESSION') }}</span>
					</button>
				</div>
				<div class="w-menu__close">
					<button
						data-testid="close-button"
						class="w-menu__close-button"
						:title="$t('MENU.CLOSE_MENU')"
						:aria-label="$t('MENU.CLOSE_MENU')"
						@click="close"
					>
						<!-- eslint-disable-line vue-i18n/no-raw-text -->
						&times;
					</button>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import mq from '@utils/matchMedia';
import { onDesktop } from '@theme';

export default {
	name: 'w-menu',

	components: { CIcon },

	props: {
		title: String,
		connectedContract: Object,
		items: Array,
	},

	data() {
		return { showContent: null };
	},

	computed: {
		isDesktop: mq(onDesktop),

		transitionName({ isDesktop }) {
			return isDesktop ? 'slide' : 'fade';
		},
	},

	methods: {
		close() {
			this.$emit('close-menu');
		},

		select(item) {
			this.$emit('item-selected', item);
			this.close();
		},

		logout() {
			this.$store.dispatch('authn/activeLogout');
			this.close();
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
					username: this.title,
					connectedContract: this.connectedContract,
				},
			});

			/* istanbul ignore else */
			if (contract && contract?.id !== this.connectedContract?.id) {
				this.close();

				this.$router.replace({ name: 'home' }).catch(() => {});
				await this.$store.dispatch('contracts/set', contract);
			}

			this.$store.dispatch('loading/end');
		},
	},
};
</script>

<style lang="scss" scoped>
.w-menu {
	display: flex;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: $layer-modal-z-index;
}

.w-menu__icon-logo {
	width: 50px;
	color: white;
}

.w-menu.--is-desktop {
	z-index: $layer-dropdown-z-index;
}

.w-menu__container {
	display: flex;
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	padding: 0 20px;
	background: var(--color-gradient-menu);
}

.w-menu.--is-desktop .w-menu__container {
	width: 50%;
	max-width: 550px;
	left: 110px;
	right: auto;
	padding: 0 80px;
	will-change: transform;
}

.fade-enter-active {
	animation: fade 200ms ease;
}

.slide-enter-active {
	animation: slide-enter-left 200ms ease-out both;
}

@keyframes fade {
	from {
		opacity: 0;
	}
}

@keyframes slide-enter-left {
	from {
		transform: translateX(-100%);
		opacity: 0;
	}
}

.w-menu__overlay {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	margin: 0;
	padding: 0;
	background-color: RGBA(var(--color-primary-dark), 0.7);
}

.w-menu__close {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 11px;
	right: 0;
	width: 38px;
	height: 50px;
}

.w-menu__close-button {
	position: absolute;
	top: 10px;
	right: 10px;
	height: 26px;
	width: 26px;
	padding: 8px;
	background: transparent;
	border: 0;
	font-size: 26px;
	font-weight: 100;
	line-height: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: content-box;
	font-family: sans-serif;
	color: RGBA(var(--color-text-primary-light));
}

.w-menu__content {
	display: flex;
	position: relative;
	height: 100%;
	overflow: hidden;
	margin-bottom: 60px;
	flex-direction: column;
	flex-grow: 1;
	flex-shrink: 1;
}

.w-menu__header-logo {
	position: relative;
	padding-top: 80px;
	padding-bottom: 30px;
	text-align: center;
}

.w-menu__header-title {
	position: relative;
	color: RGBA(var(--color-text-primary-light));
	text-align: center;
	padding-bottom: 20px;
	margin: 0;
}

.w-menu__contract {
	border-top: 1px solid RGBA(var(--color-primary-surface), 0.2);
	padding: 20px 0;
	margin: 0 10px;
}

.w-menu__contract-item {
	appearance: none;
	color: RGB(var(--color-text-primary-light));
	display: grid;
	position: relative;
	width: 100%;
	min-height: 75px;
	margin: 0;
	padding: 18px 10px;
	border: 0;
	border-radius: $border-radius-m;
	text-align: left;
	grid-template-columns: auto 1fr;
	column-gap: 20px;
	align-items: center;
	background: RGB(var(--color-accent-primary));
}

.w-menu__contract-icon {
	color: RGB(var(--color-secondary));
	font-size: 28px;
	grid-row: 1 / 3;
}

.w-menu__contract-item span + span {
	grid-column: 2 / 3;
	padding-top: 10px;
}

.w-menu__content {
	color: RGB(var(--color-text-primary-light));
	position: relative;
	height: 100%;
	margin: 0 10px;
	padding-bottom: 30px;
	overflow: auto;
}

.w-menu__content:not(:first-child) {
	border-top: 1px solid RGBA(var(--color-primary-surface), 0.2);
}

.w-menu.--is-desktop .w-menu__container .w-menu__content {
	padding-bottom: 0;
}

.w-menu__list {
	padding: 2px;
}

.w-menu__list-item {
	appearance: none;
	color: inherit;
	display: grid;
	position: relative;
	width: 100%;
	border: 0;
	margin: 0;
	padding: 14px 10px;
	text-align: left;
	grid-template-columns: auto 1fr;
	column-gap: 10px;
	align-items: center;
	background: transparent;
}

.w-menu__list-icon {
	font-size: 16px;
	grid-row: 1 / 3;
}

.w-menu__list-item span + span {
	grid-column: 2 / 3;
	padding-top: 10px;
}

.w-menu__list-item.--highlight {
	margin: 32px 0;
	padding: 20px 10px;
	border-top: 1px solid RGBA(var(--color-primary-surface), 0.2);
	border-bottom: 1px solid RGBA(var(--color-primary-surface), 0.2);
}

.w-menu__contract-item::after,
.w-menu__list-item.--highlight::after {
	content: '';
	position: absolute;
	top: calc(50% - 3px);
	right: 20px;
	border-right: 1px solid white;
	border-bottom: 1px solid white;
	transform: rotate(-45deg);
	width: 6px;
	height: 6px;
}

.w-menu__footer {
	display: flex;
	position: absolute;
	width: 100%;
	height: 57px;
	right: 0;
	bottom: 0;
	left: 0;
	justify-content: center;
	align-items: center;
	background: linear-gradient(to bottom, #06293c 0.5px, rgba(0, 0, 0, 0.2) 1px, transparent 9px),
		#03131c;
}

.w-menu__logout-button {
	display: grid;
	grid-template-columns: auto 1fr;
	column-gap: 10px;
	appearance: none;
	user-select: none;
	border: 0;
	background: transparent;
	text-align: left;
	color: RGB(var(--color-text-secondary));
	align-items: center;
}
</style>
