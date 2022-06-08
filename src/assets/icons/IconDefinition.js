export default function(iconName, width, height, svgPathData) {
	return {
		iconName,
		icon: [width, height, svgPathData],
		toString: () => `@icons/${iconName}`,
	};
}
