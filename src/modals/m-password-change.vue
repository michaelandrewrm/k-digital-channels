<template>
	<l-modal modal>
		<template v-slot:header>
			{{ $t('PASSWORD_CHANGE.TITLE') }}
		</template>

		<article class="m-password-change">
			<p class="m-password-change__desc">{{ $t('PASSWORD_CHANGE.DESC') }}</p>

			<w-password-change
				ref="passwordChangeWidget"
				class="m-password-change__widget"
				@valid="isValidNewPassword = $event"
				@submit="submit"
			/>
		</article>

		<template v-slot:buttons>
			<c-button :disabled="!isValidNewPassword" raised @click="submit">
				{{ $t('ACTIONS.CHANGE_PWD') }}
			</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import WPasswordChange from '@widgets/w-password-change';
import MPasswordChangeSuccess from '@modals/m-password-change-success';

export default {
	name: 'm-password-change',

	data() {
		return {
			value: false,
			isValidNewPassword: false,
		};
	},

	components: {
		LModal,
		CButton,
		WPasswordChange,
	},

	methods: {
		async submit() {
			this.$refs.passwordChangeWidget
				.submit()
				.then(async (response) => {
					/* istanbul ignore else */
					if (response) {
						await this.$store.dispatch('modal/open', MPasswordChangeSuccess);

						this.value = true;
						this.$emit('close');
					}
				})
				.catch((error) => {
					this.value = error;
					this.$emit('close');
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.m-password-change {
	color: RGB(var(--color-text-primary));
	display: flex;
	min-height: 120px;
	margin: 0 auto;
	flex-direction: column;
}

.m-password-change__widget /deep/ .w-password-change__password,
.m-password-change__widget /deep/ .w-password-change__retry-password {
	--background-color: RGB(var(--color-surface));
}
</style>
