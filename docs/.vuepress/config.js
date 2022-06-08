module.exports = {
	markdown: {
		toc: {
			includeLevel: [1, 2, 3]
		}
	},
	themeConfig: {
		serviceWorker: {
			updatePopup: true
		},
		displayAllHeaders: true,
		lastUpdated: 'Last Updated',
		locales: {
			'/': {
				selectText: 'Languages',
				label: 'English',
				serviceWorker: {
					updatePopup: {
						messages: 'New content is available',
						buttonText: 'Refresh now!'
					}
				},
				nav: [
					{ text: 'Home', link: '/' },
					{ text: 'Guide', link: '/introduction' }
				],
				sidebar: [
					{
						title: 'Guide',
						collapsable: true,
						children: [
							'/introduction',
							'/getting-started',
							'/directory-structure',
							'/how-to',
							'/guidelines'
						]
					},
				],
			},
			'/es/': {
				selectText: 'Lenguajes',
				label: 'Español',
				serviceWorker: {
					updatePopup: {
						messages: 'Disponible nuevo contenido',
						buttonText: 'Actualiza ahora!'
					}
				},
				nav: [
					{ text: 'Home', link: '/es/' },
					{ text: 'Guía', link: '/es/introduction' }
				],
				sidebar: [
					{
						title: 'Guía',
						collapsable: true,
						children: [
							'/es/introduction',
							'/es/getting-started',
							'/es/directory-structure',
							'/es/how-to',
							'/es/guidelines'
						]
					},
				],
			}
		},
	},
	locales: {
		'/': {
			lang: 'en',
			title: 'Vuesoma',
			description: 'Standard structure for building modular web applications.',
		},
		'/es/': {
			lang: 'es',
			title: 'Vuesoma',
			description: 'Estructura estándar para el desarrollo de aplicaciones web modulares.',
		}
	}
}
