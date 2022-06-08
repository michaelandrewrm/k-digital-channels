import { Factory, trait } from 'miragejs';
import { faker } from '@faker-js/faker';

faker.seed(1);

export default Factory.extend({
	name: () => faker.name.firstName(),
	surname1: faker.name.lastName(),
	surname2: faker.name.lastName(),
	birthdate: faker.date
		.past()
		.toISOString()
		.split('T')[0]
		.split('-')
		.reverse()
		.join('/'),
	phone: faker.phone.phoneNumber(),
	email: faker.internet.email(),
	rememberToken: () => faker.datatype.uuid(),
	authToken: () => faker.datatype.uuid(),
	documentNumber: 'A00',
	password: '123456',
	loginErrorCount: 0,
	stateId: 'ACTIVE',
	push: true,
	smsByEmail: false,
	connectedContract: null,

	firstTime: trait({
		passwordChange: true,
		forceSCA: true,
	}),

	sca: trait({
		forceSCA: true,
	}),

	blocked: trait({
		stateId: 'BLOCKED',
	}),

	bizumData: () => {},

	afterCreate(user, server) {
		if (!user.products.models.length && !user.empty) {
			user.update({
				products: [...server.createList('product', 2, 'account')],
			});
		}

		if (!user.limits) {
			user.update({
				limits: {
					ownAccounts: 6000,
					internalAccounts: 6000,
					externalAccounts: 6000,
					postedInternalAccounts: 6000,
					postedExternalAccounts: 6000,
				},
			});
		}

		if (!user.contracts.length) {
			user.update({
				contracts: [...server.createList('contract', 1, 'owner')],
			});
		}

		const isBancofar = process.env.VUE_APP_CURRENT_PROJECT === 'bancofar';

		if (isBancofar) {
			user.update({
				products: [
					...user.products.models,
					...server.createList('product', 2, 'account'),
					...server.createList('product', 1, 'hefameAccount'),
				],
				correosCash: [...server.createList('correos-cash', 10)],
			});
		}
	},
});
