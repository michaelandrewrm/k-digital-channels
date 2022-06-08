<template>
	<l-modal class="m-request-statement" modal>
		<template v-slot:icon>
			<c-icon src="@icons/receipt" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.REQUEST_STATEMENT.TITLE') }}
		</template>

		<article v-if="isBancofar">
			<p>{{ $t('INFO.UNAVAILABLE_OPERATIVE.DESC') }}</p>
			<c-contact-support-info />
		</article>

		<article v-else class="m-request-statement__content">
			<p class="m-request-statement__desc">{{ $t('INFO.REQUEST_STATEMENT.DESC1') }}</p>
			<p class="m-request-statement__desc text-m-medium">{{ $t('INFO.REQUEST_STATEMENT.PATH') }}</p>
			<p class="m-request-statement__button">
				<c-button data-testid="confirm-button" raised confirm @click="goto({ name: 'sso-rsi' })">
					{{ $t('ACTIONS.EXTENDED_OPERATIVE') }}
				</c-button>
			</p>
			<div class="m-request-statement__link">
				<p>{{ $t('INFO.REQUEST_STATEMENT.DESC2') }}</p>
				<button
					class="m-request-statement__link-button text-l-medium"
					data-testid="sirvase"
					@click="
						goto({
							name: 'sirvase-create',
							params: {
								typologyId: '13',
								description: $t('INFO.REQUEST_STATEMENT.PRE_DATA.DESC', { productNumber }),
							},
						})
					"
				>
					{{ $t('INFO.PROCEED_SIRVASE_REQUEST') }}
				</button>
			</div>
			<p class="m-request-statement__desc">{{ $t('INFO.CONTACT_US.DESC') }}</p>
			<c-contact-support-info />
		</article>

		<template v-slot:buttons>
			<a class="m-request-statement__cancel text-m-medium" href="#" @click.prevent="$emit('close')">
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
	name: 'm-request-statement',

	components: {
		LModal,
		CButton,
		CIcon,
		CContactSupportInfo,
	},

	props: {
		productNumber: { type: String, default: '' },
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
.m-request-statement__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-request-statement__desc {
	max-width: 320px;
	margin: 0 auto;
	margin-bottom: 20px;
}

.m-request-statement__desc:last-of-type {
	margin-bottom: 0;
}

.m-request-statement__button .button {
	width: 100%;
	max-width: 320px;
	margin-bottom: 20px;
}

.m-request-statement__link {
	display: flex;
	flex-direction: column;
	padding: 20px;
	margin-bottom: 20px;
	border: 1px solid RGB(var(--color-surface-dark));
}

.m-request-statement__link button {
	border: none;
	outline: none;
	user-select: none;
	appearance: none;
	background: transparent;
	white-space: nowrap;
	margin-top: 20px;
	text-decoration: underline;
}

.m-request-statement__cancel {
	margin: 0 auto;
}
</style>
