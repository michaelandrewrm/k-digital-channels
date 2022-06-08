<template>
	<div class="w-actions">
		<c-button
			data-testid="main-button"
			class="w-actions__btn"
			v-if="options && options[0]"
			raised
			:disabled="options[0].disabled"
			@click="options[0].action"
		>
			{{ options[0].title }}
		</c-button>

		<c-button
			data-testid="more-button"
			class="w-actions__more"
			v-if="options && options[1]"
			raised
			:disabled="disabled"
			@click="openOptionSheet"
		>
			{{ String('···') }}
		</c-button>
	</div>
</template>

<script>
import CButton from '@components/c-button';
import MOptions from '@modals/m-options';

export default {
	name: 'w-actions',

	components: { CButton },

	props: { options: Array, disabled: Boolean },

	methods: {
		async openOptionSheet() {
			const options = this.options.filter(({ hidden }) => !hidden);
			const option = await this.$store.dispatch('modal/open', {
				component: MOptions,
				props: {
					title: this.$t('ACTIONS.MORE_ACTIONS'),
					options,
				},
			});

			// We execute the action when the m-option is closed
			if (option?.action) {
				await option.action();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.w-actions {
	display: grid;
	width: 100%;
	max-width: 400px;
	gap: 10px;
	grid-auto-flow: column;
	grid-auto-columns: 1fr auto;
	justify-items: center;
}

.w-actions__btn {
	width: 100%;
	max-width: 320px;
}

.w-actions__more {
	filter: brightness(1.24);
	font-size: 28px;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	line-height: 1;
	letter-spacing: 1px;
	padding-left: 10px;
	padding-right: 10px;
	width: 48px;
}
</style>
