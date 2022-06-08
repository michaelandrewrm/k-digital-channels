<template>
	<l-page :loading="loading">
		<h1 slot="header" tabindex="-1">{{ $t('BIZUM.TITLE') }}</h1>

		<c-operation-success v-if="success" slot="state" data-testid="operation-success">
			<h1 slot="title">{{ $t('BIZUM.UNREGISTER.SUCCESS.TITLE') }}</h1>

			<c-translide appear>
				<div class="v-bizum-unregister__list">
					<c-list-icon-item :title="$t('DETAIL.ASSOCIATED_ACCOUNT')" icon="@icons/paper">
						<div>
							<p>{{ product.alias }}</p>
							<p>{{ $pn(product.productNumber) }}</p>
						</div>
					</c-list-icon-item>

					<c-list-icon-item
						:title="$t('DETAIL.LINKED_PHONE')"
						:description="phone"
						icon="@icons/cellphone"
					/>
				</div>
			</c-translide>

			<p class="text-s-book">
				{{ $t('BIZUM.UNREGISTER.SUCCESS.DESC') }}
			</p>
			<c-button raised slot="buttons" @click="gotoTransfers" data-testid="continue">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</c-operation-success>

		<c-operation-error
			v-if="error"
			contact-us
			slot="state"
			@confirm="$router.go(-2)"
			data-testid="operation-error"
		>
			<h1 slot="title">{{ $t('BIZUM.UNREGISTER.ERROR.TITLE') }}</h1>
			<p class="text-m-book">
				{{ $t('BIZUM.UNREGISTER.ERROR.TITLE').concat('. ', $t('INFO.UNAVAILABLE_OPERATIVE.ALT1')) }}
			</p>
		</c-operation-error>

		<c-translide>
			<section v-if="!success && !error && fetched" class="v-bizum-unregister__template">
				<p class="text-m-medium">{{ $t('BIZUM.UNREGISTER.CONFIRM') }}</p>

				<section class="v-bizum-unregister__data" v-if="product">
					<header aria-hidden="true">
						<h2 class="text-m-medium">{{ $t('DETAIL.ASSOCIATED_ACCOUNT') }}</h2>
					</header>
					<div class="v-bizum-unregister__data-button">
						<div class="v-bizum-unregister__data-card" data-testid="account">
							<div class="text-m-book">{{ product.alias }}</div>
							<div class="text-s-light">{{ $pn(product.productNumber) }}</div>
						</div>
					</div>
				</section>

				<section class="v-bizum-unregister__data" v-if="phone">
					<header aria-hidden="true">
						<h2 class="text-m-medium">{{ $t('DETAIL.LINKED_PHONE') }}</h2>
					</header>
					<div class="v-bizum-unregister__data-button">
						<div class="v-bizum-unregister__data-card" data-testid="phone">
							<div class="text-m-book">{{ phone }}</div>
						</div>
					</div>
				</section>

				<div>
					<p class="v-bizum-unregister__info text-s-book">
						{{ $t('BIZUM.UNREGISTER.CONFIRM.INFO1') }}
					</p>
					<p class="v-bizum-unregister__info text-s-book">
						{{ $t('BIZUM.UNREGISTER.CONFIRM.INFO2') }}
					</p>
				</div>
			</section>
		</c-translide>

		<c-button
			v-if="!success && !error && fetched"
			raised
			slot="buttons"
			data-testid="submit"
			@click="submit"
		>
			{{ $t('BIZUM.ACTION.UNREGISTER') }}
		</c-button>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import bizumModule from '@modules/bizum/m-bizum';
import CButton from '@components/c-button';
import COperationError from '@components/c-operation-error';
import COperationSuccess from '@components/c-operation-success';
import CListIconItem from '@components/c-list-icon-item';
import CTranslide from '@components/c-translide';

export default {
	name: 'v-bizum-unregister',

	modules: {
		bizum: bizumModule,
	},

	components: {
		LPage,
		CButton,
		COperationError,
		COperationSuccess,
		CListIconItem,
		CTranslide,
	},

	data() {
		return {
			fetched: false,
			loading: false,
			error: false,
			success: false,
			product: null,
			phone: null,
		};
	},

	created() {
		this.fetch();
	},

	methods: {
		fetch() {
			const getProduct = this.$store.dispatch('bizum/getProduct');
			const getPersonalDetails = this.$store.dispatch('user/getPersonalDetails');

			this.error = false;
			this.fetched = false;
			Promise.all([getProduct, getPersonalDetails])
				.then(([product, { data: { phone } }]) => {
					this.product = product;
					this.phone = phone;
				})
				.catch(() => {
					this.error = true;
				})
				.finally(() => {
					this.fetched = true;
				});
		},

		submit() {
			this.success = false;
			this.error = false;
			this.loading = true;
			const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
			wait(1000).then(() => {
				this.$store
					.dispatch('bizum/unregister')
					.then(() => {
						this.success = true;
					})
					.catch(() => {
						this.error = true;
					})
					.finally(() => {
						this.loading = false;
					});
			});
		},

		gotoTransfers() {
			this.$router.replace({ name: 'transfers' });
		},
	},
};
</script>

<style lang="scss" scoped>
.v-bizum-unregister__list {
	text-align: left;
	padding-bottom: 30px;
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
	margin-bottom: 40px;
}

.v-bizum-unregister__list > * {
	margin-bottom: 20px;
}

.v-bizum-unregister__template {
	margin-top: 15px;
}

.v-bizum-unregister__info {
	text-align: center;
	padding: 40px 40px 0;
}

.v-bizum-unregister__info:first-of-type {
	margin-top: 40px;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.v-bizum-unregister__data:first-of-type {
	margin-top: 30px;
}

.v-bizum-unregister__data:not(:first-of-type) {
	margin-top: 18px;
}

.v-bizum-unregister__data-button {
	appearance: none;
	background: transparent;
	border: 0;
	margin: 0;
	display: block;
	width: 100%;
	text-align: left;
	outline: none;
	position: relative;
}

.v-bizum-unregister__data-button:not(:first-child) {
	margin-top: 10px;
}

.v-bizum-unregister__data-card {
	display: grid;
	position: relative;
	padding: 10px;
	background-color: RGB(var(--color-surface-light));
	box-shadow: 0px 5px 10px -10px rgba(0, 0, 0, 0.3);
	border-radius: 3px;
	color: RGB(var(--color-text-primary));
	grid-template-columns: minmax(0, 1fr) 1fr fit-content(100px);
	grid-template-rows: auto;
	align-items: center;
}
</style>
