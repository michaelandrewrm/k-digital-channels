<template>
	<l-page>
		<h1 slot="header" tabindex="-1">{{ $t('BIZUM.TITLE') }}</h1>

		<div slot="main-fixed-header" class="v-bizum-contacts__search-engine">
			<div class="text-m-medium">{{ $t('SEARCH_CONTACT') }}</div>

			<c-transfer-field
				data-testid="search-input"
				class="v-bizum-contacts__field"
				v-model="searchString"
				:placeholder="$t('FORM.PLACEHOLDER.SEARCH_CONTACT')"
			/>
		</div>

		<transition name="placeholder" mode="out-in">
			<section v-if="!loading && results.length" data-testid="contact-list">
				<button
					v-for="contact in results"
					:key="contact.id"
					class="v-bizum-contacts__row"
					@click="onContactClick(contact)"
					data-testid="contact"
				>
					<div class="v-bizum-contacts__avatar">
						<c-icon v-if="!contact.image" src="@icons/user" size="none" data-testid="avatar" />
						<img v-else :src="contact.image" width="100%" data-testid="avatar" />
					</div>
					<div class="v-bizum-contacts__info">
						<div class="text-m-medium">{{ contact.name }}</div>
						<div class="text-m-book">{{ contact.formattedPhone }}</div>
					</div>
					<c-icon
						class="v-bizum-contacts__bizum-icon"
						v-if="contact.hasBizum"
						src="@icons/bizum"
						size="none"
						data-testid="has-bizum-icon"
					/>
				</button>
			</section>

			<c-placeholder-item v-if="loading" key="placeholder" />
		</transition>

		<transition name="placeholder">
			<c-placeholder-item v-if="loading" />
		</transition>

		<transition name="placeholder">
			<c-placeholder-item v-if="loading" />
		</transition>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import CIcon from '@components/c-icon';
import bizumModule from '@modules/bizum/m-bizum';
import CPlaceholderItem from '@components/c-placeholder-item';
import CTransferField from '@components/c-transfer-field';
import { stringToHash } from '@modules/secure/cypher';

export default {
	name: 'v-bizum-contacts',

	modules: { bizum: bizumModule },

	components: {
		LPage,
		CIcon,
		CPlaceholderItem,
		CTransferField,
	},

	data() {
		return {
			searchString: null,
			query: null,
			loading: false,
			debounce: null,
			value: null,
			contacts: [],
			phoneContacts: [],
			bizumContacts: [],
		};
	},

	props: {
		port: { type: [MessagePort, Object] },
	},

	computed: {
		results({ query, contacts }) {
			if (!query) {
				return contacts;
			}

			const normalize = (text) =>
				text
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '');

			return contacts.filter(({ name }) => normalize(name).includes(normalize(query)));
		},
	},

	methods: {
		getSpanishPhoneWithPrefix(phone) {
			const phoneSpainPrefix = '+34';
			let parsedPhone = phone.replace(/\s/g, '');

			if (phone.startsWith('00')) {
				parsedPhone = `+${parsedPhone.slice(2)}`;
			}

			if (parsedPhone.length === 9) {
				parsedPhone = `${phoneSpainPrefix}${parsedPhone}`;
			}

			return parsedPhone;
		},

		formatSpanishPhone(phone) {
			if (phone.length % 3 === 0) {
				return phone.match(/.{1,3}/g).join(' ');
			}

			return phone;
		},

		createContacts(contacts) {
			return contacts
				.map(({ fullName, phone, profileImage }) => ({
					id: stringToHash(fullName + phone),
					name: fullName,
					image: profileImage,
					phone: this.getSpanishPhoneWithPrefix(phone),
					formattedPhone: this.formatSpanishPhone(phone),
				}))
				.filter(({ id }, index, arr) => arr.findIndex((contact) => contact.id === id) === index)
				.sort(({ name }, b) => name.localeCompare(b.name));
		},

		getPhoneContacts() {
			const channel = new MessageChannel();

			channel.port1.onmessage = ({ data }) => {
				const addressbook = data?.addressbook || [];
				this.phoneContacts = addressbook;
			};

			setTimeout(() => {
				window.postMessage({ name: 'bridge-get-contacts' }, '*', [channel.port2]);
			}, 400);
		},

		getBizumContacts(contacts) {
			const phones = contacts.map(({ phone }) => ({ phone }));
			this.$store
				.dispatch('bizum/getContacts', phones)
				.then((phonesWithBizum) => {
					this.bizumContacts = phonesWithBizum;
				})
				.catch(() => {});
		},

		onContactClick(contact) {
			this.value = contact;
			this.$router.back();
		},
	},

	watch: {
		searchString(value) {
			clearTimeout(this.debounce);
			this.debounce = setTimeout(() => {
				this.query = value;
			}, 300);
		},

		value(value) {
			/* istanbul ignore else */
			if (this.port) {
				this.port.postMessage(value);
				this.port.close();
			}
		},

		phoneContacts: {
			immediate: true,
			deep: true,
			handler(phoneContacts) {
				if (phoneContacts?.length) {
					const contacts = this.createContacts(phoneContacts);
					this.contacts = contacts;
					this.loading = false;
					this.getBizumContacts(contacts);
				}
			},
		},

		bizumContacts: {
			immediate: true,
			deep: true,
			handler(bizumContacts) {
				if (bizumContacts?.length) {
					this.contacts = this.contacts.map((contact) => {
						const hasBizum = bizumContacts.findIndex(({ phone }) => phone === contact.phone) > -1;

						return { ...contact, hasBizum };
					});
				}
			},
		},
	},

	mounted() {
		this.$nextTick(this.getPhoneContacts());
	},

	beforeDestroy() {
		clearTimeout(this.debounce);
		if (!this.value && this.port) {
			this.port.postMessage(null);
			this.port.close();
		}
	},
};
</script>

<style lang="scss" scoped>
.v-bizum-contacts__row {
	appearance: none;
	border: 0;
	display: flex;
	width: 100%;
	background: none;
	text-align: left;
	align-items: center;
	padding: 15px 0;
	position: relative;
	color: RGB(var(--color-text-primary));
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
	--focus-ring-radius: 3px;
}

.v-bizum-contacts__row:first-child {
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.v-bizum-contacts__avatar {
	display: flex;
	flex-grow: 0;
	flex-shrink: 0;
	width: 40px;
	height: 40px;
	margin-right: 20px;
	font-size: 16px;
	background-color: RGB(var(--color-surface-light));
	border-radius: $border-radius-l;
	box-shadow: 0px 5px 10px -10px rgba(0, 0, 0, 0.5);
	align-items: center;
	justify-content: center;
	color: RGB(var(--color-accent-icon));
	overflow: hidden;
}

.v-bizum-contacts__info {
	flex-grow: 1;
}

.v-bizum-contacts__bizum-icon {
	flex-grow: 0;
	flex-shrink: 0;
	width: 16px;
	font-size: 16px;
	color: RGB(var(--color-text-primary));
}

.v-bizum-contacts__search-engine {
	padding: 10px 20px;
	max-width: 550px;
}

.v-bizum-contacts__field {
	margin-top: 10px;
}

.placeholder-enter {
	opacity: 0;
	transform: translateY(-5px);
}

.placeholder-leave-active {
	opacity: 0;
	transform: translateY(40%);
}

.placeholder-enter-active {
	transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
}

.placeholder-leave-active {
	transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
	transition-delay: 400ms;
}

.placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 200ms;
}

.placeholder-leave-active ~ .placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 0ms;
}
</style>
