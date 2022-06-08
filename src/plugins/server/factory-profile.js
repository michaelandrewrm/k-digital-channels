import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
	id: () => faker.datatype.uuid(),
	name: () => faker.random.word(),
	default: false,
});
