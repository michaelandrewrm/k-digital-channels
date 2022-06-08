import { Factory, trait } from 'miragejs';
import { faker } from '@faker-js/faker';

faker.seed(1);

export default Factory.extend({
	name: () => faker.name.firstName(),
	rememberToken: () => faker.datatype.uuid(),
	authToken: () => faker.datatype.uuid(),
	userId: 'C00',
	password: '123456',
	loginErrorCount: 0,
	stateId: 'ACTIVE',
	blocked: trait({
		stateId: 'BLOCKED',
	}),
});
