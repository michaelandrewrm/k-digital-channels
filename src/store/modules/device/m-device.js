/**
 * Returns a random session device id.
 */
const generateUUID = () => {
	const lut = Array.from({ length: 256 }, (a, i) => {
		return (i < 16 ? '0' : '') + i.toString(16);
	});

	/* eslint-disable no-bitwise */
	const d0 = (Math.random() * 0xffffffff) | 0;
	const d1 = (Math.random() * 0xffffffff) | 0;
	const d2 = (Math.random() * 0xffffffff) | 0;
	const d3 = (Math.random() * 0xffffffff) | 0;

	return (
		// eslint-disable-next-line prefer-template
		lut[d0 & 0xff] +
		lut[(d0 >> 8) & 0xff] +
		lut[(d0 >> 16) & 0xff] +
		lut[(d0 >> 24) & 0xff] +
		'-' +
		lut[d1 & 0xff] +
		lut[(d1 >> 8) & 0xff] +
		'-' +
		lut[((d1 >> 16) & 0x0f) | 0x40] +
		lut[(d1 >> 24) & 0xff] +
		'-' +
		lut[(d2 & 0x3f) | 0x80] +
		lut[(d2 >> 8) & 0xff] +
		'-' +
		lut[(d2 >> 16) & 0xff] +
		lut[(d2 >> 24) & 0xff] +
		lut[d3 & 0xff] +
		lut[(d3 >> 8) & 0xff] +
		lut[(d3 >> 16) & 0xff] +
		lut[(d3 >> 24) & 0xff]
	);
};

export default {
	namespaced: true,

	/**
	 * @typedef state
	 * @property {String} id Unique session device id.
	 * @property {Boolean} isPWA Return true if the current session is from an installed progressive web app.
	 */
	state() {
		let deviceId = localStorage.getItem('deviceId');

		if (!deviceId) {
			deviceId = generateUUID();
			localStorage.setItem('deviceId', deviceId);
		}

		return {
			id: deviceId,

			isPWA: Boolean(matchMedia('(display-mode: standalone)').matches || navigator.standalone),
		};
	},
};
