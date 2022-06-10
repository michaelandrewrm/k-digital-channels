/**
 * La siguiente lista se corresponde con los tipos de productos que se
 * definen en skyline.
 *
 * *) Los tipos reales de productos tienen dos dígitos.
 * *) Los tipos sintéticos empiezan por s-XX, donde XX es un id inventado.
 *
 * Un id sintético es un id que no existe en realidad. No tiene relación con
 * la tabla de ids de tipos de productos. En algún lugar de esta aplicación
 * se ha cambiado su verdadero id por éste sintético, para poder diferenciarlo
 * de otros productos.
 */

const def = {
	'01': 'account',
	'02': 'card',
	'03': 'deposit',
	'04': 'fund',
	'05': 'pension-plan',
	'06': 'equities',
	'07': 'loan',
	'08': 'endorsement',
	'09': 'tpv',
	'10': 'credit',
	'11': 'subscription',
	'12': 'discount-line',
	'13': 'investment',
	'14': 'service',
	'15': 'managed-portfolio',
	'16': 'pending-movements',
	'17': 'remittance',
	's-01': 'managed-rsi-portfolio',
};

export const typesById = def;
export const typesByTitle = Object.fromEntries(Object.entries(def).map((a) => a.reverse()));
