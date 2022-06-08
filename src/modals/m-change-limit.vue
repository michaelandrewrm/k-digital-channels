<template>
	<l-modal class="m-change-limit" modal>
		<template v-slot:icon>
			<c-icon src="@icons/productCard" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.CHANGE_LIMIT.TITLE') }}
		</template>

		<article v-if="isBancofar">
			<p>{{ $t('INFO.UNAVAILABLE_OPERATIVE.DESC') }}</p>
			<c-contact-support-info />
		</article>

		<article v-else class="m-change-limit__content">
			<p class="m-change-limit__desc">{{ $t('INFO.CHANGE_LIMIT.DESC1') }}</p>
			<p class="m-change-limit__desc text-m-medium">{{ $t('INFO.CHANGE_LIMIT.PATH') }}</p>
			<p class="m-change-limit__button">
				<c-button data-testid="confirm-button" raised confirm @click="goto({ name: 'sso-rsi' })">
					{{ $t('ACTIONS.EXTENDED_OPERATIVE') }}
				</c-button>
			</p>
		</article>

		<template v-slot:buttons>
			<c-button
				v-if="isBancofar"
				data-testid="confirm-button"
				@click="goto({ name: 'legacy-web' })"
				raised
				confirm
			>
				{{ $t('ACTIONS.GO_TO_VIEW', { view: $t('LEGACY_WEB') }) }}
			</c-button>

			<a class="m-change-limit__cancel text-m-medium" href="#" @click.prevent="$emit('close')">
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
	name: 'm-change-limit',

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
.m-change-limit__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-change-limit__desc {
	max-width: 320px;
	margin: 0 auto;
	margin-bottom: 20px;
}

.m-change-limit__desc:last-of-type {
	margin-bottom: 0;
}

.m-change-limit__button .button {
	width: 100%;
	max-width: 320px;
}

.m-change-limit__link {
	display: flex;
	flex-direction: column;
	padding: 20px;
	margin-bottom: 20px;
	border: 1px solid RGB(var(--color-surface-dark));
}

.m-change-limit__link button {
	border: none;
	outline: none;
	user-select: none;
	appearance: none;
	background: transparent;
	white-space: nowrap;
	margin-top: 20px;
	text-decoration: underline;
}

.m-change-limit__cancel {
	width: 100%;
	margin-top: 10px;
}
</style>
