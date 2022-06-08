<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon src="@icons/inputMoney" />
		</template>

		<template v-slot:header>
			{{ $t('PENSION_PLAN.INFO.TITLE') }}
		</template>

		<article>
			<p>
				{{ $t('INFO.UNAVAILABLE_OPERATIVE.DESC') }}
			</p>
			<c-contact-support-info />
			<p class="m-pension-plan-operative__max-pay">{{ $t('PENSION_PLAN.MAX_ANNUAL_PAY') }}</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="confirm-button" @click="accept" raised confirm>
				{{ $t('ACTIONS.GO_TO_VIEW', { view: $t('LEGACY_WEB') }) }}
			</c-button>

			<a class="inline-button text-m-medium" href="#" @click.prevent="$emit('close')">
				{{ $t('ACTIONS.CANCEL') }}
			</a>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';
import CContactSupportInfo from '@components/c-contact-support-info';

export default {
	name: 'm-pension-plan-operative',

	components: {
		LModal,
		CButton,
		CIcon,
		CContactSupportInfo,
	},

	methods: {
		accept() {
			this.$emit('close');
			this.$router.push({ name: 'legacy-web', meta: { transition: 'fade' } });
		},
	},
};
</script>

<style lang="scss" scoped>
article {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-pension-plan-operative__max-pay {
	padding-top: 20px;
}

.inline-button {
	flex-basis: auto;
	width: 100%;
	margin-top: 10px;
}
</style>
