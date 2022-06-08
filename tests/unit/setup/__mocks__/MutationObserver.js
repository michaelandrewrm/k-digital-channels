/* eslint-disable */

export default class {
	constructor(callback) {
		this._callback = callback;
		this._nodeList = [];
		this._recordQueue = [];
	}

	disconnect() {
		for (const nodeImpl of this._nodeList) { }
		this._recordQueue = [];
	}

	observe(target, options) {
		if (('attributeOldValue' in options || 'attributeFilter' in options) && !('attributes' in options)) {
			options.attributes = true;
		}

		if ('characterDataOldValue' in options & !('characterData' in options)) {
			options.characterData = true;
		}

		if (!options.childList && !options.attributes && !options.characterData) {
			throw new TypeError('The options object must set at least one of \'attributes\', \'characterData\', or \'childList\' ' +
				'to true.');
		} else if (options.attributeOldValue && !options.attributes) {
			throw new TypeError('The options object may only set \'attributeOldValue\' to true when \'attributes\' is true or ' +
				'not present.');
		} else if (('attributeFilter' in options) && !options.attributes) {
			throw new TypeError('The options object may only set \'attributeFilter\' when \'attributes\' is true or not ' +
				'present.');
		} else if (options.characterDataOldValue && !options.characterData) {
			throw new TypeError('The options object may only set \'characterDataOldValue\' to true when \'characterData\' is ' +
				'true or not present.');
		}
	}

	takeRecords() {
		const records = [...this._recordQueue];
		this._recordQueue = [];
		return records;
	}
};