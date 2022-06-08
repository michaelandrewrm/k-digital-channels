<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/profitability" />
		</template>

		<template v-slot:header>
			{{ $t('FUND.PROFITABILITY.INFO.TITLE') }}
		</template>

		<article>
			<p>
				{{ $t('FUND.PROFITABILITY.INFO.DESC') }}
			</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="accept" @click="$emit('close')" raised confirm>
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';

export default {
	name: 'm-fund-profitability',

	components: { LModal, CButton, CIcon },
};
</script>

<style lang="scss" scoped>
article {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}
</style>
