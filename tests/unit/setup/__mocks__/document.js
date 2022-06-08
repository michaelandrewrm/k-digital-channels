let cookies = '';

Object.defineProperty(document, 'cookie', {
	get: jest.fn().mockImplementation(() => {
		return cookies;
	}),
	set: jest.fn().mockImplementation((cookieValue) => {
		const inCookies = cookies.split(' ');
		const cookieName = cookieValue.split('=').shift();
		const cookieNameLength = cookieName.length;
		let cookieIndex = -1;
		inCookies.forEach((value, index) => {
			if (`${value.substr(0, cookieNameLength)}=` === `${cookieName}=`) {
				cookieIndex = index;
			}
		});
		if (cookieIndex > -1) {
			inCookies[cookieIndex] = `${cookieValue};`;
		} else {
			inCookies.push(`${cookieValue};`);
		}
		cookies = inCookies.join(' ').trim();
	}),
});

Object.defineProperty(document, 'cookieReset', {
	writable: true,
	value: () => {
		cookies = '';
	},
});
