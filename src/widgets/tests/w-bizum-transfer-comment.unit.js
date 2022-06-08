import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-bizum-transfer-comment';
import CButton from '@tests/stubs/c-button.stub';
import CInput from '@tests/stubs/c-text-field.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-bizum-transfer-comment.vue', () => {
	let wp;
	let value;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		value = {};

		const action = 'cancel';

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { value, action },
			stubs: { CButton, CTransferField: CInput },
		});

		wp.vm.$on(wp.vm.$options.model.event, (event) => {
			wp.setProps(wp.vm.$options.model.prop, event);
			value = event;
		});
	});

	it("has a name equal 'w-bizum-transfer-comment'", () => {
		expect(wp.vm.$options.name).toBe('w-bizum-transfer-comment');
	});

	/**
	 * Debería validar que el concepto sea menor que 255 caracteres.
	 */
	it('validate comment', async () => {
		await wp.find('[data-testid="comment"]').setValue('a'.repeat(256));
		expect(wp.find('[for="w-bizum-transfer-comment__comment"]').text()).toBe(
			wp.vm.$t('TRANSFERS.ERROR_FIELD_LENGTH', { length: 255 })
		);
	});

	/**
	 * No debería actualizar el modelo si el usuario presiona continuar
	 * y hay algún error en el formulario.
	 */
	it('dont update model value on submit if form has errors', async () => {
		await wp.find('[data-testid="comment"]').setValue('a'.repeat(256));
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(value).toStrictEqual({});
	});

	/**
	 * Debería actualizar el modelo si el usuario presiona continuar
	 * aún si no ha metido ningún comentario porque es opcional.
	 */
	it('update model value on submit even if no comment is enter', async () => {
		await wp.find('[data-testid="comment"]').setValue('');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(value).toMatchObject({
			additionalJustification: '',
			validated: true,
		});
	});

	/**
	 * Debería actualizar el modelo si el usuario presiona continuar
	 * después de meter un comentario.
	 */
	it('update model value on submit', async () => {
		await wp.find('[data-testid="comment"]').setValue('vamos a ver que tal');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(value).toMatchObject({
			additionalJustification: 'vamos a ver que tal',
			validated: true,
		});
	});
});
