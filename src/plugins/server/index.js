import { Server, Model, Response, belongsTo, hasMany } from 'miragejs';
import IdentityManager from './identity-manager';
import seeds from './seeds';
import Login from './mock-login';
import KeyExchange from './mock-key-exchange';
import AssociateUuids from './mock-associate-uuids';
import UserPassword from './mock-user-password';
import Validation from './mock-validation';
import Products from './mock-products';
import ProductsAlias from './mock-product-alias';
import ProductPosition from './mock-product-position';
import ProductCardCVV from './mock-product-card-cvv';
import ProductCardPIN from './mock-product-card-pin';
import ProductCardPAN from './mock-product-card-pan';
import Portfolio from './mock-product-portfolio';
import Movements from './mock-movements';
import Movement from './mock-movement';
import Documents from './mock-documents';
import Repayments from './mock-product-repayments';
import Receipts from './mock-product-receipts';
import Assets from './mock-assets';
import Cashflow from './mock-cashflow';
import Transfers from './mock-transfers';
import PersonalDetails from './mock-personal-details';
import MoveMoneyOrigins from './mock-move-money-origins';
import MoveMoneyDestinations from './mock-move-money-destinations';
import MoveMoneySimulate from './mock-move-money-simulate';
import MoveMoneyTransfer from './mock-move-money-transfer';
import MoveMoneyLimits from './mock-move-money-limits';
import MoveMoneyValidateIBAN from './mock-move-money-validate-iban';
import MoveMoneyDelete from './mock-move-money-delete';
import MoveMoneyModify from './mock-move-money-modify';
import MoveMoneyFavoriteValidate from './mock-move-money-favorite-validate';
import MoveMoneyTransferDetail from './mock-move-money-transfer-detail';
import CommunicationsFeedback from './mock-communications-feedback';
import CommunicationsUnreadMessages from './mock-communications-unread-messages';
import CommunicationsMessages from './mock-communications-messages';
import CommunicationsDocuments from './mock-communications-documents';
import CommunicationsEditMessages from './mock-communications-edit-messages';
import CommunicationsEditDocuments from './mock-communications-edit-documents';
import CommunicationsDownloadDocument from './mock-communications-download-document';
import CommunicationsCommunications from './mock-communications-communications';
import CommunicationsPatch from './mock-communications-patch';
import BizumONGs from './mock-bizum-ongs';
import Contracts from './mock-contracts';
import ContractsPatch from './mock-contracts-patch';
import WebviewLogin from './mock-webview-login';
import SSOLogin from './mock-sso-login';
import Session from './mock-session';
import Notifications from './mock-notifications';
import NotificationsPush from './mock-notifications-push';
import Signatures from './mock-signatures';
import BizumActive from './mock-bizum-active';
import BizumSettings from './mock-bizum-settings';
import BizumSignUp from './mock-bizum-signup';
import BizumDelete from './mock-bizum-delete';
import BizumTerms from './mock-bizum-terms';
import BizumSendMoney from './mock-bizum-send-money';
import BizumWhitelist from './mock-bizum-whitelist';
import BizumAddressBook from './mock-bizum-addressbook';
import BizumSaveMovement from './mock-bizum-save-movement';
import BizumSelae from './mock-bizum-selae';
import FactoryAgent from './factory-agents';
import FactoryUser from './factory-users';
import FactoryProduct from './factory-products';
import FactoryMovements from './factory-movements';
import FactoryAssets from './factory-assets';
import FactoryTransfer from './factory-transfer';
import FactoryMessages from './factory-messages';
import FactoryDocuments from './factory-documents';
import FactoryCommunications from './factory-communications';
import FactoryContract from './factory-contracts';
import FactorySignature from './factory-signature';
import FactoryCorreosCash from './factory-correos-cash';
import FactoryProfile from './factory-profile';
import FactorySirvase from './factory-sirvase';
import CorreosCash from './mock-correos-cash';
import Withholdings from './mock-product-withholdings';
import Profiles from './mock-profiles';
import MovementComment from './mock-comment';
import KeepAlive from './mock-keep-alive';
import DeleteCache from './mock-delete-cache';
import Ontime from './mock-ontime';
import SirvaseEfectuar from './mock-sirvase';
import LighthouseHybridization from './mock-lighthouse-hybridization';

export function makeServer({ environment = 'development' } = {}) {
	return new Server({
		environment,

		models: {
			agent: Model.extend({ session: belongsTo() }),
			user: Model.extend({
				session: belongsTo(),
				products: hasMany(),
				transfers: hasMany(),
				messages: hasMany(),
				documents: hasMany(),
				contracts: hasMany(),
				signatures: hasMany(),
				correosCash: hasMany(),
				profiles: hasMany(),
				sirvase: hasMany(),
			}),
			session: Model.extend({ user: belongsTo() }),
			process: Model,
			product: Model.extend({
				user: belongsTo(),
				movements: hasMany(),
				assets: hasMany(),
				products: hasMany(),
			}),
			movement: Model.extend({ product: belongsTo() }),
			asset: Model.extend({ product: belongsTo() }),
			transfer: Model.extend({ user: belongsTo() }),
			message: Model.extend({ user: belongsTo() }),
			document: Model.extend({ user: belongsTo() }),
			communication: Model,
			contract: Model.extend({ user: belongsTo(), profiles: hasMany() }),
			signature: Model.extend({ user: belongsTo() }),
			correosCash: Model.extend({ user: belongsTo() }),
			profile: Model.extend({ user: belongsTo(), contract: belongsTo() }),
			sirvase: Model.extend({ user: belongsTo() }),
		},

		factories: {
			agent: FactoryAgent,
			user: FactoryUser,
			product: FactoryProduct,
			movement: FactoryMovements,
			transfer: FactoryTransfer,
			asset: FactoryAssets,
			message: FactoryMessages,
			document: FactoryDocuments,
			communication: FactoryCommunications,
			contract: FactoryContract,
			signature: FactorySignature,
			correosCash: FactoryCorreosCash,
			profile: FactoryProfile,
			sirvase: FactorySirvase,
		},

		identityManagers: {
			application: IdentityManager,
		},

		seeds,

		routes() {
			this.urlPrefix = process.env.VUE_APP_ENDPOINT;
			this.namespace = '';
			this.timing = 400;

			this.post('/key-exchange', KeyExchange.bind(this));
			this.post('/associate-uuids', AssociateUuids.bind(this));
			this.post('/login', Login.bind(this));
			this.put('/current/user/password', UserPassword.bind(this));
			this.post('/users/password', UserPassword.bind(this));
			this.put('/users/password', UserPassword.bind(this));
			this.patch('/validation/:processId', Validation.bind(this));
			this.get('/products', Products.bind(this));
			this.get('/products/:productId', Products.bind(this));
			this.get('/products/:productId/position', ProductPosition.bind(this));
			this.get('/products/:productId/managedProducts', Portfolio.bind(this));
			this.get('/products/:productId/repayments', Repayments.bind(this));
			this.get('/products/:productId/receipts', Receipts.bind(this));
			this.get('/products/:productId/cvv', ProductCardCVV.bind(this));
			this.get('/products/:productId/pin', ProductCardPIN.bind(this));
			this.get('/products/:productId/pan', ProductCardPAN.bind(this));
			this.put('/products/:productId/alias', ProductsAlias.bind(this));
			this.get('/products/:productId/holderCertificate', Documents.bind(this));
			this.get('/products/:productId/movements', Movements.bind(this));
			this.get('/products/:productId/impositions', Movements.bind(this));
			this.get('/products/:productId/movements/withholdings', Withholdings.bind(this));
			this.get('/products/:productId/movements/:movementId', Movement.bind(this));
			this.get('/products/:productId/impositions/:movementId', Movement.bind(this));
			this.get('/products/:productId/movements/:movementId/document', Documents.bind(this));
			this.get(
				'/products/:productId/movements/:movementId/transferCertificate',
				Documents.bind(this)
			);
			this.get('/products/:productId/assets', Assets.bind(this));
			this.get('/products/:productId/assets/:assetId', Products.bind(this));
			this.get('/products/:productId/assets/:assetId/movements', Movements.bind(this));
			this.put('/products/movements/comments/:commentId', MovementComment.bind(this));
			this.delete('/products/movements/comments/:commentId', MovementComment.bind(this));
			this.post('/products/:productId/movements/:movementId/comment', MovementComment.bind(this));
			this.get('/products/:productId/lighthouse-hybridization', LighthouseHybridization.bind(this));
			this.get('/cashflow', Cashflow.bind(this));
			this.get('/move-money/origins', MoveMoneyOrigins.bind(this));
			this.get('/move-money/destinations', MoveMoneyDestinations.bind(this));
			this.get('/move-money/validateBICIBAN', MoveMoneyValidateIBAN.bind(this));
			this.get('/move-money/transfers/limits', MoveMoneyLimits.bind(this));
			this.post('/move-money/transfers/simulate', MoveMoneySimulate.bind(this));
			this.post('/move-money/transfers', MoveMoneyTransfer.bind(this));
			this.get('/move-money/transfers/detail', MoveMoneyTransferDetail.bind(this));
			this.get('/move-money/transfers', Transfers.bind(this));
			this.get('/move-money/transfers/:transferId', Transfers.bind(this));
			this.get('/move-money/transfers/scheduled', Transfers.bind(this));
			this.get('/move-money/favorites', Transfers.bind(this));
			this.get('/move-money/favorites/validate', MoveMoneyFavoriteValidate.bind(this));
			this.delete('/move-money/transfers/:transferId', MoveMoneyDelete.bind(this));
			this.delete('/move-money/favorites/:transferId', MoveMoneyDelete.bind(this));
			this.delete('/move-money/transfers/scheduled/:transferId', MoveMoneyDelete.bind(this));
			this.put('/move-money/transfers/scheduled/:transferId', MoveMoneyModify.bind(this));
			this.get('/move-money/transfers/:transfersId/document', Documents.bind(this));
			this.post('/move-money/correos-cash/deposit', CorreosCash.bind(this));
			this.get('/move-money/correos-cash/deposits', CorreosCash.bind(this));
			this.get('/current/user/', PersonalDetails.bind(this));
			this.post('/communications/feedback', CommunicationsFeedback.bind(this));
			this.get('/communications/unread-messages', CommunicationsUnreadMessages.bind(this));
			this.get('/communications/messages', CommunicationsMessages.bind(this));
			this.get('/communications/documents', CommunicationsDocuments.bind(this));
			this.get(
				'/communications/documents/:documentId/document',
				CommunicationsDownloadDocument.bind(this)
			);
			this.patch('/communications/messages/:messageId', CommunicationsEditMessages.bind(this));
			this.patch('/communications/documents/:documentId', CommunicationsEditDocuments.bind(this));
			this.get('/prelogin/communications', CommunicationsCommunications.bind(this));
			this.get('/communications/communications', CommunicationsCommunications.bind(this));
			this.patch('/communications/communications/:communicationId', CommunicationsPatch.bind(this));
			this.get('/contracts', Contracts.bind(this));
			this.patch('/contracts/:contractId', ContractsPatch.bind(this));
			this.get('/current/user/sso-login', SSOLogin.bind(this));
			this.get('/customer-support/request', SirvaseEfectuar.bind(this));
			this.get('/customer-support/request/:requestId', SirvaseEfectuar.bind(this));
			this.post('/customer-support/request', SirvaseEfectuar.bind(this));
			this.get('/customer-support/typology', SirvaseEfectuar.bind(this));
			this.get('/notifications/push', NotificationsPush.bind(this));
			this.post('/notifications/push', NotificationsPush.bind(this));
			this.get('/notifications/:userId', Notifications.bind(this));
			this.patch('/notifications/:userId', Notifications.bind(this));
			this.post('/webview-login', WebviewLogin.bind(this));
			this.delete('/session', Session.bind(this));
			this.get('/bizum/active', BizumActive.bind(this));
			this.get('/bizum/settings', BizumSettings.bind(this));
			this.get('/bizum/terms', BizumTerms.bind(this));
			this.get('/bizum/signup', BizumSignUp.bind(this));
			this.post('/bizum/signup', BizumSignUp.bind(this));
			this.delete('/bizum/signup', BizumDelete.bind(this));
			this.get('/bizum/movements', Movements.bind(this));
			this.get('/bizum/movements/:movementId', Movement.bind(this));
			this.put('/bizum/movements/:movementId', BizumSaveMovement.bind(this));
			this.post('/bizum/addressbook', BizumAddressBook.bind(this));
			this.post('/bizum/send-money', BizumSendMoney.bind(this));
			this.put('/bizum/send-money/:bizumId', BizumSendMoney.bind(this));
			this.put('/bizum/send-money/:bizumId/accept', BizumSendMoney.bind(this));
			this.post('/bizum/request-money', BizumSendMoney.bind(this));
			this.put('/bizum/request-money/:bizumId', BizumSendMoney.bind(this));
			this.put('/bizum/request-money/:bizumId/accept', BizumSendMoney.bind(this));
			this.get('/bizum/whitelist', BizumWhitelist.bind(this));
			this.get('/bizum/ongs', BizumONGs.bind(this));
			this.post('/bizum/selae', BizumSelae.bind(this));
			this.get('/bizum/selae/:operationId', BizumSelae.bind(this));
			this.get('/signature', Signatures.bind(this));
			this.delete('/signature/:signatureId', Signatures.bind(this));
			this.put('/signature/:signatureId', Signatures.bind(this));
			this.patch('/signature/:signatureId', Signatures.bind(this));
			this.get('/profiles', Profiles.bind(this));
			this.post('/profiles', Profiles.bind(this));
			this.put('/profiles/:profileId', Profiles.bind(this));
			this.patch('/profiles/:profileId', Profiles.bind(this));
			this.delete('/profiles/:profileId', Profiles.bind(this));
			this.get('/keep-alive', KeepAlive.bind(this));
			this.delete('/cache', DeleteCache.bind(this));
			this.get('/ontime', Ontime.bind(this));
			this.get('/ontime/movements', Ontime.bind(this));
			this.patch('/ontime', Ontime.bind(this));
		},
	});
}

export function makeServerForCypress({ environment = 'test' } = {}) {
	return new Server({
		environment,
		routes() {
			this.urlPrefix = process.env.VUE_APP_ENDPOINT;
			this.namespace = '';

			const methods = ['get', 'put', 'patch', 'post', 'delete'];
			methods.forEach((method) => {
				this[method]('/*', async (schema, request) => {
					const [status, headers, body] = await window.handleFromCypress(request);
					return new Response(status, headers, body);
				});
			});
		},
	});
}
