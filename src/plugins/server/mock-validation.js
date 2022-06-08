import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';
import { OTP_INVALID, OTP_EXPIRED, OTP_RENEWED, OTP_ERROR } from '@modules/service/constants';

export default async (schema, request) => {
	const { payload } = JSON.parse(request.requestBody);
	const { seed, key, user } = schema.sessions.find(request.requestHeaders.uuid);
	const data = await decryptAES({
		seed,
		key,
		data: payload,
	});
	const { otpValue } = data;
	const { processId } = request.params;
	const process = schema.processes.find(processId);

	if (otpValue === 'resend') {
		return new Response(403, {}, { errorCode: OTP_RENEWED });
	}

	if (otpValue === 'expire') {
		process.destroy();
		return new Response(403, {}, { errorCode: OTP_EXPIRED });
	}

	process.update({ attempts: process.attempts + 1 });

	if (otpValue === process.otp) {
		return process.handler();
	}

	if (process.attempts === 3) {
		user.update({ stateId: 'BLOCKED' });
		process.destroy();
		return new Response(403, {}, { errorCode: OTP_ERROR });
	}

	return new Response(403, {}, { errorCode: OTP_INVALID, additionalInfo: { processId } });
};
