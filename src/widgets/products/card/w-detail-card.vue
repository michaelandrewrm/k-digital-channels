<template>
	<div class="w-detail-card">
		<div class="w-detail-card__image" :style="{ 'background-image': 'url(' + productImage + ')' }">
			<div class="w-detail-card__image-one"></div>
			<div class="w-detail-card__image-two"></div>
			<div class="w-detail-card__image-three"></div>
		</div>
		<div class="w-detail-card__group">
			<c-list-icon-item
				v-if="detail.productNumber"
				:title="$t('DETAIL.CARD_NUMBER')"
				icon="@icons/card"
			>
				<span class="w-detail-card__pan">
					<span data-testid="detail-secret-pan">{{ pan }}</span>
					<c-icon-button
						v-if="!validatedPan && !isEmbedded"
						icon="@icons/eyeSlash"
						mini
						data-testid="request-pan-button"
						@click="requestPan"
					/>
				</span>
			</c-list-icon-item>

			<c-list-icon-item :title="$t('DETAIL.EXPIRED_DATE_CVV')" icon="@icons/paper">
				<span class="w-detail-card__expired-date-cvv">
					<span data-testid="detail-secret-expiration-date">{{ expirationDate }}</span>
					<span data-testid="detail-secret-cvv">{{ cvv }}</span>
					<c-icon-button
						v-if="!validatedCvv && !isEmbedded"
						icon="@icons/eyeSlash"
						mini
						data-testid="request-cvv-button"
						@click="requestCVV"
					/>
				</span>
			</c-list-icon-item>

			<c-list-icon-item :title="$t('DETAIL.PIN')" icon="@icons/paper">
				<span class="w-detail-card__pin">
					<span data-testid="detail-secret-pin">{{ pin }}</span>
					<c-icon-button
						v-if="!validatedPin && !isEmbedded"
						icon="@icons/eyeSlash"
						mini
						data-testid="request-pin-button"
						@click="requestPIN"
					/>
				</span>
			</c-list-icon-item>

			<c-list-icon-item
				v-if="detail.chargeAccount && detail.chargeAccount.productNumber"
				:title="$t('DETAIL.ASSOCIATED_ACCOUNT')"
				:description="$pn(detail.chargeAccount.productNumber, 'format')"
				icon="@icons/wallet"
				data-testid="detail-card-account"
			>
				<div>
					<p>{{ chargeAccountName }}</p>
					<span>{{ $pn(detail.chargeAccount.productNumber, 'obfuscate') }}</span>
				</div>
			</c-list-icon-item>
		</div>

		<div class="w-detail-card__group">
			<c-list-icon-item
				v-if="detail.openingDate"
				:title="$t('DETAIL.DATE_APERTURE')"
				:description="$d(new Date(detail.openingDate), 'numeric')"
				icon="@icons/calendar"
				data-testid="detail-opening-date"
			/>

			<c-list-icon-item
				v-if="detail.lastUseDate"
				:title="$t('DETAIL.DATE_LAST_MOVEMENT')"
				:description="$d(new Date(detail.lastUseDate), 'numeric')"
				icon="@icons/calendarTime"
				data-testid="detail-last-use-date"
			/>
		</div>

		<div
			v-if="detail"
			class="w-detail-card__group"
			data-testid="profiles"
			@click="
				$router.push({
					name: 'product-profiles',
					params: { familyId: detail.productFamily, productId: detail.productId },
				})
			"
		>
			<c-list-icon-item
				class="w-detail-card__profiles"
				:title="this.$t('DETAIL.PROFILES.PROFILE')"
				:description="profilesDescription"
				icon="@icons/interveners"
				actionable
			>
				<ul class="w-detail-card__profiles-list">
					<li v-for="(description, id) in profilesDescription" :key="id">
						{{ description }}
					</li>
				</ul>
			</c-list-icon-item>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import productsModule from '@modules/products/m-products';
import CIconButton from '@components/c-icon-button';
import CListIconItem from '@components/c-list-icon-item';
import getProductImage from '@modules/products/product-image';

export default {
	name: 'w-detail-card',

	components: { CListIconItem, CIconButton },

	modules: {
		products: productsModule,
	},

	props: { detail: Object },

	data() {
		return {
			validatedCvv: false,
			validatedPin: false,
			validatedPan: false,
			chargeAccountName: '',
		};
	},

	watch: {
		'detail.chargeAccount.id': {
			immediate: true,
			handler(id) {
				/* istanbul ignore else */
				if (id) {
					this.$store
						.dispatch('products/get', id)
						.then((product) => {
							this.chargeAccountName = product.name;
						})
						.catch(() => {});
				}
			},
		},
	},

	computed: {
		...mapState('app', ['companyId']),
		...mapState('authn', ['isEmbedded']),

		/* istanbul ignore next */
		profilesDescription({ detail }) {
			if (!detail?.profiles?.length) {
				return [this.$t('DETAIL.PROFILES.NO_PROFILE')];
			}

			return detail?.profiles?.map(({ name }) => name);
		},

		pan({ detail, validatedPan }) {
			const action = validatedPan ? 'format' : 'obfuscated-pan';
			return this.$pn(detail.productNumber, action);
		},

		expirationDate({ detail, validatedCvv }) {
			const parts = detail.expirationDate.split('-');
			return validatedCvv ? `${parts[1]} / ${parts[0]}` : '• • / • •';
		},

		cvv({ detail, validatedCvv }) {
			return validatedCvv ? detail.cvv : '• • •';
		},

		pin({ detail, validatedPin }) {
			return validatedPin ? detail.pin : '• • • •';
		},

		productImage({ detail }) {
			return getProductImage(detail);
		},

		isBancofar({ companyId }) {
			return companyId === 'BF';
		},
	},

	methods: {
		requestCVV() {
			this.$store.dispatch('products/getCardCVV', { productId: this.detail.id }).then((cvv) => {
				this.validatedCvv = true;
				this.detail.cvv = cvv;
			});
		},

		requestPIN() {
			this.$store.dispatch('products/getCardPIN', { productId: this.detail.id }).then((pin) => {
				this.validatedPin = true;
				this.detail.pin = pin;
			});
		},

		requestPan() {
			this.$store.dispatch('products/getCardPAN', { productId: this.detail.id }).then((pan) => {
				this.validatedPan = true;
				this.detail.productNumber.value = pan;
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.w-detail-card__group {
	border-top: 1px solid RGBA(var(--color-primary-surface), 0.2);
	padding: 20px;
	--c-list-icon-item-icon-color: #{RGB(var(--color-text-secondary-light))};
}

.w-detail-card__group:empty {
	display: none;
}

.w-detail-card__group > *:not(:last-child) {
	margin-bottom: 15px;
}

.w-detail-card__group:last-of-type:not(:first-of-type) {
	border-bottom: 1px solid RGBA(var(--color-primary-surface), 0.2);
}

.w-detail-card__profiles-list {
	padding-right: 30px;
	overflow: hidden;
}

.w-detail-card__profiles-list li:not(:last-child):after {
	content: ',';
	margin-right: 5px;
}

.w-detail-card__profiles-list li {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.w-detail-card__image {
	width: 76px;
	height: 45px;
	background-size: contain;
	background-repeat: no-repeat;
	margin: 0 auto 20px;
	position: relative;
}

.w-detail-card__image-one {
	width: 36px;
	height: 4px;
	border-radius: 1px;
	position: absolute;
	background: rgba(255, 255, 255, 0.8);
	left: 8px;
	top: 8px;
}

.w-detail-card__image-two {
	width: 28px;
	height: 6px;
	border-radius: 1px;
	position: absolute;
	background: white;
	left: 8px;
	top: 22px;
}

.w-detail-card__image-three {
	width: 36px;
	height: 2px;
	border-radius: 1px;
	position: absolute;
	background: rgba(255, 255, 255, 0.8);
	left: 8px;
	bottom: 6px;
}

.w-detail-card__pin,
.w-detail-card__expired-date-cvv,
.w-detail-card__pan {
	display: flex;
	align-items: center;

	& > :not(:first-child) {
		margin-left: 10px;
	}
}
</style>
