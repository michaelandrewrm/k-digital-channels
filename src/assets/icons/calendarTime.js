/* eslint-disable object-shorthand */

const iconName = 'calendarTime';
const width = 16;
const height = 16;

const svgPathData =
	'M10.08 0c.3 0 .56.25.56.56v1.12h1.68c.62 0 1.12.5 1.12 1.12v5.9a3.5 3.5 0 0 0-1.12-.35v-2.2H1.12v6.16h7.23c.05.4.18.78.35 1.12H1.12c-.62 0-1.12-.5-1.12-1.12V2.8c0-.62.5-1.12 1.12-1.12H2.8V.56a.56.56 0 1 1 1.12 0v1.12h5.6V.56a.56.56 0 0 1 .56-.56zM1.12 2.8v2.24h11.2V2.8h-1.68v.56a.56.56 0 1 1-1.12 0V2.8h-5.6v.56a.56.56 0 1 1-1.12 0V2.8H1.12zm11.36 8.08a.32.32 0 0 1 .32.32v1.28a.32.32 0 0 1-.32.32h-.01-1.27a.32.32 0 0 1 0-.64h.96v-.96a.32.32 0 0 1 .32-.32zM8.35 12.2a3.85 3.85 0 1 0 7.7 0 3.85 3.85 0 1 0-7.7 0zm1 0a1.93 1.93 0 1 1 5.78 0 1.93 1.93 0 1 1-5.77 0z';

exports.definition = {
	iconName: iconName,
	icon: [width, height, svgPathData],
};

exports.calendarTime = exports.definition;
