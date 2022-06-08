const createObfuscatedNumber = (value, type) => {
	const types = {
		IBAN: 5,
		PAN: 3,
		FIDES: 1,
		CCV: 4,
		CCC: 4,
		UNKNOWN: 4,
		INTERNAL: 4,
	};

	const chain = type === 'FIDES' ? '***** ***** ' : '**** ';

	if (type === 'obfuscated-pan') {
		return value.replace(/(^\w{6})(\w+)(\w{4}$)/, (match, p1, p2, p3) =>
			`${p1}******${p3}`.match(/.{4}/g).join(' ')
		);
	}

	return chain.repeat(types[type]) + value.toString().substr(-4);
};

const getCountry = (value) => value.substr(0, 2);

const formatNumber = (value, type) => {
	const isSpanishIban = type === 'IBAN' && getCountry(value) === 'ES';
	const isCCardNumber = type === 'PAN';
	const icCCC = type === 'CCC';

	if (isSpanishIban || isCCardNumber || icCCC) {
		return value.match(/.{4}/g).join(' ');
	}

	return value;
};

export default {
	install(Vue) {
		Vue.mixin({
			methods: {
				$pn(productNumber, action) {
					if (!productNumber) {
						return;
					}
					const { value, format } = productNumber;

					if (action === 'obfuscated-pan') {
						return createObfuscatedNumber(value, action);
					}

					if (action === 'format') {
						return formatNumber(value, format.id);
					}

					return createObfuscatedNumber(value, format.id);
				},
			},
		});
	},
};
