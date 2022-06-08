import { Factory, trait } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
	owner: trait({
		id: () => faker.datatype.uuid(),
		description: () => `${faker.name.firstName()} ${faker.name.lastName()}`,
		type: 'owner',
	}),
	user: trait({
		id: () => faker.datatype.uuid(),
		description: () => `${faker.name.firstName()} ${faker.name.lastName()}`,
		type: 'user',
	}),
});
