const images = {};
const requireImage = require.context('@local-assets/cards', false, /.*\.svg$/);

/* istanbul ignore next */
requireImage.keys().forEach((fileName) => {
	const componentConfig = requireImage(fileName);
	const componentName = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '');

	images[componentName] = componentConfig.default || componentConfig;
});

export default (product) => {
	const alias = product?.alias?.toLowerCase() || '';
	const isPremium = alias.includes('premium');
	const isTransparent = alias.includes('transparent');
	const isBusiness = alias.includes('business');

	let type = 'generic';

	if (isPremium) {
		type = 'premium';
	}

	if (isTransparent) {
		type = 'transparent';
	}

	if (isBusiness) {
		type = 'business';
	}

	return images[type];
};
