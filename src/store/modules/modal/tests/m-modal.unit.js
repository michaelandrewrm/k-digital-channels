import { shallowMount } from '@vue/test-utils';
import modal from '@modules/modal/m-modal';
import Vuex from 'vuex';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const wrapperComponent = { template: '<div></div>' };

describe('m-modal', () => {
	let shallowWrapper;
	let store;

	beforeEach(() => {
		store = new Vuex.Store({
			modules: {
				modal: modal(),
				bugsnag: {
					namespaced: true,
					actions: { log: jest.fn() },
				},
			},
			strict: false,
		});

		shallowWrapper = shallowMount(wrapperComponent, {
			localVue,
			store,
			sync: false,
		});
	});

	it('saves an opened modal in the cache', () => {
		const child = shallowMount({
			template: '<section></section>',
			props: { id: { type: String } },
		});

		expect(shallowWrapper.vm.$store.state.modal.queue).toEqual({});

		shallowWrapper.vm.$store.dispatch('modal/open', child);

		expect(shallowWrapper.vm.$store.state.modal.queue).not.toEqual({});
		expect(Object.keys(shallowWrapper.vm.$store.state.modal.queue).length).toBe(1);
	});

	it('opens a modal with props', () => {
		const child = shallowMount({
			template: '<section></section>',
			props: { id: { type: String } },
		});

		shallowWrapper.vm.$store.dispatch('modal/open', {
			component: child,
			props: { id: 'abc' },
		});

		const uid = shallowWrapper.vm.$store.getters['modal/lastUIDOpened'];
		const lastOpened = shallowWrapper.vm.$store.getters['modal/lastOpened'];
		expect(shallowWrapper.vm.$store.state.modal.queue[uid].props.id).toBe('abc');
		expect(shallowWrapper.vm.$store.state.modal.queue[uid]).toEqual(lastOpened);
	});

	it('saves in cache multiple modals', () => {
		const child = shallowMount({
			template: '<section></section>',
			props: { id: { type: String } },
		});

		shallowWrapper.vm.$store.dispatch('modal/open', { component: child });
		shallowWrapper.vm.$store.dispatch('modal/open', { component: child });

		expect(Object.keys(shallowWrapper.vm.$store.state.modal.queue).length).toBe(2);
	});

	it('removes from cache a opened modal', () => {
		const child = shallowMount({
			template: '<section></section>',
			props: { id: { type: String } },
		});

		shallowWrapper.vm.$store.dispatch('modal/open', {
			component: child,
			props: { id: 'abc' },
		});

		expect(shallowWrapper.vm.$store.state.modal.queue).not.toEqual({});

		shallowWrapper.vm.$store.dispatch('modal/close');

		expect(shallowWrapper.vm.$store.state.modal.queue).toEqual({});
	});

	it('replaces an opened modal with another one', () => {
		const child = shallowMount({
			template: '<section></section>',
			props: { id: { type: String } },
		});

		shallowWrapper.vm.$store.dispatch('modal/open', {
			component: child,
			props: { id: 'abc' },
		});

		expect(Object.keys(shallowWrapper.vm.$store.state.modal.queue).length).toBe(1);
		expect(shallowWrapper.vm.$store.getters['modal/lastOpened'].props.id).toBe('abc');

		shallowWrapper.vm.$store.dispatch('modal/replace', {
			component: child,
			props: { id: 'cxz' },
		});

		expect(Object.keys(shallowWrapper.vm.$store.state.modal.queue).length).toBe(1);
		expect(shallowWrapper.vm.$store.getters['modal/lastOpened'].props.id).toBe('cxz');
	});

	it('closes all modals', () => {
		const child = shallowMount({
			template: '<section></section>',
			props: { id: { type: String } },
		});

		shallowWrapper.vm.$store.dispatch('modal/open', {
			component: child,
			props: { id: 'abc' },
		});

		shallowWrapper.vm.$store.dispatch('modal/open', {
			component: child,
			props: { id: '123' },
		});

		expect(Object.keys(shallowWrapper.vm.$store.state.modal.queue).length).toBe(2);
		expect(shallowWrapper.vm.$store.getters['modal/lastOpened'].props.id).toBe('123');

		shallowWrapper.vm.$store.dispatch('modal/closeAll');

		expect(Object.keys(shallowWrapper.vm.$store.state.modal.queue).length).toBe(0);
	});

	it('closes the modal after x time', () => {
		const child = shallowMount({
			template: '<section></section>',
			props: { id: { type: String } },
		});

		jest.useFakeTimers();

		shallowWrapper.vm.$store.dispatch('modal/open', {
			component: child,
			props: { id: 'abc', timeout: 1000 },
		});

		expect(Object.keys(shallowWrapper.vm.$store.state.modal.queue).length).toBe(1);

		jest.runOnlyPendingTimers();

		expect(Object.keys(shallowWrapper.vm.$store.state.modal.queue).length).toBe(0);
	});
});
