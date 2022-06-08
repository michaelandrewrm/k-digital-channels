<template>
	<l-page>
		<h1 slot="header" tabindex="-1" data-testid="header">{{ $t('PROFILES.TITLE') }}</h1>

		<div v-if="!profiles.length" class="v-product-profiles__error" data-testid="error">
			<c-icon class="v-product-profiles__error-icon" src="@icons/modalExclamation" />
			<p class="text-m-book">{{ $t('PROFILES.ASSIGN.ERROR') }}</p>
		</div>

		<div v-else class="v-product-profiles__content">
			<div class="v-product-profiles__title text-m-medium">
				{{ $t('PROFILES.ASSIGN.TITLE') }}
			</div>

			<div class="v-product-profiles__desc text-m-book">{{ $t('PROFILES.ASSIGN.DESC') }}</div>

			<div class="v-product-profiles__list">
				<transition-group name="fade">
					<div class="v-product-profiles__list-item" v-for="item in profilesGroup" :key="item.id">
						<c-profile-product-item
							:id="item.id"
							v-model="item.isSelected"
							:title="item.name"
							@select-item="selectProfile(item)"
						/>
					</div>
				</transition-group>
			</div>
		</div>

		<w-actions :options="actionOptions" slot="buttons" />
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import LPage from '@layouts/l-page';
import CProfileProductItem from '@components/c-profile-product-item';
import CIcon from '@components/c-icon';
import WActions from '@widgets/w-actions';
import iconPlus from '@icons/cross';

export default {
	name: 'v-product-profiles',

	props: { productId: String },

	components: { LPage, CProfileProductItem, CIcon, WActions },

	data() {
		return {
			profilesGroup: [],
			product: null,
			updatedProfiles: [],
		};
	},

	computed: {
		...mapState('profiles', ['profiles', 'isWelcome']),

		actionOptions({ hasChanged, isWelcome, profiles }) {
			if (!isWelcome && !profiles.length) {
				return [
					{
						id: 'create-profile',
						title: this.$t('ACTIONS.CREATE_NEW_PROFILE'),
						action: () => this.$router.push({ name: 'profiles-create' }),
					},
				];
			}

			return [
				{
					id: 'update-profile',
					title: this.$t('ACTIONS.ACCEPT'),
					action: this.updateProfile,
					disabled: !hasChanged,
					hidden: true,
				},
				{
					id: 'create-profile',
					icon: iconPlus,
					title: this.$t('ACTIONS.CREATE_NEW_PROFILE'),
					action: () => this.$router.push({ name: 'profiles-create' }),
				},
			];
		},

		hasChanged({ updatedProfiles }) {
			return updatedProfiles?.length > 0;
		},
	},

	watch: {
		productId: {
			immediate: true,
			async handler(productId) {
				/* istanbul ignore else */
				if (productId) {
					this.product = await this.$store.dispatch('products/get', productId);
					const productProfiles = this.product.profiles /* istanbul ignore next */ || [];
					this.profilesGroup = this.profiles.map((item) => {
						const isSelected = productProfiles.some(({ id }) => id === item?.id);

						return { ...item, isSelected, isProduct: isSelected };
					});
				}
			},
		},
	},

	methods: {
		updateProfile() {
			const { updatedProfiles, productId } = this;
			const { dispatch } = this.$store;
			const promises = updatedProfiles.map(({ id, name, isDefault, productIds }) => {
				return dispatch('profiles/modify', {
					id,
					name,
					isDefault,
					productIds,
				})
					.then(() => name)
					.catch(() => Promise.reject(name));
			});
			Promise.allSettled(promises)
				.then((res) => {
					res.forEach(({ status, value, reason }) => {
						let profileName = value || reason;

						/* istanbul ignore next */
						if (profileName.length > 25) {
							profileName = profileName?.slice(0, 25)?.concat('...');
						}

						if (status === 'fulfilled') {
							dispatch('notification/open', {
								text: this.$t('INFO.PROFILES.PRODUCT.UPDATE.SUCCESS', { profile: profileName }),
							});
						} else {
							dispatch('notification/open', {
								text: this.$t('INFO.PROFILES.PRODUCT.UPDATE.ERROR', { profile: reason }),
							});
						}
					});
				})
				.then(() => dispatch('session/deleteCache'))
				.then(() => dispatch('profiles/setLastRequestTimestamp'))
				.then(() => dispatch('products/get', productId))
				.then(() => this.$router.back())
				.catch(() => {
					window.history.pushState({}, '', this.$router.resolve({ name: 'login' }).href);
					this.$router.push({ name: 'global' });
				});
		},

		selectProfile(profile) {
			const { isSelected, isProduct } = profile;
			this.updatedProfiles = this.updatedProfiles.filter(({ id }) => id !== profile.id);

			if (!isSelected && isProduct) {
				this.updatedProfiles.push({ ...profile, productIds: { [this.productId]: 'delete' } });
			}

			/* istanbul ignore else */
			if (isSelected && !isProduct) {
				this.updatedProfiles.push({ ...profile, productIds: { [this.productId]: 'add' } });
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.v-product-profiles__error {
	max-width: 320px;
	text-align: center;
	margin: 0 auto;
	padding: 80px 0;
}

.v-product-profiles__error-icon {
	color: RGB(var(--color-accent-secondary));
	font-size: 30px;
	margin-bottom: 10px;
}

.v-product-profiles__content {
	position: relative;
	width: 100%;
	height: 100%;
	margin-top: 20px;
}

.v-product-profiles__title {
	margin-bottom: 10px;
}

.v-product-profiles__list {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.v-product-profiles__list {
	padding-top: 15px;
	padding-bottom: 15px;
}

.v-product-profiles__list-item:not(:empty) {
	display: flex;
	width: 100%;
	padding-top: 15px;
	padding-bottom: 15px;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 250ms;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
