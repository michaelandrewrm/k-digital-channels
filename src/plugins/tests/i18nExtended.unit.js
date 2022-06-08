import { createLocalVue, shallowMount } from '@vue/test-utils';
import i18nExtended from '@plugins/i18nExtended';

const clean = (str) => str.replace(/\xA0/g, ' ');

describe('plugin i18nExtended', () => {
	const localVue = createLocalVue();
	localVue.use(i18nExtended);

	const wp = shallowMount({ template: '<div/>' }, { localVue });

	it('does not show a sign when the number is positive and no options', () => {
		const amount = { amount: 1.25, currency: { id: 'EUR' } };
		const value = clean(wp.vm.$nc(amount));
		expect(value).toBe('1,25 €');
	});

	it('shows a positive sign when the number is positive', () => {
		const amount = { amount: 1.25, currency: { id: 'EUR' } };
		const value = clean(wp.vm.$nc(amount, { sign: true }));
		expect(value).toBe('+1,25 €');
	});

	it('shows a negative sign when the number is negative', () => {
		const amount = { amount: -1.25, currency: { id: 'EUR' } };
		const value = clean(wp.vm.$nc(amount, { sign: true }));
		expect(value).toBe('-1,25 €');
	});

	it('shows an absolute number even if the number is negative', () => {
		const amount = { amount: -1.25, currency: { id: 'EUR' } };
		const value = clean(wp.vm.$nc(amount, { absolute: true }));
		expect(value).toBe('1,25 €');
	});

	it('shows an absolute number when the number is positive', () => {
		const amount = { amount: 1.25, currency: { id: 'EUR' } };
		const value = clean(wp.vm.$nc(amount, { absolute: true }));
		expect(value).toBe('1,25 €');
	});
});
