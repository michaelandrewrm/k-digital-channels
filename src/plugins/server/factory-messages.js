import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

faker.seed(1);

export default Factory.extend({
	type: { id: 1, name: 'alerta' },
	creationDate: () => faker.date.past().toISOString(),
	reviewDate: () => (faker.datatype.boolean() ? null : faker.date.past().toISOString()),
	expirationDate: () => faker.date.future().toISOString(),
	description: () => faker.lorem.sentence(4),
	text: () => faker.lorem.sentence(10),
	hasAttachment: false,
});
