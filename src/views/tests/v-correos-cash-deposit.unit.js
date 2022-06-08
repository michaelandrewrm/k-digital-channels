import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@views/v-correos-cash-deposit';
import CButton from '@tests/stubs/c-button.stub.js';

const newInstance = createPristineVue();
const { localVue } = newInstance;
const canvas = document.createElement('canvas');

describe('v-correos-cash-deposit.vue', () => {
	let wp;
	let store;
	let router;
	const WActions = {
		props: ['options'],
		template: `
			<div>
				<button
					:data-testid="opt.id"
					class="w-actions__btn"
					v-for="opt in options"
					:key="opt.id"
					@click="select(opt)"
				>
					{{ opt.title }}
				</button>
			</div>
		`,
		methods: {
			select: (option) => (option.action ? option.action() : null),
		},
	};
	const WState = {
		template: `
			<section v-bind="$attrs">
				<slot name="title" />
				<slot name="buttons" />
			</section>
		`,
	};

	const request = jest.fn().mockResolvedValue({
		beneficiary: { name: '', productNumber: '' },
		details: [{ id: '1' }],
	});
	const generateCodes = jest.fn().mockResolvedValue([
		{
			id: '1',
			amount: 123.45,
			base64Image: 'data:image/png;base64,...',
			canvas,
		},
	]);
	const open = jest.fn();
	const closeAll = jest.fn();

	beforeEach(() => {
		window.navigator.share = jest.fn();
		jest.useFakeTimers();

		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('correos-cash', { request, generateCodes });
		store.mockModule('notification', { open, closeAll });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: {
				CButton,
				WActions,
				'c-operation-success': WState,
				'c-operation-error': WState,
			},
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to v-correos-cash-deposit', () => {
		expect(wp.vm.$options.name).toBe('v-correos-cash-deposit');
	});

	it('should open a new window after click on find office', async () => {
		const openWindow = jest.spyOn(window, 'open');

		await wp.setData({
			model: {
				destination: { account: {}, view: { id: '', name: '' } },
				amount: { amount: 123.45, currency: { id: 'EUR' } },
			},
		});

		await wp.find('[data-testid="submit-transfer"]').trigger('click');

		jest.runAllTimers();

		await flushPromises();

		await wp.find('[data-testid="find-office"]').trigger('click');

		expect(openWindow).toHaveBeenCalled();
	});

	it('should emit a custom event after click on find office', async () => {
		await wp.setData({
			isHybrid: true,
			model: {
				destination: { account: {}, view: { id: '', name: '' } },
				amount: { amount: 123.45, currency: { id: 'EUR' } },
			},
		});

		await wp.find('[data-testid="submit-transfer"]').trigger('click');

		jest.runAllTimers();

		await flushPromises();

		await wp.find('[data-testid="find-office"]').trigger('click');

		window.addEventListener('open-external-browser', (event) => {
			expect(event.detail.url).toBe(
				'https://www.correos.es/es/es/herramientas/oficinas-buzones-citypaq/detalle'
			);
		});
	});

	it('should open a notification after click on download', async () => {
		await wp.setData({
			model: {
				destination: { account: {}, view: { id: '', name: '' } },
				amount: { amount: 123.45, currency: { id: 'EUR' } },
			},
		});

		await wp.find('[data-testid="submit-transfer"]').trigger('click');
		jest.runAllTimers();
		await flushPromises();
		await wp.find('[data-testid="download"]').trigger('click');

		expect(open).toHaveBeenCalledTimes(1);

		await wp.find('[data-testid="download"]').trigger('click');
		expect(open).toHaveBeenCalledTimes(1);
	});

	it('should open a notification after click on share', async () => {
		await wp.setData({
			model: {
				destination: { account: {}, view: { id: '', name: '' } },
				amount: { amount: 123.45, currency: { id: 'EUR' } },
			},
		});

		await wp.find('[data-testid="submit-transfer"]').trigger('click');
		jest.runAllTimers();
		await flushPromises();
		await wp.find('[data-testid="share"]').trigger('click');

		expect(open).toHaveBeenCalledTimes(1);

		await wp.find('[data-testid="share"]').trigger('click');
		expect(open).toHaveBeenCalledTimes(1);
	});

	it('should not show the share option when is not supported', async () => {
		window.navigator.share = undefined;

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: {
				CButton,
				WActions,
				'c-operation-success': WState,
				'c-operation-error': WState,
			},
		});

		await wp.setData({
			model: {
				destination: { account: {}, view: { id: '', name: '' } },
				amount: { amount: 123.45, currency: { id: 'EUR' } },
			},
		});

		await wp.find('[data-testid="submit-transfer"]').trigger('click');
		jest.runAllTimers();
		await flushPromises();

		expect(wp.find('[data-testid="share"]').exists()).toBeFalsy();
	});

	it('should show an error', async () => {
		store.mockModule('correos-cash', { request: jest.fn().mockRejectedValue() });

		await wp.setData({
			model: {
				destination: { account: {}, view: { id: '', name: '' } },
				amount: { amount: 123.45, currency: { id: 'EUR' } },
			},
		});

		await wp.find('[data-testid="submit-transfer"]').trigger('click');
		jest.runAllTimers();
		await flushPromises();

		expect(wp.find('[data-testid="operation-error"]')).toBeTruthy();
	});
});
