<template>
	<l-page :loading="loading">
		<h1 slot="header" tabindex="-1">{{ $t('PASSWORD_CHANGE.TITLE') }}</h1>

		<c-operation-success v-if="success" slot="state">
			<template v-slot:title>
				{{ $t('PASSWORD_CHANGE.CONFIRMATION.TITLE') }}
			</template>

			<p class="text-l-book">{{ $t('PASSWORD_CHANGE.CONFIRMATION.DESC') }}</p>

			<c-button raised slot="buttons" data-testid="continue" @click="$router.back()">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</c-operation-success>

		<c-operation-error v-if="error" slot="state" @confirm="$router.back()">
			<template v-slot:title>
				{{ $t('PASSWORD_CHANGE.ERROR.TITLE') }}
			</template>

			<p class="text-l-book">{{ $t('PASSWORD_CHANGE.ERROR.DESC') }}</p>

			<c-button raised slot="buttons" data-testid="continue">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</c-operation-error>

		<w-password-change
			v-if="!success && !error"
			class="v-change-password__widget"
			ref="passwordChangeWidget"
			@valid="isValidNewPassword = $event"
			@submit="submit"
		/>

		<c-button
			slot="buttons"
			data-testid="action-button"
			raised
			:disabled="!isValidNewPassword"
			@click="submit"
		>
			{{ $t('ACTIONS.CHANGE_PWD') }}
		</c-button>
	</l-page>
</template>

<script>
import COperationSuccess from '@components/c-operation-success';
import COperationError from '@components/c-operation-error';
import LPage from '@layouts/l-page';
import CButton from '@components/c-button';
import WPasswordChange from '@widgets/w-password-change';
import { OTP_REQUIRED } from '@modules/service/constants';

export default {
	name: 'v-change-password',

	components: {
		COperationSuccess,
		COperationError,
		CButton,
		LPage,
		WPasswordChange,
	},

	data() {
		return {
			success: false,
			error: false,
			loading: false,
			isValidNewPassword: false,
		};
	},

	methods: {
		submit() {
			const { passwordChangeWidget } = this.$refs;

			this.loading = true;

			const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

			wait(1000).then(() => {
				passwordChangeWidget
					.submit()
					.then(({ status }) => {
						/* istanbul ignore else */
						if (status === 204) {
							passwordChangeWidget.reset();
							this.success = true;
						}
					})
					.catch((err) => {
						/* istanbul ignore else */
						if (err?.response?.data?.errorCode !== OTP_REQUIRED) {
							this.error = true;
						}
					})
					.finally(() => {
						this.loading = false;
					});
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.v-change-password__widget /deep/ .w-password-change__password,
.v-change-password__widget /deep/ .w-password-change__retry-password {
	--background-color: RGB(var(--color-surface-light));
}
</style>
