export default {
	/**
	 * @typedef {Object} credential
	 * @property {String} documentId
	 * @property {String} password
	 * @property {String} channel
	 * @property {String} deviceId
	 */

	/**
	 * Authenticate the payload generated by the encryption of
	 * the credentials with the symmetric key and seed obtained
	 * after register the public key.
	 * @param {credential} payload
	 */
	request: {
		url: '/assisted-channels/login',
		method: 'POST',
	},
};
