/**
 * La siguiente lista se corresponde con los subtipos de productos que se
 * definen en skyline.
 *
 * *) Los subtipos reales de productos tienen dos dígitos.
 * *) Los subtipos sintéticos empiezan por s-XX, donde XX es un id inventado.
 * *) Los subtipos que dependen de una cartera gestionada empiezan por m-XX,
 * * donde XX es el subtipo real de ese producto.
 *
 * Un id sintético es un id que no existe en realidad. No tiene relación con
 * la tabla de ids de subtipos de productos. En algún lugar de esta aplicación
 * se ha cambiado su verdadero id por éste sintético, para poder diferenciarlo
 * de otros productos.
 */

const def = {
	'01': 'checking-account',
	'02': 'account',
	'03': 'currency-account',
	'04': 'junior-account',
	'05': 'support-account',
	'43': 'hefame-account',
	'06': 'debit-card',
	'07': 'credit-card',
	'33': 'business-debit-card',
	'34': 'business-credit-card',
	'08': 'term-deposit',
	'09': 'demand-deposit',
	'10': 'currency-deposit',
	'11': 'advised-fund',
	'12': 'commercialized-fund',
	'13': 'delegated-fund',
	'32': 'tressis-fund',
	'14': 'pension-plan',
	'15': 'caminos-equities',
	'16': 'securities-account',
	'17': 'loan-var',
	'18': 'loan-fixed',
	'19': 'loan-mix',
	'20': 'endorsement',
	'21': 'endorsement-line',
	'22': 'tpv',
	'23': 'guarantee-policy-fixed',
	'24': 'guarantee-policy-var',
	'41': 'guarantee-policy-fixed',
	'42': 'guarantee-policy-var',
	'25': 'discount-line',
	'26': 'premium-account',
	'27': 'managed-portfolio',
	'28': 'premium-debit-card',
	'29': 'premium-credit-card',
	'30': 'premium-deposit',
	'31': 'pending-movements',
	'36': 'investment-managed-account',
	'37': 'investment-account-rto',
	'38': 'investment-pension-plan',
	'39': 'managed-rsi-account',
	'40': 'managed-rsi-currency-account',
	's-01': 'managed-rsi-portfolio',
	'm-01': 'managed-account',
	'm-03': 'managed-currency-account',
	'm-06': 'managed-debit-card',
	'm-07': 'managed-credit-card',
	'm-08': 'managed-deposit',
	'm-10': 'managed-currency-deposit',
	'm-13': 'managed-fund',
	'm-16': 'managed-equities',
	'm-37': 'managed-investment-portfolio',
	'm-39': 'managed-rsi-account',
	'm-40': 'managed-rsi-currency-account',
};

export const subtypesById = def;
export const subtypesByTitle = Object.fromEntries(Object.entries(def).map((a) => a.reverse()));
