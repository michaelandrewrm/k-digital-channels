<template>
	<div class="w-transfer-destination-list" :class="{ '--selected': selected }">
		<transition name="placeholder" mode="out-in">
			<c-placeholder-movement v-if="loading && !fetched" key="placeholder" data-testid="loading" />

			<div
				class="w-transfer-destination-list__main w-transfer-destination-list__list-error"
				v-else-if="error"
				data-testid="error"
			>
				<c-icon
					class="w-transfer-destination-list__list-error-icon"
					src="@icons/modalExclamation"
				/>

				<p class="text-m-book w-transfer-destination-list__list-error-text">
					{{ $t('RESOURCE.PRODUCT.ERROR') }}
					<br />
					<br />
					<a href="#" class="w-transfer-destination-list__list-error-link" @click.prevent="refresh">
						{{ $t('RETRY') }}
					</a>
				</p>
			</div>

			<div
				class="w-transfer-destination-list__main w-transfer-destination-list__list"
				v-else-if="fetched"
				key="resources"
				data-testid="list"
				role="list"
			>
				<button
					v-for="product in viewProducts"
					:key="product.productNumber.value"
					class="w-transfer-destination-list__button"
					@click="selectProduct(product)"
				>
					<c-card-item
						class="w-transfer-destination-list__card"
						:icon="product.icon"
						:title="product.alias"
						:sub-title="$pn(product.productNumber)"
						:accessible-sub-title="
							$t('PRODUCT_NUMBER_ENDED_IN', { productNumber: product.productNumber.value })
						"
						data-testid="product-card-item"
						@click.native="$event.currentTarget.setAttribute('selected', true)"
					/>
				</button>
			</div>
		</transition>

		<transition name="placeholder">
			<c-placeholder-movement v-if="loading && !fetched" />
		</transition>

		<transition name="placeholder">
			<c-placeholder-movement v-if="loading && !fetched" />
		</transition>
	</div>
</template>

<script>
import moveMoneyModule from '@modules/move-money/m-move-money';
import iconsByFamily from '@modules/products/product-icons';
import CCardItem from '@components/c-card-item';
import CPlaceholderMovement from '@components/c-placeholder-movement';
import CIcon from '@components/c-icon';

export default {
	name: 'w-transfer-destination-list',

	modules: {
		'move-money': moveMoneyModule,
	},

	components: {
		CCardItem,
		CPlaceholderMovement,
		CIcon,
	},

	props: {
		exclude: { type: String },
	},

	data() {
		return {
			fetched: false,
			loading: false,
			timerLoading: null,
			error: false,
			products: null,
			selected: null,
		};
	},

	computed: {
		viewProducts({ products, exclude }) {
			/* istanbul ignore next */
			if (!products) {
				return;
			}

			return products
				.map((product) => {
					const icon = iconsByFamily.account;
					const { id, productNumber, alias, beneficiaryName: name } = product;

					return {
						id,
						icon,
						alias,
						productNumber,
						name,
					};
				})
				.filter(({ id }) => id !== exclude);
		},
	},

	created() {
		this.refresh();
	},

	methods: {
		refresh() {
			this.error = false;
			this.fetched = false;

			clearTimeout(this.timerLoading);
			this.timerLoading = setTimeout(() => {
				this.timerLoading = null;
				this.loading = true;
			}, 200);

			this.fetch();
		},

		fetch() {
			const { dispatch } = this.$store;

			return dispatch('move-money/getDestinations')
				.then((data) => {
					this.products = data;
				})
				.catch(() => {
					this.error = true;
				})
				.finally(() => {
					clearTimeout(this.timerLoading);
					this.timerLoading = null;
					this.loading = false;
					this.fetched = true;
				});
		},

		selectProduct(product) {
			this.selected = Boolean(product);
			this.$emit('select', product);
		},
	},
};
</script>

<style lang="scss" scoped>
.w-transfer-destination-list {
	color: RGB(var(--color-text-primary));
	display: flex;
	flex-direction: column;
}

.w-transfer-destination-list.--selected .w-transfer-destination-list__card {
	animation: dissapear 200ms ease forwards;
}

.w-transfer-destination-list.--selected .w-transfer-destination-list__card[selected] {
	animation: matrix 700ms ease forwards;
}

@keyframes dissapear {
	to {
		opacity: 0;
	}
}

@keyframes matrix {
	from {
		opacity: 1;
	}
	70% {
		opacity: 1;
		transform: translateY(0);
	}
	to {
		opacity: 0;
		transform: translateY(-20px);
	}
}

.w-transfer-destination-list__button {
	appearance: none;
	background: transparent;
	border: 0;
	margin: 0;
	padding: 0;
	display: block;
	width: 100%;
	text-align: left;
	position: relative;
	outline: none;
}

.w-transfer-destination-list__card {
	width: 100%;
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

.w-transfer-destination-list__list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	grid-gap: 10px;
}

.w-transfer-destination-list__main {
	flex-grow: 1;
}

.w-transfer-destination-list__main.placeholder-leave-active {
	transform: translateY(0);
	transition: opacity 0s ease-in-out;
	transition-delay: 0ms;
}

.w-transfer-destination-list__list-error {
	text-align: center;
	margin: 10px 0;
}

.w-transfer-destination-list__list-error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}

.w-transfer-destination-list__list-error-link {
	text-decoration: underline;
	display: block;
}
</style>
