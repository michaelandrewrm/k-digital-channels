<template>
	<div class="c-currency-label">
		<span class="c-currency-label__label text-l-book" v-if="startsWithCurrency">
			{{ currency }}
		</span>
		<span class="c-currency-label__label text-xxl-book">{{ number }}</span>
		<span class="c-currency-label__label text-l-book" v-if="!startsWithCurrency">
			{{ currency }}
		</span>
	</div>
</template>

<script>
export default {
	name: 'c-currency-label',

	props: {
		balance: { type: Object },
	},

	computed: {
		formatted({ balance: { amount, currency } }) {
			return this.$n(amount, {
				minimumFractionDigits: 2,
				style: 'currency',
				currency: currency.id,
				currencyDisplay: 'symbol',
				useGrouping: true,
			});
		},

		number({ balance: { amount } }) {
			return this.$n(amount, { minimumFractionDigits: 2 });
		},

		currency({ formatted, number }) {
			return formatted.replace(number, '').trim();
		},

		startsWithCurrency({ formatted, currency }) {
			return formatted.startsWith(currency);
		},
	},
};
</script>

<style lang="scss" scoped>
.c-currency-label {
	display: flex;
	align-items: center;
	justify-content: center;
}

.c-currency-label__label {
	margin: 0 3px;
}
</style>
