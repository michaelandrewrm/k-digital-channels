import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@widgets/w-search';
import CTextField from '@tests/stubs/c-text-field.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-search', () => {
	let wp;
	let store;
	let router;
	const fixture = {
		id: 'user-1',
		coreUserId: 1234567,
		documentNumber: 'document-1',
		name: 'name-1',
		surname1: 'surname-1',
		surname2: 'surname-2',
	};
	const data = {
		data: [fixture],
		totalPages: 1,
		totalElements: 1,
		pageNumber: 0,
		pageSize: 25,
		sortedBy: 'name',
	};
	const CTextFieldIcon = { template: '<i v-bind="$attrs" v-on="$listeners"><slot /></i>' };
	const CPagination = {
		template: `
			<div data-testid="pagination">
				<button
					v-for="page in [1, 2, 3]"
					:key="page"
					@click="$emit('update:pageNumber', page)
				">
					{{ page }}
				</button>
			</div>`,
		model: {
			prop: 'pageNumber',
			event: 'update:pageNumber',
		},
		props: {
			pageNumber: { type: Number },
		},
	};

	const fetchUsers = jest.fn().mockResolvedValue(data);

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('agent', { fetchUsers });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { currentCompany: 'BC' },
			stubs: { CTextField, CTextFieldIcon, CPagination },
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to w-search', () => {
		expect(wp.vm.$options.name).toBe('w-search');
	});

	it('avoids whitespace on search field', async () => {
		await wp.find('[data-testid="search-field"]').setValue(' ');
		expect(wp.find('[data-testid="search-field"]').element.value).toBe('');

		await wp.find('[data-testid="search-field"]').setValue(' abc ');
		expect(wp.find('[data-testid="search-field"]').element.value).toBe('abc');
	});

	it('avoids an empty search', async () => {
		await wp.find('[data-testid="search-field"]').trigger('keypress.enter');
		expect(fetchUsers).not.toHaveBeenCalled();
	});

	it('shows a search result', async () => {
		expect(wp.find('[data-testid=search-result]').exists()).toBeFalsy();

		await wp.find('[data-testid=document-filter]').trigger('click');
		await wp.find('[data-testid=search-field]').setValue('document-1');
		await wp.find('[data-testid=search-field]').trigger('keypress.enter');
		await flushPromises();

		expect(fetchUsers).toHaveBeenCalled();
		expect(wp.find('[data-testid=search-result]').exists()).toBeTruthy();
	});

	it('emits a close event after select an user', async () => {
		await wp.find('[data-testid="search-field"]').setValue('name-1');
		await wp.find('[data-testid="search-field"]').trigger('keypress.enter');
		await flushPromises();

		await wp.find('[data-testid="select-user"]').trigger('click');

		expect(wp.emitted().close).toBeTruthy();
	});

	it('should fetch the next page', async () => {
		await wp.find('[data-testid=document-filter]').trigger('click');
		await wp.find('[data-testid=search-field]').setValue('document-1');
		await wp.find('[data-testid=search-field]').trigger('keypress.enter');
		await flushPromises();

		await wp
			.findAll('[data-testid="pagination"] button')
			.at(1)
			.trigger('click');

		expect(fetchUsers).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				companyId: 'BC',
				filter: 'documentNumber',
				pageNumber: 2,
				search: 'document-1',
			})
		);
	});
});
