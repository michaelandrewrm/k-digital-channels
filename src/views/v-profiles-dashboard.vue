<template>
	<l-page>
		<h1 slot="header" tabindex="-1" data-testid="header">{{ $t('PROFILES.TITLE') }}</h1>

		<div
			v-if="!defaultProfile && !profiles.length"
			class="v-profiles-dashboard__error"
			data-testid="error"
		>
			<c-icon class="v-profiles-dashboard__error-icon" src="@icons/modalExclamation" />
			<p class="text-m-book">{{ $t('PROFILES.DASHBOARD.ERROR') }}</p>
		</div>

		<div v-else class="v-profiles-dashboard__content">
			<div class="v-profiles-dashboard__title text-m-medium">
				{{ $t('PROFILES.DASHBOARD.TITLE') }}
			</div>

			<div class="v-profiles-dashboard__desc text-m-book">
				{{ $t('PROFILES.DASHBOARD.DESC') }}
			</div>

			<div class="v-profiles-dashboard__list">
				<transition-group name="fade">
					<div class="v-profiles-dashboard__list-item" v-for="item in profiles" :key="item.id">
						<c-profile-item
							:profile="item"
							:editable="true"
							:is-selected="item.id === profile.id"
							@set-item="setItem(item)"
							@select-item="selectItem(item)"
							@delete-item="deleteItem(item)"
							@edit-item="createItem(item)"
						/>
					</div>
				</transition-group>
			</div>

			<div class="v-profiles-dashboard__reset-list">
				<div class="v-profiles-dashboard__list-item">
					<c-profile-item
						data-testid="profile-reset"
						:profile="{
							name: $t('PROFILES.DASHBOARD.GLOBAL_POSITION_WITHOUT_PROFILES'),
							isDefault: !hasDefaultProfile,
						}"
						:is-selected="!profile.id"
						@set-item="setItem({ id: '', name: '' })"
						@select-item="resetList"
					/>
				</div>
			</div>
		</div>

		<c-button raised slot="buttons" data-testid="submit" @click="createItem">
			{{ $t('ACTIONS.CREATE_NEW_PROFILE') }}
		</c-button>
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import mq from '@utils/matchMedia';
import { onDesktop } from '@theme';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';
import CProfileItem from '@components/c-profile-item';
import LPage from '@layouts/l-page';
import MConfirm from '@modals/m-confirm';

import productsModule from '@modules/products/m-products';

export default {
	name: 'v-profiles-dashboard',

	modules: { products: productsModule },

	components: {
		LPage,
		CButton,
		CIcon,
		CProfileItem,
	},

	data() {
		return {
			profile: { id: '', name: '' },
		};
	},

	computed: {
		...mapState('profiles', ['defaultProfile', 'profiles', 'isWelcome']),

		isDesktop: mq(onDesktop),

		hasDefaultProfile({ profiles }) {
			return profiles?.find(({ isDefault }) => Boolean(isDefault));
		},
	},

	methods: {
		createItem({ id: profileId }) {
			this.$router.push({ name: 'profiles-create', params: { profileId } });
		},

		setItem(profile) {
			this.profile.id = profile?.id;
			const { dispatch } = this.$store;

			if (this.defaultProfile?.id !== profile?.id) {
				dispatch('profiles/setDefaultProfile', profile).then(() => {
					let text = this.$t('INFO.PROFILES.GLOBAL_POSITION_WITHOUT_PROFILES');

					if (profile?.name) {
						let profileName = profile.name;

						/* istanbul ignore next */
						if (profile.name.length > 25) {
							profileName = profile.name?.slice(0, 25)?.concat('...');
						}

						text = this.$t('INFO.PROFILES.SELECT_PROFILE', { profile: profileName });
					}

					dispatch('notification/open', { text });

					if (!this.isDesktop) {
						this.$router.back();
					}
				});
			}
		},

		selectItem(profile) {
			if (!profile?.isDefault) {
				const { dispatch } = this.$store;

				dispatch('profiles/modify', { id: profile.id, isDefault: true })
					.then(() => dispatch('session/deleteCache'))
					.then(() => dispatch('profiles/setLastRequestTimestamp'))
					.then(() => {
						let profileName = profile.name;

						/* istanbul ignore next */
						if (profile.name?.length > 25) {
							profileName = profile.name?.slice(0, 25)?.concat('...');
						}

						dispatch('notification/open', {
							text: this.$t('INFO.PROFILES.SELECT.SUCCESS', { profile: profileName }),
						});

						this.profile.id = profile?.id;
					})
					.catch(() =>
						dispatch('notification/open', {
							text: this.$t('INFO.PROFILES.SELECT.ERROR'),
						})
					);
			}
		},

		async deleteItem({ id, name }) {
			const response = await this.$store.dispatch('modal/open', {
				component: MConfirm,
				props: {
					title: this.$t('INFO.PROFILES.DELETE.TITLE'),
					text: this.$t('INFO.PROFILES.DELETE.DESC'),
				},
			});

			/* istanbul ignore else */
			if (response) {
				const { dispatch } = this.$store;

				dispatch('profiles/delete', id)
					.then(() => dispatch('session/deleteCache'))
					.then(() => dispatch('profiles/setLastRequestTimestamp'))
					.then(() =>
						dispatch('notification/open', {
							text: this.$t('INFO.PROFILES.DELETE.SUCCESS', { profile: name }),
						})
					)
					.catch(() =>
						dispatch('notification/open', {
							text: this.$t('INFO.PROFILES.DELETE.ERROR'),
						})
					);
			}
		},

		resetList() {
			const { hasDefaultProfile } = this;
			/* istanbul ignore else */
			if (hasDefaultProfile) {
				const { dispatch } = this.$store;

				dispatch('profiles/modify', { id: hasDefaultProfile.id, isDefault: false })
					.then(() => dispatch('session/deleteCache'))
					.then(() => dispatch('profiles/setLastRequestTimestamp'))
					.then(() =>
						dispatch('notification/open', {
							text: this.$t('INFO.PROFILES.GLOBAL_POSITION_WITHOUT_PROFILES'),
						})
					)
					.catch(() => {
						dispatch('notification/open', {
							text: this.$t('INFO.PROFILES.UPDATE.ERROR'),
						});
					});
			}
		},
	},

	created() {
		const { isWelcome, profiles, defaultProfile } = this;

		if (defaultProfile) {
			this.profile = { ...this.profile, ...defaultProfile };
		}

		if (!isWelcome && !profiles?.length) {
			this.$router.replace({ name: 'profiles-welcome' });
		}
	},
};
</script>

<style lang="scss" scoped>
.v-profiles-dashboard__content {
	position: relative;
	width: 100%;
	height: 100%;
	margin-top: 20px;
}

.v-profiles-dashboard__title {
	margin-bottom: 10px;
}

.v-profiles-dashboard__error {
	max-width: 320px;
	text-align: center;
	margin: 0 auto;
	padding: 80px 0;
}

.v-profiles-dashboard__error-icon {
	color: RGB(var(--color-accent-secondary));
	font-size: 30px;
	margin-bottom: 10px;
}

.v-profiles-dashboard__list,
.v-profiles-dashboard__reset-list {
	display: flex;
	flex-direction: column;
	width: 100%;
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.v-profiles-dashboard__list {
	padding-top: 15px;
	padding-bottom: 15px;
}

.v-profiles-dashboard__list-item:not(:empty) {
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
