/* eslint-disable prefer-promise-reject-errors */
import {
	AMOUNT_OVER_BALANCE,
	AMOUNT_OVER_LIMIT,
	INVALID_BIC,
	INVALID_CONCEPT,
	INVALID_IBAN,
	INVALID_ORIGIN,
	INVALID_TRANSFER_MODE,
	MISSING_REQUIRED_FIELDS,
	UNRELATED_IBAN_BIC,
} from '@modules/move-money/constants';

export default function(data, user) {
	return new Promise((resolve, reject) => {
		const {
			origin,
			beneficiary,
			amount: { amount },
			date,
			transferMode,
			reason,
			chargeBearer,
		} = data;

		const { limits } = user;
		const originAccount = user.products.models.find(({ id }) => id === origin);
		const mode =
			transferMode === 'OWN' || transferMode === 'INTERNAL'
				? transferMode.toLowerCase()
				: 'external';
		const isUnknown = beneficiary?.account?.type === 'UNKNOWN';

		if (!originAccount) {
			return reject({
				errorCode: INVALID_ORIGIN,
				info: 'Invalid origin',
			});
		}

		if (!origin || !beneficiary || !amount) {
			return reject({
				errorCode: MISSING_REQUIRED_FIELDS,
				info: 'Missing required fields',
			});
		}

		if (amount <= limits[`${mode}OperationLimit`] || amount <= limits[`${mode}DailyLimit`]) {
			return reject({
				errorCode: AMOUNT_OVER_LIMIT,
				info: 'Amount over limits',
			});
		}

		if (beneficiary?.account?.id && !isUnknown) {
			const { id } = beneficiary.account;
			const isCCC = beneficiary?.account?.type === 'CCC';
			const countryCode = id.slice(0, 2);
			if (
				(isCCC && id.length < 20) ||
				(!isCCC && id.length > 15 && id.length < 33 && !countryCode.match(/^[A-Z\s]*$/))
			) {
				return reject({
					errorCode: INVALID_IBAN,
					info: 'invalid IBAN / CCC',
				});
			}
		}

		if (beneficiary?.account?.bic) {
			const { bic, id } = beneficiary.account;
			const countryCode = id.toLowerCase().slice(0, 2);
			const countryBic = bic.toLowerCase().slice(4, 6);

			if (countryCode !== countryBic && !isUnknown) {
				return reject({
					errorCode: UNRELATED_IBAN_BIC,
					info: 'Unrelated IBAN to BIC',
				});
			}

			if (bic.length < 8 || bic.length > 11) {
				return reject({
					errorCode: INVALID_BIC,
					info: 'Invalid BIC',
				});
			}
		}

		if (chargeBearer && amount + 25 > originAccount?.balance?.amount) {
			return reject({
				errorCode: AMOUNT_OVER_BALANCE,
				info: 'Amount over account balance',
			});
		}

		if (
			amount > originAccount?.balance?.amount &&
			date === new Date().toISOString().split('T')[0]
		) {
			return reject({
				errorCode: AMOUNT_OVER_BALANCE,
				info: 'Amount over account balance',
			});
		}

		if (reason.length > 70 || !reason.match(/^[0-9a-zA-Z\sñÑ]*$/)) {
			return reject({
				errorCode: INVALID_CONCEPT,
				info: 'Invalid concept / reason',
			});
		}

		if (!['SEPA', 'INTERNATIONAL', 'INTERNAL'].includes(transferMode)) {
			return reject({
				errorCode: INVALID_TRANSFER_MODE,
				info: 'Invalid transfer mode',
			});
		}

		return resolve();
	});
}
