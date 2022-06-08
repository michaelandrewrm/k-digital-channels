<template>
	<l-view-modal @close="$router.back()">
		<transition name="placeholder">
			<template v-if="loading">
				<c-placeholder-detail class="v-personal-details__placeholder" />
			</template>
		</transition>

		<transition name="content" slot="header">
			<span data-testid="detail-title" class="text-m-bold" v-if="!loading && detail">
				{{ $t('PERSONAL_AREA.MY_PERSONAL_DETAILS') }}
			</span>
		</transition>

		<transition name="content">
			<div v-if="!loading && detail">
				<div class="v-personal-details__block">
					<h2 data-testid="full-name" class="v-personal-details__block-title text-m-bold">
						{{ `${detail.name} ${detail.surname1} ${detail.surname2}` }}
					</h2>
					<span class="v-personal-details__block-line" />
					<div class="v-personal-details__block-content">
						<c-list-icon-item
							data-testid="birthdate"
							class="v-personal-details__item"
							v-if="detail.birthdate"
							:title="$t('PERSONAL_AREA.BIRTHDATE')"
							:description="detail.birthdate"
						/>
					</div>
				</div>
				<div class="v-personal-details__block">
					<h2 class="v-personal-details__block-title text-m-bold">
						{{ $t('PERSONAL_AREA.MY_PERSONAL_DETAILS') }}
					</h2>
					<span class="v-personal-details__block-line" />
					<div class="v-personal-details__block-content">
						<c-list-icon-item
							data-testid="email"
							class="v-personal-details__item"
							v-if="detail.email"
							:title="$t('PERSONAL_AREA.EMAIL')"
							:description="detail.email"
						/>
						<c-list-icon-item
							data-testid="phone"
							class="v-personal-details__item"
							v-if="phoneNumber"
							:title="$t('PERSONAL_AREA.TELEPHONE')"
							:description="phoneNumber"
						/>
					</div>
				</div>
			</div>
		</transition>
	</l-view-modal>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';
import CPlaceholderDetail from '@components/c-placeholder-detail';
import LViewModal from '@layouts/l-view-modal';

export default {
	name: 'v-personal-details',

	data() {
		return {
			detail: null,
			loading: false,
			timerLoading: null,
			error: false,
		};
	},

	components: {
		CListIconItem,
		CPlaceholderDetail,
		LViewModal,
	},

	computed: {
		phoneNumber({ detail }) {
			const { phonePrefix = '', phone } = detail;
			return `${phonePrefix} ${phone}`;
		},
	},

	mounted() {
		this.error = false;

		clearTimeout(this.timerLoading);
		this.timerLoading = setTimeout(() => {
			this.timerLoading = null;
			this.loading = true;
		}, 200);

		this.$store
			.dispatch('user/getPersonalDetails')
			.then(({ data }) => {
				if (!data) {
					return this.$router.back();
				}

				this.detail = data;
			})
			.catch(() => {
				this.error = true;
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
.v-personal-details__block {
	padding-top: 30px;
}

.v-personal-details__block-title {
	padding-bottom: 10px;
}

.v-personal-details__block-line {
	display: block;
	border-bottom: 1px solid RGBA(var(--color-dark-surface), 0.2);
}

.v-personal-details__item {
	padding-top: 20px;
	padding-left: 20px;
}

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

.v-personal-details__placeholder {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 36px;
	left: 0;
}
</style>
