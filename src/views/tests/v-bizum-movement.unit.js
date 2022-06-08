import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-bizum-movement.vue';
import flushPromises from 'flush-promises';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-bizum-movement.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(async () => {
		const { shallowStore, shallowRouter } = newInstance;

		store = shallowStore;
		router = shallowRouter;

		router.addRoute({ name: 'bizum-transfer', path: '/bizum-transfer/:movementId/:action' });

		const getMovement = jest.fn().mockResolvedValue({
			type: { name: 'SENT' },
			status: { name: 'PENDING' },
			operationDate: '2019-12-25',
			reason: 'Comida',
			beneficiary: { name: 'Eduardo' },
			sender: { name: 'Francisco' },
			amount: { amount: 29.99, currency: { id: 'EUR' } },
		});

		store.mockModule('bizum', { getMovement });
	});

	it('has a name equal to v-bizum-movement', () => {
		wp = shallowMount(Component, { localVue, store, propsData: { movementId: '1' } });

		expect(wp.vm.$options.name).toBe('v-bizum-movement');
	});

	/**
	 * Debería pintarse el movimiento en la vista
	 */
	it('should render correctly', async () => {
		wp = shallowMount(Component, { localVue, store, propsData: { movementId: '1' } });
		await flushPromises();

		expect(
			wp
				.find('[data-testid="sheet"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Eduardo 29,99 € Pendiente');
	});

	/**
	 * Debería pintarse un movimiento del tipo de compra en comercio electrónico
	 */
	it('render a ecommerce movement correctly', async () => {
		const getMovement = jest.fn().mockResolvedValue({
			type: { name: 'SENT-ECOM' },
			status: { name: 'COMPLETED' },
			operationDate: '2019-12-25',
			reason: 'Compra en el corte inglés',
			beneficiary: { phone: '657136655' },
			sender: { name: 'Francisco' },
			amount: { amount: 100, currency: { id: 'EUR' } },
		});

		store.mockModule('bizum', { getMovement });

		wp = shallowMount(Component, { localVue, store, propsData: { movementId: '1' } });
		await flushPromises();

		expect(wp).toMatchSnapshot('ecommerce movement');
	});

	/**
	 * Debería mostrarse el contenido adicional de un movimiento
	 */
	it('show render the image and text', async () => {
		const getMovement = jest.fn().mockResolvedValue({
			id: '1',
			type: { name: 'RECEIVED' },
			status: { name: 'REJECTED' },
			operationDate: '2019-12-25',
			reason: 'Comida',
			beneficiary: { name: 'Eduardo' },
			sender: { name: 'Francisco' },
			amount: { amount: 29.99, currency: { id: 'EUR' } },
			additionalContext: [
				{
					type: 'C2CED',
					origin: 'beneficiary',
					imageFormat: 'JPG',
					image: 'R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
					text: 'dGUgZW52aW8gdW5hIGZvdG8g8J+Ymg==',
				},
				{
					type: 'C2CNSD',
					origin: 'beneficiary',
					text: 'bWUgYXJyZXBlbnTDrQ==',
				},
			],
			possibleActions: ['CANCEL'],
		});
		const open = jest.fn();

		store.mockModule('bizum', { getMovement });
		store.mockModule('modal', { open });

		const WActions = {
			props: { options: { type: Array } },
			template: `
			<div>
				<button
					v-for="({id, title, action}) in options"
					:key="id"
					:data-testid="'action-'+id"
					@click="action">
					{{title}}
				</button>
			</div>
			`,
		};

		const CListIconItem = {
			props: { title: String, description: String },
			template: `
				<dl v-bind="$attrs">
					<dt>{{title}}</dt>
					<dd v-if="$slots.default"><slot /></dd>
					<dd v-else-if="description">{{description}}</dd>
				</dl>
			`,
		};

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { movementId: '1' },
			stubs: { WActions, CListIconItem },
		});

		await flushPromises();

		expect(wp.find('[data-testid="content"]')).toMatchSnapshot('send-with-additional-content');
		expect(wp.find('[data-testid="content"]').text()).toContain('te envio una foto');
		expect(wp.find('[data-testid="justification"]').text()).toContain('me arrepentí');

		await wp.find('[data-testid="content"] img').trigger('click');
		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-image' }),
				props: { image: 'data:image/jpeg;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' },
			})
		);

		await wp.find('[data-testid="action-CANCEL"]').trigger('click');
		expect(router.currentRoute.name).toBe('bizum-transfer');
		expect(router.currentRoute.params).toMatchObject({ movementId: '1', action: 'cancel' });
	});

	/**
	 * Debería poderse eliminar el contenido adicional de una solicitud enviada.
	 */
	it('remove additional content', async () => {
		const movementData = {
			id: '1',
			type: { name: 'REQUEST-SENT' },
			status: { name: 'PENDING' },
			operationDate: '2021-10-19',
			reason: 'Comida',
			beneficiary: { name: 'SANDORST', phone: '+34639148010' },
			sender: { name: 'RAMSAYAP', phone: '+34607354441', account: 'ES8202340001089032279730' },
			amount: { amount: 3.99, currency: { id: 'EUR', code: '978' } },
			isDonation: false,
			possibleActions: ['CANCEL'],
		};
		const getMovement = jest
			.fn()
			.mockResolvedValueOnce({
				...movementData,
				additionalContext: [
					{
						type: 'C2CED',
						origin: 'beneficiary',
						imageFormat: 'JPG',
						image: 'R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
						text: 'dGUgZW52aW8gdW5hIGZvdG8g8J+Ymg==',
					},
					{
						type: 'C2CNSD',
						origin: 'beneficiary',
						text: 'bWUgYXJyZXBlbnTDrQ==',
					},
				],
			})
			.mockResolvedValueOnce(movementData);
		const deleteAdditionalContent = jest.fn().mockResolvedValue();
		const open = jest.fn().mockResolvedValue(true);

		store.mockModule('bizum', { getMovement, deleteAdditionalContent });
		store.mockModule('modal', { open });
		store.mockModule('notification', { open });

		const CListIconItem = {
			props: { title: String, description: String },
			template: `
				<dl v-bind="$attrs">
					<dt>{{title}}</dt>
					<dd v-if="$slots.default"><slot /></dd>
					<dd v-else-if="description">{{description}}</dd>
				</dl>
			`,
		};

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { movementId: '1' },
			stubs: { CListIconItem, CIconButton: CButton },
		});

		await flushPromises();

		expect(wp.find('[data-testid="additional-content-image"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="content"]')).toMatchSnapshot('request-with-additional-content');

		await wp.find('[data-testid="remove-additional-content"]').trigger('click');
		await flushPromises();

		expect(wp.find('[data-testid="additional-content-image"]').exists()).toBeFalsy();
	});

	/**
	 * Debería poderse eliminar el motivo de una cancelación de una solicitud enviada.
	 */
	it('remove additional justification', async () => {
		const movementData = {
			id: '1',
			type: { name: 'REQUEST-SENT' },
			status: { name: 'PENDING' },
			operationDate: '2021-10-19',
			reason: 'Comida',
			beneficiary: { name: 'SANDORST', phone: '+34639148010' },
			sender: { name: 'RAMSAYAP', phone: '+34607354441', account: 'ES8202340001089032279730' },
			amount: { amount: 3.99, currency: { id: 'EUR', code: '978' } },
			isDonation: false,
			possibleActions: ['CANCEL'],
		};
		const getMovement = jest
			.fn()
			.mockResolvedValueOnce({
				...movementData,
				additionalContext: [
					{
						type: 'C2CED',
						origin: 'beneficiary',
						imageFormat: 'JPG',
						image: 'R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
						text: 'dGUgZW52aW8gdW5hIGZvdG8g8J+Ymg==',
					},
					{
						type: 'C2CNSD',
						origin: 'beneficiary',
						text: 'bWUgYXJyZXBlbnTDrQ==',
					},
				],
			})
			.mockResolvedValueOnce(movementData);
		const deleteAdditionalJustification = jest.fn().mockResolvedValue();
		const open = jest.fn().mockResolvedValue(true);

		store.mockModule('bizum', { getMovement, deleteAdditionalJustification });
		store.mockModule('modal', { open });
		store.mockModule('notification', { open });

		const CListIconItem = {
			props: { title: String, description: String },
			template: `
				<dl v-bind="$attrs">
					<dt>{{title}}</dt>
					<dd v-if="$slots.default"><slot /></dd>
					<dd v-else-if="description">{{description}}</dd>
				</dl>
			`,
		};

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { movementId: '1' },
			stubs: { CListIconItem, CIconButton: CButton },
		});

		await flushPromises();

		expect(wp.find('[data-testid="justification"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="content"]')).toMatchSnapshot(
			'request-with-additional-justification'
		);

		await wp.find('[data-testid="remove-additional-justification"]').trigger('click');
		await flushPromises();

		expect(wp.find('[data-testid="justification"]').exists()).toBeFalsy();
	});
});
