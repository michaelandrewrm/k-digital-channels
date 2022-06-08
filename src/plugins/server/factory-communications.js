import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

const types = [
	{ id: 1, name: 'Regulatorias', priority: 1 },
	{ id: 2, name: 'Comerciales', priority: 2 },
	{ id: 3, name: 'Operativas', priority: 3 },
];
const spaces = [
	{ id: 1, name: 'prelogin' },
	{ id: 2, name: 'globalpos' },
	{ id: 3, name: 'banner' },
];
const images = [
	'/news/w1cut.jpg',
	'/news/m1cut.jpg',
	'/news/w2cut.jpg',
	'/news/m2cut.jpg',
	'/news/w3cut.jpg',
	'/news/m3cut.jpg',
	'/news/m4cut.jpg',
];

faker.seed(1);

export default Factory.extend({
	type: () => faker.random.arrayElement(types),
	space: () => faker.random.arrayElement(spaces),
	creationDate: () => faker.date.past().toISOString(),
	title: () => faker.lorem.sentence(),
	body: () => faker.lorem.sentence(),
	imageURL: () => faker.random.arrayElement(images),
	feedback: () => faker.random.arrayElement([-1, 0, 1]),
	impressions: 0,
	ctaText: 'Pulse aquí',
	ctaAction: 'open_internal',
	ctaRedirect: () => faker.random.arrayElement(['/main/product-group/credit-card', null]),
});
