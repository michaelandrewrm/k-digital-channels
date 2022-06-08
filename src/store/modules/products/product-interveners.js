const def = {
	'01': 'holder',
	'02': 'usufructuary',
	'06': 'authorized',
	'07': 'attorney',
	'11': 'legal-representative',
};

export const intervenersById = def;
export const intervenersByTitle = Object.fromEntries(Object.entries(def).map((a) => a.reverse()));
