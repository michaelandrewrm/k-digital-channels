<template>
	<l-page>
		<h1 slot="header" tabindex="-1" data-testid="header">{{ $t('ONTIME.TITLE') }}</h1>

		<div class="v-ontime-dashboard__content">
			<div class="v-ontime-dashboard__title">
				<span class="text-m-medium">
					{{ $t('ONTIME.DASHBOARD.LAST_MOVEMENTS').concat(' ') }}
				</span>
				<span class="text-m-book">{{ $t('ONTIME.DASHBOARD.30_DAYS') }}</span>
			</div>

			<div class="v-ontime-dashboard__movements">
				<transition name="placeholder" mode="out-in">
					<c-placeholder-movement v-if="loading && !fetched" data-testid="placeholder" />

					<div v-else-if="fetched && error" class="v-ontime-dashboard__error" data-testid="error">
						<c-icon class="v-ontime-dashboard__error-icon" src="@icons/modalExclamation" />
						<p class="text-m-book">{{ $t('ONTIME.DASHBOARD.ERROR.MOVEMENTS') }}</p>
						<c-contact-support-info />
					</div>

					<div
						v-else-if="fetched && (!products.length || !hasMovements)"
						class="v-ontime-dashboard__warning"
						data-testid="warning"
					>
						<c-icon class="v-ontime-dashboard__warning-icon" src="@icons/modalExclamation" />
						<p v-if="!products.length" class="text-m-book">
							{{ $t('ONTIME.DASHBOARD.WARNING.PRODUCTS') }}
						</p>
						<p v-else-if="!hasMovements" class="text-m-book">
							{{ $t('ONTIME.DASHBOARD.WARNING.MOVEMENTS') }}
						</p>
					</div>

					<div
						v-else-if="fetched && products.length && hasMovements"
						class="v-ontime-dashboard__movements-group"
					>
						<ul
							class="v-ontime-dashboard__movements-list"
							v-for="(group, i) in movementsGroup"
							:key="i"
						>
							<li class="v-ontime-dashboard__group-label text-l-book" data-testid="list-title">
								{{ group.label }}
							</li>
							<li class="v-ontime-dashboard__list-item" v-for="item in group.items" :key="item.id">
								<button
									class="v-ontime-dashboard__list-item-button"
									data-testid="list-item"
									@click="goto(item)"
								>
									<span class="v-ontime-dashboard__list-item-title">{{ item.reason }}</span>
									<span class="v-ontime-dashboard__list-item-info text-l-medium">
										{{ $nc(item.amount) }}
									</span>
									<span
										v-if="item.type && item.type.name"
										class="v-ontime-dashboard__list-item-subinfo text-m-book"
									>
										{{ item.type.name }}
									</span>
									<span class="v-ontime-dashboard__list-item-subtitle text-s-book">
										<i>{{ item.name }} {{ item.productNumber }}</i>
									</span>
								</button>
							</li>
						</ul>
					</div>
				</transition>

				<transition name="placeholder">
					<c-placeholder-movement v-if="loading && !fetched" />
				</transition>

				<transition name="placeholder">
					<c-placeholder-movement v-if="loading && !fetched" />
				</transition>
			</div>
		</div>

		<w-actions :options="actionOptions" slot="buttons" />
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import LPage from '@layouts/l-page';
import CIcon from '@components/c-icon';
import CPlaceholderMovement from '@components/c-placeholder-movement';
import CContactSupportInfo from '@components/c-contact-support-info';
import WActions from '@widgets/w-actions';
import iconOnTime from '@icons/ontime';
import iconFilter from '@icons/filter';
import { typesById } from '@modules/products/product-types';
import productFamilies from '@modules/products/product-families';
import { subtypesById } from '@modules/products/product-subtypes';
import resourcesModule from '@modules/resources/m-resources';

export default {
	name: 'v-ontime-dashboard',

	modules: {
		resources: resourcesModule,
	},

	components: {
		LPage,
		CIcon,
		CPlaceholderMovement,
		CContactSupportInfo,
		WActions,
	},

	data() {
		return {
			loading: false,
			error: false,
			fetched: false,
			products: [],
			movementsGroup: {},
			hasMovements: false,
		};
	},

	computed: {
		...mapState('ontime', ['isWelcome', 'productsOntime']),

		actionOptions() {
			// TODO: [CD-9672] Remove this block when sorting page is built
			const disabledTemporally = true;

			if (disabledTemporally) {
				return [
					{
						id: 'configure-products',
						title: this.$t('ACTIONS.SELECT_ACCOUNTS_AND_CARDS'),
						icon: iconOnTime,
						action: () => this.$router.push({ name: 'ontime-create' }),
					},
				];
			}

			return [
				{
					id: 'filter-movements',
					title: this.$t('ACTIONS.FILTER_MOVEMENTS'),
					icon: iconFilter,
					action: () => {}, // TODO: Add this.$router.push({ name: 'ontime-filter' }) when sorting page is built
					disabled: true, // TODO: Add !hasMovements when sorting page is built
				},
				{
					id: 'configure-products',
					title: this.$t('ACTIONS.SELECT_ACCOUNTS_AND_CARDS'),
					icon: iconOnTime,
					action: () => this.$router.push({ name: 'ontime-create' }),
				},
			];
		},
	},

	methods: {
		getMovements() {
			this.$store
				.dispatch('ontime/getMovements')
				.then((data) => {
					let items = [];
					const families = Object.entries(productFamilies);

					data.forEach(({ productId, movements }) => {
						const product = this.products.find(({ id }) => id === productId);

						/* istanbul ignore else */
						if (product) {
							const productNumber = product?.productNumber?.value?.slice(-4);
							const productType = typesById[(product.productType?.id)];
							const subtype = subtypesById[(product.productSubtype?.id)];
							const [familyId] =
								families.find(([, group]) => group.includes(subtype)) ||
								/* istanbul ignore next */ [];

							items = items.concat(
								movements.map((movement) => ({
									...movement,
									productId,
									name: product.name,
									productNumber,
									productType,
									familyId,
								}))
							);
						}
					});

					items.sort(({ operationDate: a }, { operationDate: b }) => new Date(b) - new Date(a));
					items.forEach((item) => {
						const date = new Date(item.operationDate).toISOString().split('T')[0];

						/* istanbul ignore else */
						if (!this.movementsGroup[date]) {
							Object.assign(this.movementsGroup, {
								[date]: {
									label: this.$d(new Date(date), 'weekday'),
									items: [],
								},
							});
						}

						this.movementsGroup[date].items.push(item);
					});

					this.hasMovements = Object.keys(this.movementsGroup).length > 0;
				})
				.catch(() => {
					this.error = true;
				})
				.finally(() => {
					this.fetched = true;
					this.loading = false;
				});
		},

		goto({ productId, id: movementId, productType, familyId }) {
			if (productType === 'card' && movementId === '000-0000000') {
				return;
			}

			this.$store
				.dispatch('resources/fetch', {
					resource: 'movements',
					productId,
				})
				.then(() =>
					this.$router.push({
						name: 'movement',
						params: { familyId, productId, movementId, productType },
					})
				);
		},

		getProductsOntime() {
			this.loading = true;
			this.$store
				.dispatch('ontime/get')
				.then((data) => data?.filter(({ onTime }) => onTime))
				.then((productsOntime) => {
					/* istanbul ignore else */
					if (!this.isWelcome && !productsOntime?.length) {
						return this.$router.replace({ name: 'ontime-welcome' });
					}

					this.products = productsOntime;
					this.getMovements();
				});
		},
	},

	created() {
		this.getProductsOntime();
	},
};
</script>

<style lang="scss" scoped>
.v-ontime-dashboard__content {
	position: relative;
	width: 100%;
	height: 100%;
	margin: 20px 0;
}

.v-ontime-dashboard__movements {
	margin-top: 20px;
}

.v-ontime-dashboard__error,
.v-ontime-dashboard__warning {
	max-width: 320px;
	text-align: center;
	margin: 0 auto;
	padding: 30px 0 0;
}

.v-ontime-dashboard__error-icon,
.v-ontime-dashboard__warning-icon {
	font-size: 30px;
	margin-bottom: 10px;
}

.v-ontime-dashboard__error-icon {
	color: RGB(var(--color-accent-error));
}

.v-ontime-dashboard__warning-icon {
	color: RGB(var(--color-accent-secondary));
}

.v-ontime-dashboard__movements-list:not(:first-of-type) {
	margin-top: 30px;
}

.v-ontime-dashboard__group-label {
	text-transform: capitalize;
	padding-bottom: 8px;
	border-bottom: 1px solid RGBA(var(--color-dark-surface), 0.2);
}

.v-ontime-dashboard__list-item {
	margin: 10px 0;
}

.v-ontime-dashboard__list-item-button {
	color: RGB(var(--color-text-primary));
	appearance: none;
	display: grid;
	position: relative;
	width: 100%;
	border: none;
	padding: 0;
	padding-bottom: 8px;
	border-bottom: 1px solid RGBA(var(--color-dark-surface), 0.2);
	grid-template-columns: auto 1fr;
	row-gap: 8px;
	background-color: RGB(var(--color-surface));
	line-height: 1.6;
}

.v-ontime-dashboard__list-item-title {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.v-ontime-dashboard__list-item-title,
.v-ontime-dashboard__list-item-subinfo {
	text-align: left;
}

.v-ontime-dashboard__list-item-info,
.v-ontime-dashboard__list-item-subtitle {
	text-align: right;
}

.v-ontime-dashboard__list-item-subtitle {
	grid-row: 2;
	grid-column: 2;
}

.v-ontime-dashboard__list-item-subtitle i {
	font-style: normal;
	background: RGB(var(--color-surface-dark));
	padding: 4px 6px;
	white-space: nowrap;
}

.placeholder-enter {
	opacity: 0;
	transform: translateY(-5px);
}

.placeholder-leave-active {
	opacity: 0;
	transform: translateY(40%);
}

.placeholder-enter-active {
	transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
}

.placeholder-leave-active {
	transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
	transition-delay: 400ms;
}

.placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 200ms;
}

.placeholder-leave-active ~ .placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 0ms;
}
</style>
