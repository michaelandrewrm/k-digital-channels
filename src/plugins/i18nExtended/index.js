export default {
	install(Vue) {
		Vue.mixin({
			methods: {
				/**
				 * Devuelve un número en formato moneda.
				 *
				 * @param {Object} number Objecto con información de valor y moneda.
				 * @param {Number} number.amount Valor numérico.
				 * @param {Object} number.currency Objeto que dispone la moneda.
				 * @param {String} number.currency.id Código ISO de la moneda.
				 * @param {Object} options (optional)
				 * @param {Boolean} options.sign Devuelve el número junto con su signo.
				 * @param {Boolean} options.absolute Devuelve el número sin su signo.
				 */
				$nc({ amount, currency }, { sign, absolute, ...options } = {}) {
					if (currency?.id === 'UNDEFINED') {
						return '';
					}

					const value = absolute ? Math.abs(amount) : amount;
					const money = this.$n(value, {
						style: 'currency',
						currency: currency?.id,
						currencyDisplay: 'symbol',
						useGrouping: true,
						...options,
					});

					if (sign && !absolute) {
						const isPositive = value > 0;

						if (isPositive) {
							return `+${money}`;
						}
					}

					return money;
				},
			},
		});
	},
};
