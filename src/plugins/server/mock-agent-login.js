import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';
import {
	USER_NOT_FOUND,
	USER_WILL_BE_TEMP_BLOCKED,
	USER_WAS_TEMP_BLOCKED,
	USER_WILL_BE_PERMANENTLY_BLOCKED,
	USER_WAS_PERMANENTLY_BLOCKED,
} from '@modules/service/constants';

export default async (schema, request) => {
	const { payload } = JSON.parse(request.requestBody);
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { seed, key } = session;
	const returnError = (data) => {
		return new Response(401, {}, data);
	};
	const data = await decryptAES({
		seed,
		key,
		data: payload,
	});
	const user = schema.agents.findBy({ userId: data?.userId });

	if (user) {
		if (user.stateId === 'BLOCKED') {
			return returnError({ errorCode: USER_WAS_PERMANENTLY_BLOCKED });
		}

		if (user.password === data.password) {
			const response = {
				username: user.name,
				lastLogin: new Date().toISOString(),
			};

			if (data.userId) {
				Object.assign(response, { rememberToken: user.rememberToken });
			}

			user.update({ session });

			sessionStorage.setItem(
				'secure',
				JSON.stringify({
					rememberToken: user.rememberToken,
					password: user.authToken,
				})
			);

			return response;
		}

		if (user.authToken === data.password) {
			const response = {
				username: user.name,
				lastLogin: new Date().toISOString(),
			};

			user.update({ session });

			return response;
		}

		user.update({ loginErrorCount: user.loginErrorCount + 1 });

		switch (user.loginErrorCount) {
			case 1:
				return returnError({ errorCode: USER_NOT_FOUND });
			case 2:
				return returnError({ errorCode: USER_WILL_BE_TEMP_BLOCKED });
			case 3:
				return returnError({
					errorCode: USER_WAS_TEMP_BLOCKED,
					additionalInfo: { unlockingTime: 120000 },
				});
			case 4:
				return returnError({ errorCode: USER_NOT_FOUND });
			case 5:
				return returnError({ errorCode: USER_WILL_BE_TEMP_BLOCKED });
			case 6:
				return returnError({
					errorCode: USER_WAS_TEMP_BLOCKED,
					additionalInfo: { unlockingTime: 120000 },
				});
			case 7:
				return returnError({ errorCode: USER_NOT_FOUND });
			case 8:
				return returnError({ errorCode: USER_WILL_BE_PERMANENTLY_BLOCKED });
			case 9:
				user.update({ stateId: 'BLOCKED' });
				return returnError({ errorCode: USER_WAS_PERMANENTLY_BLOCKED });
			default:
				return returnError({ errorCode: USER_WAS_PERMANENTLY_BLOCKED });
		}
	}

	if (data?.companyId) {
		return;
	}

	return returnError({ errorCode: USER_NOT_FOUND });
};
