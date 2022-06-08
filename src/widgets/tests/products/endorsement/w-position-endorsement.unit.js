import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/endorsement/w-position-endorsement';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const source = {
	id: 'endorsement-1',
	alias: 'AVAL DEFINITIVO',
	name: 'AVAL DEFINITIVO',
	productSubtype: { id: '20', name: 'Aval' },
	productType: { id: '08', name: 'Avales' },
	guarantyId: 1234567890,
	guarantyAmount: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
	startingAmount: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
	outstandingAmount: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
};

describe('w-position-endorsement.vue', () => {
	let wp;

	const CListIconItem = {
		template: `
			<div class="c-list-icon-item" v-bind="$attrs">
				<div class="c-list-icon-item__col1" v-if="icon">
					<c-icon :src="icon" size="xs" />
				</div>
				<dl class="c-list-icon-item__col2">
					<dt class="c-list-icon-item__title text-m-medium">{{ title }}</dt>
					<dd v-if="description || $slots.default" class="c-list-icon-item__description text-m-light">
						<span v-if="description">
							{{ description }}
						</span>
						<span v-else-if="$slots.default" class="c-list-icon-item__description text-m-light">
							<slot />
						</span>
						<div class="c-button-copy-to-clipboard" v-if="copyable" :copyTitle="title" :copyText="description" />
					</dd>
				</dl>
			</div>
		`,
		props: {
			title: { type: null },
			description: { type: null },
			icon: { type: null },
			copyable: { type: Boolean },
		},
	};

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: { source },
			stubs: { CListIconItem },
		});
	});

	it('has a name equal to w-position-endorsement', () => {
		expect(wp.vm.$options.name).toBe('w-position-endorsement');
	});

	it('renders correctly', async () => {
		expect(wp).toMatchSnapshot();
	});
});
