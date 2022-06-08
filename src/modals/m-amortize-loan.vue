<template>
	<l-modal class="m-amortize-loan" modal>
		<template v-slot:icon>
			<c-icon src="@icons/valueAccountUnit" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.AMORTIZE_LOAN.TITLE') }}
		</template>

		<article v-if="isBancofar">
			<p>{{ $t('INFO.UNAVAILABLE_OPERATIVE.DESC') }}</p>
			<c-contact-support-info />
		</article>

		<article v-else class="m-amortize-loan__content">
			<div class="m-amortize-loan__link">
				<p>{{ $t('INFO.AMORTIZE_LOAN.DESC2') }}</p>
				<button
					class="m-amortize-loan__link-button text-l-medium"
					data-testid="sirvase"
					@click="
						goto({
							name: 'sirvase-create',
							params: {
								typologyId: '05',
								description: $t('INFO.AMORTIZE_LOAN.PRE_DATA.DESC', { productNumber }),
							},
						})
					"
				>
					{{ $t('INFO.PROCEED_SIRVASE_REQUEST') }}
				</button>
			</div>
			<p class="m-amortize-loan__desc">{{ $t('INFO.CONTACT_US.DESC') }}</p>
			<c-contact-support-info />
		</article>

		<template v-slot:buttons>
			<a class="m-amortize-loan__cancel text-m-medium" href="#" @click.prevent="$emit('close')">
				{{ $t('ACTIONS.CANCEL') }}
			</a>
		</template>
	</l-modal>
</template>

<script>
import { mapState } from 'vuex';
import LModal from '@layouts/l-modal';
import CIcon from '@components/c-icon';
import CContactSupportInfo from '@components/c-contact-support-info';

export default {
	name: 'm-amortize-loan',

	components: {
		LModal,
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
.m-amortize-loan__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-amortize-loan__desc {
	max-width: 320px;
	margin: 0 auto;
	margin-bottom: 20px;
}

.m-amortize-loan__desc:last-of-type {
	margin-bottom: 0;
}

.m-amortize-loan__button .button {
	width: 100%;
	max-width: 320px;
	margin-bottom: 20px;
}

.m-amortize-loan__link {
	display: flex;
	flex-direction: column;
	padding: 20px;
	margin-bottom: 20px;
	border: 1px solid RGB(var(--color-surface-dark));
}

.m-amortize-loan__link button {
	border: none;
	outline: none;
	user-select: none;
	appearance: none;
	background: transparent;
	white-space: nowrap;
	margin-top: 20px;
	text-decoration: underline;
}

.m-amortize-loan__cancel {
	margin: 0 auto;
}
</style>
