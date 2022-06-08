<template>
	<l-modal data-id="layout">
		<template v-slot:header>
			{{ $t('UNLOCK_USER') }}
		</template>

		<article>
			<p>{{ $t('UNLOCK_USER_DESC') }}</p>
			<c-contact-support-info />
		</article>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CContactSupportInfo from '@components/c-contact-support-info';

export default {
	name: 'm-unlock-user',
	components: {
		LModal,
		CContactSupportInfo,
	},
};
</script>

<style lang="scss" scoped>
article {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
	width: 100%;
}
</style>
