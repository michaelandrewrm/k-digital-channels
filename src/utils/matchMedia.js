import Vue from 'vue';

const { observable } = Vue;

/**
 * Returns a function to use in a computed
 * property that determines if the Document
 * matches the media query.
 *
 * The property is reactive so when the
 * Document stops matching the media query
 * the property will update itself.
 *
 * ```
 * import mq from '@utils/matchMedia';
 * ...
 * computed: {
 *     isSmallMobile: mq('(max-height: 800px)')
 * }
 * ```
 *
 * @param {String} mediaQuery a valid media query
 * @returns {Function}
 */
export default function(mediaQuery) {
	const m = window.matchMedia(mediaQuery);
	const mediaMobile = observable({ matches: m.matches });
	m.onchange = ({ matches }) => {
		mediaMobile.matches = matches;
	};

	return () => mediaMobile.matches;
}
