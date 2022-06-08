import { faker } from '@faker-js/faker';

export default class {
	constructor() {
		this.ids = new Set();
	}

	fetch() {
		let uuid = faker.datatype.uuid();
		while (this.ids.has(uuid)) {
			uuid = faker.datatype.uuid();
		}

		this.ids.add(uuid);

		return uuid;
	}

	set(uuid) {
		if (this.ids.has(uuid)) {
			throw new Error(`Attempting to use the ID ${uuid}, but it's already been used`);
		}

		this.ids.add(uuid);
	}

	reset() {
		this.ids.clear();
	}
}
