<template>
	<div class="c-tabs">
		<c-tabs-nav v-if="!externalNav" />
		<div class="c-tabs__panels">
			<slot />
		</div>
	</div>
</template>

<script>
import CTabsNav from '@components/c-tabs-nav';

export default {
	name: 'c-tabs',

	components: { CTabsNav },

	props: {
		externalNav: { type: Boolean },
	},
};
</script>

<style lang="scss" scoped></style>
