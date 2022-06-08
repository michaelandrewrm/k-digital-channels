import { Response } from 'miragejs';
import { OTP_REQUIRED } from '@modules/service/constants';
import { faker } from '@faker-js/faker';

export default class SignedOperation extends Response {
	constructor(schema, handler) {
		const processId = faker.datatype.uuid();

		schema.processes.create({
			id: processId,
			otp: '123456',
			attempts: 0,
			handler,
		});

		const body = {
			errorCode: OTP_REQUIRED,
			additionalInfo: { processId },
		};

		super(403, {}, body);
	}
}
