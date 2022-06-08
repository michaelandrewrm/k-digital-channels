import BwipJs from 'bwip-js';
import SessionCache from '@modules/session/session-cache';

const cache = new SessionCache('correos-cash');

const normalizeModel = (model) => {
	const result = {
		beneficiaryProductNumber: model.destination.account.id,
		amount: model.amount.amount,
	};

	return result;
};

export default {
	namespaced: true,

	actions: {
		request({ dispatch }, model) {
			const payload = normalizeModel(model);
			const url = '/move-money/correos-cash/deposit';
			const method = 'POST';

			return dispatch(
				'service/request',
				{
					service: {
						request: { url, method },
					},
					payload,
				},
				{ root: true }
			).then(({ data }) => data);
		},

		get({ dispatch }, { paginationKey, depositId }) {
			if (depositId) {
				return cache.get(`item/${depositId}`);
			}

			const cacheKey = 'list/correos-cash';
			const queryParams = {};
			const url = '/move-money/correos-cash/deposits';
			const method = 'GET';

			if (cache.has(cacheKey) && !paginationKey) {
				return cache.get(cacheKey);
			}

			if (paginationKey) {
				Object.assign(queryParams, { paginationKey });
			}

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					queryParams,
				},
				{ root: true }
			).then(({ data }) => {
				data.data.forEach((item) => {
					if (item.details) {
						const details = item.details.map((qrData) => ({
							...qrData,
							beneficiary: item.beneficiary,
						}));

						Object.assign(item, { details });
					}

					cache.set(`item/${item.id}`, item);
				});

				if (cache.has(cacheKey)) {
					const result = cache.get(cacheKey);

					Object.assign(data.data, result.data.concat(data.data));
				}

				cache.set(cacheKey, data);

				return data;
			});
		},

		generateCodeData(context, data) {
			const xml = `
				<ORDEN>
					<OP>${data.operationId /* istanbul ignore next */ || ''}</OP>
					<CL>${data.clientId /* istanbul ignore next */ || ''}</CL>
					<IM>0</IM>
					<D1>${data.beneficiary.name /* istanbul ignore next */ || ''}</D1>
					<D2>${data.beneficiary.productNumber /* istanbul ignore next */ || ''}</D2>
					<R1>${data.issuerName /* istanbul ignore next */ || ''}</R1>
					<R2>${data.issuerFirstSurname /* istanbul ignore next */ || ''}</R2>
					<R3>${data.issuerSecondSurname /* istanbul ignore next */ || ''}</R3>
					<R4>${data.issuerCno /* istanbul ignore next */ || ''}</R4>
					<R5>${data.issuerPhone /* istanbul ignore next */ || ''}</R5>
					<RD1>${data.issuerAddress /* istanbul ignore next */ || ''}</RD1>
					<RD2>${data.issuerZipCode /* istanbul ignore next */ || ''}</RD2>
					<RD3>${data.issuerCity /* istanbul ignore next */ || ''}</RD3>
					<RD4>${data.issuerState /* istanbul ignore next */ || ''}</RD4>
					<RD5>${data.issuerCountry /* istanbul ignore next */ || ''}</RD5>
					<RN1>${data.issuerDoiType /* istanbul ignore next */ || ''}</RN1>
					<RN2>${data.issuerDoiNumber /* istanbul ignore next */ || ''}</RN2>
					<RN3>${data.issuerDoiExpiredDate /* istanbul ignore next */ || ''}</RN3>
					<RN4>${data.issuerDoiCountry /* istanbul ignore next */ || ''}</RN4>
					<RN5>${data.issuerBirthDate /* istanbul ignore next */ || ''}</RN5>
					<RN6>${data.issuerBirthCountry /* istanbul ignore next */ || ''}</RN6>
					<RN7>${data.issuerNationality /* istanbul ignore next */ || ''}</RN7>
				</ORDEN>
			`.replace(/(\r\n\t|\n|\r|\t)/gm, '');

			return xml;
		},

		async getQRCodesFromDeposit({ dispatch }, { depositId, mode = 'horizontal' }) {
			const deposit = await dispatch('get', { depositId });

			return dispatch('generateCodes', {
				mode,
				details: deposit.details,
			});
		},

		/* istanbul ignore next */
		generateCodes({ dispatch }, { details, mode = 'horizontal' }) {
			const rotate = {
				horizontal: 'N',
				vertical: 'R',
			}[mode];
			return Promise.all(
				details.map(async (detail, i) => {
					const canvas = document.createElement('canvas');

					const xml = await dispatch('generateCodeData', detail);

					BwipJs.render(
						{ bcid: 'pdf417', text: xml },
						BwipJs.DrawingCanvas(
							{
								bcid: 'pdf417',
								text: xml,
								paddingleft: 0,
								paddingright: 0,
								paddingtop: 0,
								paddingbottom: 0,
								textxalign: 'center',
								monochrome: true,
								backgroundcolor: 'ffffff',
								rotate,
							},
							canvas
						)
					);
					const id = `barcode-${i + 1}`;
					canvas.id = id;

					return {
						id,
						amount: detail.amount,
						base64Image: canvas.toDataURL('image/png', 1.0),
						canvas,
					};
				})
			);
		},
	},
};
