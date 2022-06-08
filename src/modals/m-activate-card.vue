<template>
	<l-modal class="m-activate-card" modal>
		<template v-slot:icon>
			<c-icon src="@icons/productCard" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.ACTIVATE_CARD.TITLE') }}
		</template>

		<article class="m-activate-card__content">
			<p class="m-activate-card__desc">{{ $t('INFO.ACTIVATE_CARD.DESC1') }}</p>
			<p class="m-activate-card__desc text-m-medium">{{ $t('INFO.ACTIVATE_CARD.PATH') }}</p>
			<p class="m-activate-card__button">
				<c-button data-testid="confirm-button" raised confirm @click="goto({ name: 'sso-rsi' })">
					{{ $t('ACTIONS.EXTENDED_OPERATIVE') }}
				</c-button>
			</p>
		</article>

		<template v-slot:buttons>
			<a class="m-activate-card__cancel text-m-medium" href="#" @click.prevent="$emit('close')">
				{{ $t('ACTIONS.CANCEL') }}
			</a>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';

export default {
	name: 'm-activate-card',

	components: {
		LModal,
		CButton,
		CIcon,
	},

	props: {
		productNumber: { type: String, default: '' },
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
.m-activate-card__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-activate-card__desc {
	max-width: 320px;
	margin: 0 auto;
	margin-bottom: 20px;
}

.m-activate-card__desc:last-of-type {
	margin-bottom: 0;
}

.m-activate-card__button .button {
	width: 100%;
	max-width: 320px;
	margin-bottom: 20px;
}

.m-activate-card__link {
	display: flex;
	flex-direction: column;
	padding: 20px;
	margin-bottom: 20px;
	border: 1px solid RGB(var(--color-surface-dark));
}

.m-activate-card__link button {
	border: none;
	outline: none;
	user-select: none;
	appearance: none;
	background: transparent;
	white-space: nowrap;
	margin-top: 20px;
	text-decoration: underline;
}

.m-activate-card__cancel {
	margin: 0 auto;
}
</style>
