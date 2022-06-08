<template>
	<c-icon-button
		:aria-label="$t('COPY').concat(' ', copyTitle)"
		icon="@icons/clipboard"
		class="c-button-copy-to-clipboard"
		mini
		@click="copyToClipboard(copyTitle.concat(' ', $t('COPIED_TO_CLIPBOARD'), '.'), copyText)"
	/>
</template>

<script>
import CIconButton from '@components/c-icon-button';
import * as clipboard from 'clipboard-polyfill';

export default {
	name: 'c-button-copy-to-clipboard',

	components: {
		CIconButton,
	},
	props: {
		copyText: [String, Number],
		copyTitle: String,
	},

	methods: {
		copyToClipboard(title, text) {
			clipboard.writeText(text).then(() => {
				this.$store.dispatch('notification/open', { text: title, timeout: 5000 });
			});
		},
	},
};
</script>
