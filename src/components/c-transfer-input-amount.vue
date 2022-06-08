<template>
	<div class="c-transfer-input-amount" :class="classNames">
		<input
			:id="id"
			class="c-transfer-input-amount__input text-fixed-m-book"
			ref="input"
			v-model="inputValue"
			:type="type"
			inputmode="decimal"
			autocomplete="off"
			v-bind="$attrs"
			v-on="$listeners"
			:aria-invalid="!valid"
			:aria-describedby="helperId"
			@focus="isFocused = true"
			@blur="isFocused = false"
		/>

		<div class="c-transfer-input-amount__symbol text-l-medium">
			{{ currencySymbol }}
		</div>
	</div>
</template>

<script>
export default {
	name: 'c-transfer-input-amount',

	inheritAttrs: false,

	model: {
		prop: 'value',
		event: 'update:value',
	},

	data() {
		return {
			rawValue: '',
			isFocused: false,
		};
	},

	props: {
		value: { type: [String, Number], default: '' },
		valid: { type: Boolean, default: true },
		type: { type: String, default: 'text' },
		id: { type: String },
		currency: { type: String, default: 'EUR' },
	},

	computed: {
		inputValue: {
			get() {
				return this.isFocused ? this.rawValue : this.formattedValue;
			},

			set(value) {
				const regExp = new RegExp(`[^${this.localSeparators.thousand}]`, 'g');
				const amount = value?.match(regExp)?.join('');
				this.rawValue = amount;
			},
		},

		formattedValue({ rawValue }) {
			if (!rawValue) {
				return;
			}

			const num = parseFloat(
				rawValue
					.toString()
					.split(this.localSeparators.decimal)
					.join('.')
			);

			// To present a local number format, i.e: 9.999,99
			// for Spanish language, we must pass this format: 9999.99
			return this.$n(num, {
				style: 'decimal',
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		},

		classNames({ valid, type }) {
			return {
				'--invalid': !valid,
				[`--type-${type}`]: true,
			};
		},

		helperId({ id }) {
			return id ? `${id}-helper` : '';
		},

		localSeparators() {
			const amount = this.$n(1000, { style: 'decimal', minimumFractionDigits: 1 });
			return { thousand: amount[1], decimal: amount[5] };
		},

		currencySymbol({ currency }) {
			return this.$n(1, {
				style: 'currency',
				currency,
				currencyDisplay: 'symbol',
				useGrouping: true,
				minimumFractionDigits: 0,
			}).replace(/\w/, '');
		},
	},

	watch: {
		rawValue: {
			handler(amount) {
				let num = parseFloat(amount?.replace(this.localSeparators.decimal, '.'));

				/* istanbul ignore else */
				if (Number.isNaN(num)) {
					num = null;
				}

				// We must send a number on this format: 9999.99
				this.$emit('update:value', num);
			},
		},

		value: {
			immediate: true,
			handler(amount) {
				// The amount will be always on this format: 9999.99
				// where the decimal separator is a dot
				// no matters which language is set
				this.rawValue = amount?.toString().replace('.', this.localSeparators.decimal);
			},
		},
	},

	methods: {
		focus() {
			this.$refs.input.focus();
		},
	},
};
</script>

<style lang="scss" scoped>
.c-transfer-input-amount {
	display: flex;
	width: 100%;
	flex-direction: column;
	color: RGB(var(--color-text-primary));
	position: relative;
}

.c-transfer-input-amount__input {
	appearance: none;
	display: inline-flex;
	position: relative;
	width: 100%;
	height: 40px;
	overflow: visible;
	color: RGB(var(--color-text-primary));
	padding-left: 10px;
	justify-content: center;
	border-left: 3px solid RGB(var(--color-accent-icon));
	border-radius: $border-radius-s;
	background-color: RGB(var(--color-surface-light));
	outline: none;
	font-variant: tabular-nums;
}

.c-transfer-input-amount__input::placeholder {
	color: RGB(var(--color-accent-icon));
}

.c-transfer-input-amount.--invalid .c-transfer-input-amount__input {
	border: 1px solid;
	border-left: 3px solid;
	border-color: RGB(var(--color-text-error));
	caret-color: RGB(var(--color-text-error));
}

.c-transfer-input-amount__symbol {
	position: absolute;
	top: 0;
	right: 0;
	width: 40px;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: RGB(var(--color-text-primary));
	background-color: RGB(var(--color-surface-dark));
	border-top-right-radius: $border-radius-s;
	border-bottom-right-radius: $border-radius-s;
}

.c-transfer-input-amount.--invalid .c-transfer-input-amount__symbol {
	border: 1px solid;
	border-left: none;
	border-color: RGB(var(--color-text-error));
}
</style>
