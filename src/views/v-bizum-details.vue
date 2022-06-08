<template>
	<l-view-modal @close="$router.back()">
		<transition name="placeholder">
			<template v-if="loading">
				<c-placeholder-detail class="v-bizum-details__placeholder" />
			</template>
		</transition>

		<transition name="content" slot="header">
			<img
				v-if="!loading && detail"
				class="v-bizum-welcome__bizum-logo"
				src="@assets/img/bizumLogo.svg"
				alt=""
				width="110"
				height="33"
			/>
		</transition>

		<transition name="content">
			<div v-if="!loading && detail">
				<div class="v-bizum-details__block">
					<c-list-icon-item
						v-if="detail.phone"
						data-testid="phone"
						:title="$t('DETAIL.LINKED_PHONE')"
						:description="detail.phone"
						icon="@icons/cellphone"
					/>
				</div>
				<router-link class="v-bizum-details__block --navigable" :to="{ name: 'bizum-settings' }">
					<c-list-icon-item
						v-if="detail.bizumAccount"
						data-testid="account"
						:title="detail.bizumAccount.alias"
						:description="$pn(detail.bizumAccount.productNumber, 'format')"
						icon="@icons/wallet"
					/>
				</router-link>

				<div class="v-bizum-details__block">
					<c-list-icon-item
						v-if="detail.email"
						data-testid="email"
						:title="$t('PERSONAL_AREA.EMAIL')"
						:description="detail.email"
						icon="@icons/paper"
					/>
				</div>

				<router-link
					class="v-bizum-details__link text-m-medium"
					:to="{ name: 'bizum-unregister' }"
					replace
					data-testid="unregister-button"
				>
					{{ $t('BIZUM.UNREGISTER') }}
				</router-link>
			</div>
		</transition>
	</l-view-modal>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';
import CPlaceholderDetail from '@components/c-placeholder-detail';
import LViewModal from '@layouts/l-view-modal';
import bizumModule from '@modules/bizum/m-bizum';

export default {
	name: 'v-bizum-details',

	modules: { bizum: bizumModule },

	data() {
		return {
			detail: null,
			loading: false,
			timerLoading: null,
		};
	},

	components: {
		CListIconItem,
		CPlaceholderDetail,
		LViewModal,
	},

	mounted() {
		clearTimeout(this.timerLoading);
		this.timerLoading = setTimeout(() => {
			this.timerLoading = null;
			this.loading = true;
		}, 200);

		const getPersonalDetails = this.$store.dispatch('user/getPersonalDetails');
		const getProduct = this.$store.dispatch('bizum/getProduct');

		Promise.all([getPersonalDetails, getProduct])
			.then(([{ data }, product]) => {
				if (!data) {
					return this.$router.back();
				}

				this.detail = { ...data, bizumAccount: product };
			})
			.finally(() => {
				clearTimeout(this.timerLoading);
				this.timerLoading = null;
				this.loading = false;
			});
	},
};
</script>

<style lang="scss" scoped>
.placeholder-enter {
	opacity: 0;
	transform: translateX(-10px);
}

.placeholder-leave-active {
	opacity: 0;
	transform: translateX(10px);
}

.placeholder-enter-active {
	transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
}

.placeholder-leave-active {
	transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
}

.content-enter {
	opacity: 0;
}

.content-leave-active {
	opacity: 0;
}

.content-enter-active {
	transition: opacity 300ms ease-in-out;
	transition-delay: 400ms;
}

.content-leave-active {
	transition: opacity 300ms ease-in-out;
}

.v-bizum-details__placeholder {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 36px;
	left: 0;
}

.v-bizum-details__block {
	display: block;
	text-decoration: none;
	position: relative;
	border-top: 1px solid RGBA(var(--color-dark-surface), 0.2);
	padding: 20px;
	--c-list-icon-item-icon-color: #{RGB(var(--color-text-secondary-light))};
}

.v-bizum-details__block:last-of-type() {
	border-bottom: 1px solid RGBA(var(--color-dark-surface), 0.2);
}

.v-bizum-details__block.--navigable::after {
	content: '';
	position: absolute;
	top: calc(50% - 3px);
	right: 2px;
	border-right: 1px solid currentColor;
	border-bottom: 1px solid currentColor;
	transform: rotate(-45deg);
	width: 6px;
	height: 6px;
}

.v-bizum-details__link {
	padding: 20px;
	text-align: center;
	display: block;
}

@media (hover) {
	.v-bizum-details__link {
		cursor: pointer;
	}
}
</style>
