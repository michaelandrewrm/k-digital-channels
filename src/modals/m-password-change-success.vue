<template>
	<l-modal>
		<template v-slot:icon>
			<span class="m-password-change-success__check-icon">
				<c-icon src="@icons/check" />
			</span>
		</template>
		<template v-slot:header>
			{{ $t('PASSWORD_CHANGE.CONFIRMATION.TITLE') }}
		</template>

		<article class="m-password-change-success">
			<p class="m-password-change-confirmation__desc">
				{{ $t('PASSWORD_CHANGE.CONFIRMATION.DESC') }}
			</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="goto" raised @click.prevent="$emit('close')">
				{{
					isConfirm
						? $t('ACTIONS.ACCEPT')
						: $t('ACTIONS.GO_TO_VIEW', { view: $t('GLOBAL_POSITION') })
				}}
			</c-button>
		</template>
	</l-modal>
</template>

<script>
import CIcon from '@components/c-icon';
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';

export default {
	name: 'm-password-change-success',

	components: {
		CIcon,
		LModal,
		CButton,
	},

	props: {
		isConfirm: Boolean,
	},
};
</script>

<style lang="scss" scoped>
.m-password-change-success {
	display: flex;
	min-height: 120px;
	margin: 0 auto;
	flex-direction: column;
	color: RGB(var(--color-text-primary));
	padding: 1px;
	&__check-icon {
		svg {
			height: 56px;
			margin-bottom: 20px;
		}
	}
	&__desc {
		margin-bottom: 30px;
		@extend %typo-m-book;
	}
}
</style>
