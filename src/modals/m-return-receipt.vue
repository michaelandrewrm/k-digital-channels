<template>
	<l-modal class="m-return-receipt" modal>
		<template v-slot:icon>
			<c-icon src="@icons/receipt" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.RETURN_RECEIPT.TITLE') }}
		</template>

		<article v-if="isBancofar" class="m-return-receipt__content">
			<p class="m-return-receipt__desc">{{ $t('INFO.RETURN_RECEIPT.DESC1') }}</p>
			<p class="m-return-receipt__desc text-m-medium">{{ $t('INFO.RETURN_RECEIPT.PATH') }}</p>
			<p class="m-return-receipt__button">
				<c-button data-testid="confirm-button" raised confirm @click="goto({ name: 'sso-rsi' })">
					{{ $t('ACTIONS.EXTENDED_OPERATIVE') }}
				</c-button>
			</p>
		</article>

		<article v-else class="m-return-receipt__content">
			<p class="m-return-receipt__desc">{{ $t('INFO.RETURN_RECEIPT.DESC1') }}</p>
			<p class="m-return-receipt__desc text-m-medium">{{ $t('INFO.RETURN_RECEIPT.PATH') }}</p>
			<p class="m-return-receipt__button">
				<c-button data-testid="confirm-button" raised confirm @click="goto({ name: 'sso-rsi' })">
					{{ $t('ACTIONS.EXTENDED_OPERATIVE') }}
				</c-button>
			</p>
			<div class="m-return-receipt__link">
				<p>{{ $t('INFO.RETURN_RECEIPT.DESC2') }}</p>
				<button
					class="m-return-receipt__link-button text-l-medium"
					data-testid="sirvase"
					@click="
						goto({
							name: 'sirvase-create',
							params: {
								typologyId: '06',
								description: $t('INFO.RETURN_RECEIPT.PRE_DATA.DESC', {
									productNumber,
									movementId,
									receiptId,
								}),
							},
						})
					"
				>
					{{ $t('INFO.PROCEED_SIRVASE_REQUEST') }}
				</button>
			</div>
			<p class="m-return-receipt__desc">{{ $t('INFO.CONTACT_US.DESC') }}</p>
			<c-contact-support-info />
		</article>

		<template v-slot:buttons>
			<a class="m-return-receipt__cancel text-m-medium" href="#" @click.prevent="$emit('close')">
				{{ $t('ACTIONS.CANCEL') }}
			</a>
		</template>
	</l-modal>
</template>

<script>
import { mapState } from 'vuex';
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';
import CContactSupportInfo from '@components/c-contact-support-info';

export default {
	name: 'm-return-receipt',

	components: {
		LModal,
		CButton,
		CIcon,
		CContactSupportInfo,
	},

	props: {
		productNumber: { type: String, default: '' },
		movementId: { type: String, default: '' },
		receiptId: { type: String, default: '' },
	},

	computed: {
		...mapState('app', ['companyId']),

		isBancofar({ companyId }) {
			return companyId === 'BF';
		},
	},

	methods: {
		goto(to) {
			this.$emit('close');
			this.$router.push(to);
		},
	},
};
</script>

<style lang="scss" scoped>
.m-return-receipt__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-return-receipt__desc {
	max-width: 320px;
	margin: 0 auto;
	margin-bottom: 20px;
}

.m-return-receipt__desc:last-of-type {
	margin-bottom: 0;
}

.m-return-receipt__button .button {
	width: 100%;
	max-width: 320px;
	margin-bottom: 20px;
}

.m-return-receipt__link {
	display: flex;
	flex-direction: column;
	padding: 20px;
	margin-bottom: 20px;
	border: 1px solid RGB(var(--color-surface-dark));
}

.m-return-receipt__link button {
	border: none;
	outline: none;
	user-select: none;
	appearance: none;
	background: transparent;
	white-space: nowrap;
	margin-top: 20px;
	text-decoration: underline;
}

.m-return-receipt__cancel {
	margin: 0 auto;
}
</style>
