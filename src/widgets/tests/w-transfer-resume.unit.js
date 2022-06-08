import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-resume.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-transfer-resume.vue', () => {
	let wp;

	const fixture = {
		origin: {
			alias: 'Cuenta transparente',
			productNumber: {
				format: 'IBAN',
				value: 'ES7921000813610123456789',
			},
		},
		destination: {
			view: {
				name: 'Esteban Gonzalez',
				id: 'FR7630006000011234567890189',
			},
			transferMode: 'SEPA',
		},
		amount: { amount: 25.5, currency: { id: 'EUR' } },
		date: new Date().toISOString(),
		periodicity: 'periodic',
		frequency: '0.5',
		reason: 'Transferencia',
	};

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: { model: fixture, invalidSection: [] },
		});
	});

	it('has a name equal to w-transfer-resume', () => {
		expect(wp.vm.$options.name).toBe('w-transfer-resume');
	});

	it('has a resume of the transfer model', async () => {
		const sectionOrigin = wp.find('[data-testid="section-origin"]');
		const sectionDestination = wp.find('[data-testid="section-destination"]');
		const sectionAmount = wp.find('[data-testid="section-amount"]');
		const sectionMaxDate = wp.find('[data-testid="section-max-date"]');

		expect(sectionOrigin.text()).toContain('Cuenta transparente');
		expect(sectionDestination.text()).toContain('Esteban Gonzalez');
		expect(sectionAmount.text().replace(/\s/g, ' ')).toContain('Importe 25,50 €');
		expect(sectionMaxDate.text()).toContain('Quincenal');
		expect(sectionMaxDate.text()).not.toContain('finaliza');

		await wp.setProps({ model: { ...fixture, maxDate: new Date().toISOString() } });

		expect(sectionMaxDate.text()).toContain('finaliza');
	});

	it('resets the value if user clicks on a section and is editable', async () => {
		await wp.setProps({ editable: true });

		await wp.find('[data-testid="edit-destination"]').trigger('click');

		expect(wp.emitted().edit[0][0]).toBe('destination');

		await wp.find('[data-testid="edit-origin"]').trigger('click');

		expect(wp.emitted().edit[1][0]).toBe('origin');
	});

	it('prints the date in a human readable form', async () => {
		const today = new Date();
		const tomorrow = new Date(today);
		const pastTomorrow = new Date(today);

		tomorrow.setDate(tomorrow.getDate() + 1);
		pastTomorrow.setDate(pastTomorrow.getDate() + 2);

		await wp.setProps({ editable: true });

		const sectionDate = wp.find('[data-testid="section-date"]');

		await wp.setProps({ model: { ...fixture, date: today } });
		expect(sectionDate.text()).toContain('Hoy');

		await wp.setProps({ model: { ...fixture, date: tomorrow } });
		expect(sectionDate.text()).toContain('Mañana');

		await wp.setProps({ model: { ...fixture, date: pastTomorrow } });
		expect(sectionDate.text()).toContain('dentro de 2 días');
	});

	it('should invalid the origin section', async () => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				invalidSection: ['origin'],
				model: fixture,
				editable: true,
			},
		});

		const button = wp.find('[data-testid="edit-origin"]');
		expect(button.attributes('invalid')).toBeTruthy();
	});

	it('should invalid the destination section', async () => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				invalidSection: ['destination'],
				model: fixture,
				editable: true,
			},
		});

		const button = wp.find('[data-testid="edit-destination"]');
		expect(button.attributes('invalid')).toBeTruthy();
	});

	it('should invalid the amount section', async () => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				invalidSection: ['amount-balance'],
				model: fixture,
				editable: true,
			},
		});

		const button = wp.find('[data-testid="edit-amount"]');
		expect(button.attributes('invalid')).toBeTruthy();
	});

	it('should invalid the date section', async () => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				invalidSection: ['date'],
				model: fixture,
				editable: true,
			},
		});

		const button = wp.find('[data-testid="edit-date"]');
		expect(button.attributes('invalid')).toBeTruthy();
	});

	it('should invalid the frequency section', async () => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				invalidSection: ['frequency'],
				model: fixture,
				editable: true,
			},
		});

		const button = wp.find('[data-testid="edit-frequency"]');
		expect(button.attributes('invalid')).toBeTruthy();
	});

	it('should invalid the frequency reason', async () => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				invalidSection: ['reason'],
				model: fixture,
				editable: true,
			},
		});

		const button = wp.find('[data-testid="edit-reason"]');
		expect(button.attributes('invalid')).toBeTruthy();
	});

	it('should not show the warning date info for INTERNAL transfers', () => {
		Object.assign(fixture, {
			destination: { ...fixture.destination },
			periodicity: 'today',
			frequency: null,
		});

		wp = shallowMount(Component, {
			localVue,
			propsData: { model: fixture, invalidSection: [] },
		});

		expect(wp.find('[data-testid="warning-date"]').exists()).toBeTruthy();

		Object.assign(fixture, {
			destination: {
				view: {
					name: 'Esteban Gonzalez',
					id: 'ES4902340001090100214919',
				},
				transferMode: 'INTERNAL',
			},
			periodicity: 'today',
			frequency: null,
		});

		wp = shallowMount(Component, {
			localVue,
			propsData: { model: fixture, invalidSection: [] },
		});

		expect(wp.find('[data-testid="warning-date"]').exists()).toBeFalsy();
	});
});
