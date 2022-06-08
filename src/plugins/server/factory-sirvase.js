import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';
import typologies from './sirvase-typologies';

const status = [
	{
		id: '01',
		name_es: 'Solicitada',
		name_en: 'Requested',
	},
	{
		id: '02',
		name_es: 'Realizada',
		name_en: 'Done',
	},
	{
		id: '03',
		name_es: 'Expirada',
		name_en: 'Expired',
	},
	{
		id: '04',
		name_es: 'Cancelada',
		name_en: 'Cancelled',
	},
];

function getFormattedDate() {
	const pastDate = () => faker.date.past();
	const date = new Date(pastDate());
	const day = `0${date.getDate()}`.slice(-2);
	const month = `0${date.getMonth() + 1}`.slice(-2);
	const year = date.getFullYear();
	const hours = `0${date.getHours()}`.slice(-2);
	const minutes = `0${date.getUTCMinutes()}`.slice(-2);

	return `${day}-${month}-${year} ${hours}:${minutes}:00`;
}

export default Factory.extend({
	id: () => faker.datatype.uuid(),
	type: () => faker.random.arrayElement(typologies),
	requestDate: () => getFormattedDate(),
	status: () => faker.random.arrayElement(status),
	description: () => faker.lorem.paragraph(),
});
