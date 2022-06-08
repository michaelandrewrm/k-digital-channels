<template>
	<l-page :loading="loading">
		<h1 slot="header" tabindex="-1" data-testid="header">{{ $t('PROFILES.TITLE') }}</h1>

		<c-operation-success v-if="success" slot="state">
			<template v-slot:title>
				{{ successTitle }}
			</template>

			<p class="text-m-book">{{ successDesc }}</p>

			<c-button raised slot="buttons" data-testid="continue" @click="$router.back()">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</c-operation-success>

		<c-operation-error v-if="error" slot="state" contactUs @confirm="$router.back()">
			<template v-slot:title>
				{{ errorTitle }}
			</template>

			<p class="text-m-book">{{ errorDesc }}</p>

			<c-button raised slot="buttons" data-testid="continue">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</c-operation-error>

		<div class="v-profiles-create__content">
			<div class="v-profiles-create__profile-name">
				<c-transfer-field
					id="v-profiles-create__profile-name"
					:placeholder="$t('PROFILES.CREATE.PROFILE_NAME_PLACEHOLDER')"
					v-model.trim="profileName"
					maxlength="40"
					:valid="!validations.profileName.error"
					@input="validationState.profileName.dirty = true"
					@keydown.enter="submit"
					data-testid="profile-name"
				>
					<label
						for="v-profiles-create__profile-name"
						class="v-profiles-create__profile-name-label text-m-medium"
					>
						{{ $t('PROFILES.CREATE.PROFILE_NAME') }}
					</label>
				</c-transfer-field>
				<c-transfer-field-helper-text
					v-if="validations.profileName.error && validations.profileName.required"
					for="v-profiles-create__profile-name"
				>
					{{ $t('PROFILES.CREATE.NAME.REQUIRED_ERROR') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					v-else-if="validations.profileName.error && !validations.profileName.validCharacters"
					for="v-profiles-create__profile-name"
				>
					{{ $t('PROFILES.CREATE.NAME.CHARACTER_ERROR') }}
				</c-transfer-field-helper-text>
			</div>
			<div class="v-profiles-create__products">
				<div class="v-profiles-create__products-title text-m-medium">
					{{ $t('PROFILES.CREATE.PRODUCTS.TITLE') }}
				</div>
				<div class="v-profiles-create__products-desc text-m-book">
					{{ $t('PROFILES.CREATE.PRODUCTS.DESC') }}
				</div>
				<div class="v-profiles-create__products-list">
					<div class="v-profiles-create__wrapper" v-for="group in productsGroup" :key="group.id">
						<ul :id="group.id" class="v-profiles-create__list">
							<li class="v-profiles-create__list-title text-m-medium">
								<c-checkbox
									class="v-profiles-create__list-title-checkbox"
									v-model="group.selected"
									@change="toggleGroup(group)"
								/>
								<div>{{ group.title }}</div>
							</li>
							<li
								class="v-profiles-create__list-item"
								v-for="item in group.products"
								:key="item.id"
							>
								<c-profile-product
									v-model="item.selected"
									:id="item.id"
									:title="item.title"
									:subtitle="item.subtitle"
									:info="item.info"
									:subinfo="item.subinfo"
									@select-item="toggleItem(group, item)"
								/>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<w-actions v-if="Object.keys(productsGroup).length" :options="actionOptions" slot="buttons" />
	</l-page>
</template>

<script>
import { intervenersById } from '@modules/products/product-interveners';
import LPage from '@layouts/l-page';
import CButton from '@components/c-button';
import CTransferField from '@components/c-transfer-field';
import CTransferFieldHelperText from '@components/c-transfer-field-helper-text';
import COperationError from '@components/c-operation-error';
import COperationSuccess from '@components/c-operation-success';
import CProfileProduct from '@components/c-profile-product';
import CCheckbox from '@components/c-checkbox';
import WActions from '@widgets/w-actions';
import MConfirm from '@modals/m-confirm';
import productsModule from '@modules/products/m-products';

import iconFlag from '@icons/flag';
import iconTrash from '@icons/trash';
import iconCheckCircle from '@icons/checkCircle';

export default {
	name: 'v-profiles-create',

	modules: {
		products: productsModule,
	},

	components: {
		LPage,
		CButton,
		CTransferField,
		CTransferFieldHelperText,
		COperationError,
		COperationSuccess,
		CCheckbox,
		CProfileProduct,
		WActions,
	},

	props: { profileId: String },

	data() {
		return {
			success: false,
			error: false,
			loading: false,
			products: [],
			productsGroup: {},
			profileName: '',
			lastProfileName: '',
			isDefault: false,
			productIds: [],
			lastProductIds: [],
			validationState: { profileName: { dirty: false } },
			successTitle: '',
			successDesc: '',
			errorTitle: '',
			isProductIdsUpdated: false,
		};
	},

	computed: {
		assessment({ profileName }) {
			return {
				profileName: {
					required: !profileName,
					validCharacters: Boolean(
						profileName && profileName.match(/^[0-9A-Z\s-/¿?:().,'+ºª\u00C0-\u00FF]*$/i)
					),
				},
			};
		},

		validations({ assessment, validationState }) {
			const { dirty } = validationState.profileName;
			const { required, validCharacters } = assessment.profileName;
			const valid = !required && validCharacters;
			const error = !valid && dirty;

			return { profileName: { required, validCharacters, valid, error, dirty } };
		},

		disableAction({ profileName, lastProfileName, isProductIdsUpdated }) {
			const isProfileNameUpdated = Boolean(profileName && profileName !== lastProfileName);
			const hasUpdate = isProfileNameUpdated || isProductIdsUpdated;
			return !hasUpdate;
		},

		actionOptions({ disableAction, lastProfileName, profileId }) {
			if (lastProfileName && profileId) {
				return [
					{
						id: 'update-profile',
						title: this.$t('ACTIONS.ACCEPT'),
						icon: iconCheckCircle,
						action: this.submit,
						hidden: true,
						disabled: disableAction,
					},
					{
						id: 'delete-profile',
						title: this.$t('ACTIONS.DELETE_PROFILE'),
						icon: iconTrash,
						action: this.deleteProfile,
					},
					{
						id: 'set-profile',
						title: this.$t('ACTIONS.SET_PROFILE'),
						icon: iconFlag,
						action: this.setProfile,
						hidden: this.isDefault,
					},
				];
			}

			return [
				{
					id: 'create-profile',
					title: this.$t('ACTIONS.CREATE_PROFILE'),
					action: this.submit,
					disabled: disableAction,
				},
			];
		},
	},

	methods: {
		submit() {
			this.validationState.profileName.dirty = true;

			if (this.validations.profileName.error) {
				return;
			}

			this.loading = true;

			const { profileId: id, lastProfileName, profileName, isDefault, productIds } = this;
			const action = lastProfileName ? 'profiles/update' : 'profiles/create';
			const actionType = lastProfileName ? 'EDIT' : 'CREATE';
			this.successTitle = this.$t(`PROFILES.${actionType}.SUCCESS.TITLE`);
			this.successDesc = this.$t(`PROFILES.${actionType}.SUCCESS.DESC`);
			this.errorTitle = this.$t(`PROFILES.${actionType}.ERROR.TITLE`);
			this.errorDesc = this.$t(`PROFILES.${actionType}.ERROR.DESC`);

			const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
			const { dispatch } = this.$store;

			wait(1000).then(() =>
				dispatch(action, {
					id,
					name: profileName,
					isDefault,
					productIds,
				})
					.then(() => dispatch('session/deleteCache'))
					.then(() => {
						this.success = true;

						return dispatch('profiles/setLastRequestTimestamp');
					})
					.catch(() => {
						this.error = true;
					})
					.finally(() => {
						this.loading = false;
					})
			);
		},

		async deleteProfile() {
			this.successTitle = this.$t('PROFILES.DELETE.SUCCESS.TITLE');
			this.successDesc = this.$t('PROFILES.DELETE.SUCCESS.DESC');
			this.errorTitle = this.$t('PROFILES.DELETE.ERROR.TITLE');
			this.errorDesc = this.$t('PROFILES.ERROR.DESC');

			const response = await this.$store.dispatch('modal/open', {
				component: MConfirm,
				props: {
					title: this.$t('INFO.PROFILES.DELETE.TITLE'),
					text: this.$t('INFO.PROFILES.DELETE.DESC'),
				},
			});

			/* istanbul ignore else */
			if (response) {
				this.loading = true;

				const { profileId } = this;
				const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
				const { dispatch } = this.$store;

				wait(1000).then(() =>
					dispatch('profiles/delete', profileId)
						.then(() => dispatch('session/deleteCache'))
						.then(() => {
							this.success = true;

							return this.$store.dispatch('profiles/setLastRequestTimestamp');
						})
						.catch(() => {
							this.error = true;
						})
						.finally(() => {
							this.loading = false;
						})
				);
			}
		},

		setProfile() {
			if (this.validations.profileName.error) {
				return;
			}

			const { profileId: id, profileName } = this;
			const { dispatch } = this.$store;

			dispatch('profiles/modify', { id, isDefault: true })
				.then(() => dispatch('session/deleteCache'))
				.then(() => dispatch('profiles/setLastRequestTimestamp'))
				.then(() => {
					this.isDefault = true;

					dispatch('notification/open', {
						text: this.$t('INFO.PROFILES.SELECT.SUCCESS', { profile: profileName }),
					});
				})
				.catch(() =>
					dispatch('notification/open', {
						text: this.$t('INFO.PROFILES.SELECT.ERROR'),
					})
				);
		},

		getManagedProductsIds(id) {
			return this.products
				.filter(({ parentId }) => parentId === id)
				.map(({ id: itemId }) => itemId);
		},

		/* istanbul ignore next */
		toggleGroup({ id, selected, products }) {
			this.productsGroup[id].products = products.map((item) => ({ ...item, selected }));
			let productIds = products.map(({ id: productId }) => productId);

			if (['managed-rsi-portfolio', 'managed-portfolio'].includes(id)) {
				productIds.forEach((productId) => {
					const managedProductsIds = this.getManagedProductsIds(productId);
					productIds = productIds.concat(managedProductsIds);
				});
			}

			if (selected) {
				return this.addProductIds(productIds);
			}

			this.deleteProductIds(productIds);
		},

		/* istanbul ignore next */
		toggleItem(group, item) {
			this.productsGroup[group.id].selected = group.products.every(({ selected }) => selected);
			let productIds = [item.id];

			if (['managed-rsi-portfolio', 'managed-portfolio'].includes(group.id)) {
				const managedProductsIds = this.getManagedProductsIds(item.id);
				productIds = productIds.concat(managedProductsIds);
			}

			if (item.selected) {
				return this.addProductIds(productIds);
			}

			this.deleteProductIds(productIds);
		},

		addProductIds(ids) {
			this.productIds = this.productIds.concat(ids.filter((id) => !this.productIds.includes(id)));
		},

		deleteProductIds(ids) {
			this.productIds = this.productIds.filter((id) => !ids.includes(id));
		},

		categorizeProducts(products) {
			return products.reduce((reducer, item) => {
				const { productFamily, balance, parentId } = item;

				/* istanbul ignore else */
				if (!parentId) {
					const splitFamily = productFamily?.split('-');
					const currency = balance?.currency?.id === 'UNDEFINED' ? 'EUR' : balance?.currency?.id;
					const typeName =
						currency && currency !== 'EUR'
							? `currency-${currency.toLowerCase()}-${splitFamily[splitFamily.length - 1]}`
							: productFamily;

					if (!reducer[typeName]) {
						// eslint-disable-next-line no-param-reassign
						reducer[typeName] = [];
					}

					reducer[typeName].push(item);
				}

				return reducer;
			}, {});
		},

		createProductsView(products) {
			let currency;
			const group = products.map(
				({
					id,
					alias,
					productSubtype,
					productNumber,
					balance,
					postedBalance,
					relationType,
					productFamily,
				}) => {
					currency = balance?.currency?.id?.toLowerCase();
					const isCreditCard = productFamily === 'credit-card';
					const isLoan = productFamily === 'loan';
					const title = alias || /* istanbul ignore next */ productSubtype?.name;
					const subtitle = this.$pn(productNumber);
					const info = isCreditCard /* istanbul ignore next */
						? this.$nc(postedBalance)
						: this.$nc(balance, { absolute: isLoan });
					const relationTypeName = intervenersById[(relationType?.id)];
					const subinfo = relationTypeName
						? this.$tc(`PROFILES.CREATE.PRODUCTS.${relationTypeName.toUpperCase()}`, 1)
						: '';
					const isSelected = this.lastProductIds?.includes(id);

					return { id, title, subtitle, info, subinfo, selected: isSelected };
				}
			);

			return { currency, group };
		},
	},

	watch: {
		productIds: {
			deep: true,
			handler(productIds) {
				const sameLength = productIds.length === this.lastProductIds.length;
				this.isProductIdsUpdated = !sameLength;

				/* istanbul ignore else */
				if (sameLength) {
					const sameIds = this.lastProductIds.every((id) => productIds.includes(id));
					this.isProductIdsUpdated = !sameIds;
				}
			},
		},

		profileId: {
			immediate: true,
			async handler(profileId) {
				this.products = await this.$store.dispatch('products/fetch', { force: true });

				if (profileId) {
					const profile = await this.$store.dispatch('profiles/getProfile', profileId);

					this.isDefault = profile?.isDefault;
					this.lastProfileName = profile?.name;
					this.profileName = profile?.name;
					const productIds = this.products
						.filter(({ profiles }) => profiles?.find(({ id }) => id === profileId))
						.map(({ id }) => id);
					this.lastProductIds = productIds;
					this.productIds = productIds;
				}

				const categories = this.categorizeProducts(this.products);

				Object.entries(categories).forEach(([type, items]) => {
					const { currency, group } = this.createProductsView(items);
					const typeName = currency !== 'eur' ? type.split(`-${currency}-`).join('-') : type;
					const { length } = items;
					const title = this.$tc(`MY_PRODUCT.${typeName.toUpperCase()}`, length, { currency });

					this.$set(this.productsGroup, typeName, {
						id: typeName,
						title,
						products: group,
						selected: group?.every(({ selected }) => selected),
					});
				});
			},
		},
	},

	created() {
		this.$store.dispatch('profiles/setWelcome');
	},
};
</script>

<style lang="scss" scoped>
.v-profiles-create__profile-name {
	padding-top: 20px;
	padding-bottom: 20px;
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.v-profiles-create__profile-name-label,
.v-profiles-create__products-title {
	margin-bottom: 10px;
}

.v-profiles-create__wrapper {
	margin-bottom: 40px;
}

.v-profiles-create__list-item {
	margin-bottom: 10px;
}

.v-profiles-create__list-title {
	display: flex;
	margin-bottom: 20px;
}

.v-profiles-create__list-title-checkbox {
	--c-checkbox-color: var(--color-text-primary);
}

.v-profiles-create__products {
	margin-top: 20px;
}

.v-profiles-create__products-desc {
	margin-bottom: 30px;
}
</style>
