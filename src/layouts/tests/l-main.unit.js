import { shallowMount } from '@vue/test-utils';
import Component from '@layouts/l-main.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

jest.mock('@skyline/router/navigation-map', () => ({
	'page-one': ['page-two'],
	'page-two': ['page-three'],
}));

describe('l-main.vue', () => {
	let router;

	beforeEach(async () => {
		const { localRouter } = newInstance;

		router = localRouter;

		const pageOne = { name: 'page-one', template: '<div id="page-one/>' };
		const pageTwo = { name: 'page-two', template: '<div id="page-two/>' };
		const pageThree = { name: 'page-three', template: '<div id="page-three/>' };
		const pageMeta = { name: 'page-meta', template: '<div id="page-meta/>' };

		router.addRoute({
			path: '/main/',
			name: 'page-main',
			children: [
				{
					path: '/page-one',
					name: 'page-one',
					components: { primary: pageOne, secondary: pageOne },
				},
				{
					path: '/page-two',
					name: 'page-two',
					components: { primary: pageOne, secondary: pageTwo },
				},
				{
					path: '/page-three',
					name: 'page-three',
					meta: { transition: 'fade' },
					components: { primary: pageOne, secondary: pageThree },
				},
				{
					path: '/page-meta',
					name: 'page-meta',
					meta: { fullPage: true },
					components: { primary: pageMeta },
				},
				{
					path: '/page-full',
					name: 'page-full',
					meta: { fullWidth: true },
					components: { primary: pageOne },
				},
				{
					path: '/page-empty',
					name: 'page-empty',
					components: { primary: pageOne },
				},
			],
		});
	});

	describe('on mobile', () => {
		let wp;

		beforeEach(async () => {
			wp = shallowMount(Component, {
				computed: {
					isMobile: () => true,
					isDesktop: () => false,
				},
				localVue,
				router,
				slots: {
					navbar: '<div id="menu"/>',
					primary: '<div id="primary"/>',
					secondary: '<div id="secondary"/>',
				},
			});
		});

		it("has a name equal 'l-main'", () => {
			expect(wp.vm.$options.name).toBe('l-main');
		});

		/**
		 * Al avanzar en la navegación, la transición debe ser push.
		 * Al retroceder en la navegación, la transición debe ser pull.
		 */
		it('transition to push on secondary views', async () => {
			await router.push({ name: 'page-one' });
			await router.push({ name: 'page-two' });

			const containerSecondary = wp.find('[data-testid="container-secondary"]');

			expect(containerSecondary.attributes('data-transition')).toBe('push-page');

			await router.push({ name: 'page-one' });

			expect(containerSecondary.attributes('data-transition')).toBe('pull-page');
		});

		/**
		 * En móvil, si la ruta es sólo primaria solo debería verse ésta
		 * sin la secundaria.
		 */
		it('show only primary view', async () => {
			await router.push({ name: 'page-meta' });

			const containerSecondary = wp.find('[data-testid="container-secondary"]');

			expect(containerSecondary.exists()).toBeFalsy();
		});

		/**
		 * Cuando la opción fullPage está activada, no debería mostrar el menú de navegación.
		 */
		it('hides the navbar on fullpages', async () => {
			await router.push({ name: 'page-meta' });

			expect(wp.find('#menu').exists()).toBeFalsy();

			await router.push({ name: 'page-full' });

			expect(wp.find('#menu').exists()).toBeTruthy();
		});

		/**
		 * Si la ruta tiene opción transition, el efecto de transición debería
		 * sobrescribirse por el valor de esa opción.
		 */
		it('overrides transition page with transition option', async () => {
			// 1. one -> /push/ -> two
			// 2. two -> /fade/ -> three
			// 3. three -> /fade/ -> two
			// 4. two -> /pull/ -> one

			// 1:
			await router.push({ name: 'page-one' });
			await router.push({ name: 'page-two' });

			const containerSecondary = wp.find('[data-testid="container-secondary"]');

			expect(containerSecondary.attributes('data-transition')).toBe('push-page');

			// 2:
			await router.push({ name: 'page-three' });
			expect(containerSecondary.attributes('data-transition')).toBe('push-fade');

			// 3:
			await router.push({ name: 'page-two' });
			expect(containerSecondary.attributes('data-transition')).toBe('pull-fade');

			// 4:
			await router.push({ name: 'page-one' });
			expect(containerSecondary.attributes('data-transition')).toBe('pull-page');
		});
	});

	describe('on desktop', () => {
		let wp;

		beforeEach(async () => {
			wp = shallowMount(Component, {
				computed: {
					isMobile: () => false,
					isDesktop: () => true,
				},
				localVue,
				router,
				slots: {
					navbar: '<div id="menu"/>',
					primary: '<div id="primary"/>',
					secondary: '<div id="secondary"/>',
				},
			});
		});

		/**
		 * En escritorio, si la ruta es sólo primaria, debería mostrar
		 * una secundaria vacía.
		 */
		it('show primary view with an empty secondary view', async () => {
			await router.push({ name: 'page-meta' });

			const containerSecondary = wp.find('[data-testid="container-secondary"]');

			expect(containerSecondary.exists()).toBeTruthy();
		});

		/**
		 * En escritorio, la transición de la vista secundaria siempre es fade.
		 */
		it('always transition fade on secondary views', async () => {
			await router.push({ name: 'page-one' });
			await router.push({ name: 'page-two' });

			const containerSecondary = wp.find('[data-testid="container-secondary"]');

			expect(containerSecondary.attributes('data-transition')).toBe('push-fade');

			await router.push({ name: 'page-one' });

			expect(containerSecondary.attributes('data-transition')).toBe('pull-fade');
		});
	});

	describe('on edge cases', () => {
		/**
		 * En modo híbrido, no debería mostrarse el menú de navegación.
		 */
		it('hides menu on hybrid mode', async () => {
			await router.push({ name: 'page-full' });

			const reset = window.navigator.userAgent;
			window.navigator.userAgent = 'Skybrid/1.0';

			const wp = shallowMount(Component, {
				computed: {
					isMobile: () => true,
					isDesktop: () => false,
				},
				localVue,
				router,
				slots: {
					navbar: '<div id="menu"/>',
					primary: '<div id="primary"/>',
					secondary: '<div id="secondary"/>',
				},
			});

			expect(wp.find('#menu').exists()).toBeFalsy();

			window.navigator.userAgent = reset;
		});

		/**
		 * La vista con opción fullWidth debería mostrarse sin la vista secundaria
		 * excepto si el dispositivo es foldable. En ese caso, sí debería mostrarse
		 * la vista secundaria vacía.
		 */
		it('show only primary view with full width mode', async () => {
			await router.push({ name: 'page-full' });

			const wp = shallowMount(Component, {
				computed: {
					isMobile: () => false,
					isDesktop: () => true,
				},
				localVue,
				router,
				slots: {
					navbar: '<div id="menu"/>',
					primary: '<div id="primary"/>',
				},
			});

			const containerSecondary = wp.find('[data-testid="container-secondary"]');

			expect(containerSecondary.exists()).toBeFalsy();
		});

		/**
		 * La vista con opción fullWidth debería mostrarse sin la vista secundaria
		 * excepto si el dispositivo es foldable. En ese caso, sí debería mostrarse
		 * la vista secundaria vacía.
		 */
		it('show primary view and an empty secondary view with full width mode and foldable device', async () => {
			await router.push({ name: 'page-full' });

			const wp = shallowMount(Component, {
				computed: {
					isMobile: () => false,
					isDesktop: () => true,
					isVerticalFoldable: () => true,
				},
				localVue,
				router,
				slots: {
					navbar: '<div id="menu"/>',
					primary: '<div id="primary"/>',
				},
			});

			const containerSecondary = wp.find('[data-testid="container-secondary"]');

			expect(containerSecondary.exists()).toBeTruthy();
		});

		/**
		 * En vistas primarias sin secundarias y en escritorio, debería pintarse
		 * una vista secundaria vacía.
		 */
		it('show primary view and an empty secondary view without full width mode', async () => {
			await router.push({ name: 'page-empty' });

			const wp = shallowMount(Component, {
				computed: {
					isMobile: () => false,
					isDesktop: () => true,
				},
				localVue,
				router,
				slots: {
					navbar: '<div id="menu"/>',
					primary: '<div id="primary"/>',
				},
			});

			const containerSecondary = wp.find('[data-testid="container-secondary"]');

			expect(containerSecondary.exists()).toBeTruthy();
		});
	});
});
