<template>
	<l-modal :stretch="true" class="m-communications__modal" :fullscreen="onMobile">
		<template v-slot:header>
			{{ $t('NEWS') }}
		</template>
		<w-carousel :slides="slides" enable-feedback text-align="center" />
	</l-modal>
</template>

<script>
import WCarousel from '@widgets/w-carousel';
import LModal from '@layouts/l-modal';
import mq from '@utils/matchMedia';
import { onMobile } from '@theme';

export default {
	name: 'm-communications',

	components: {
		WCarousel,
		LModal,
	},

	props: {
		slides: { type: Array },
	},

	computed: {
		onMobile: mq(onMobile),
	},
};
</script>

<style lang="scss" scoped>
.m-communications__modal {
	--color-surface-light: var(--color-themed-surface);
	--color-text-primary: var(--color-text-primary-light);
}
</style>
