<template>
	<l-details>
		<h1 slot="header" tabindex="-1" ref="title">
			{{ $t('MOVEMENT.TITLE') }}
		</h1>

		<div class="v-bizum-movement__header" slot="widget">
			<c-translide>
				<c-acrylic-sheet :dotted="true" v-if="source" data-testid="sheet">
					<c-icon src="@icons/productReceipt" size="" slot="icon" />

					<span class="text-m-book">
						{{ beneficiary }}
					</span>

					<span class="v-bizum-movement__value text-l-bold">
						{{ $nc(source.amount) }}
					</span>

					<span class="text-s-medium">
						{{ $t(`BIZUM.MOVEMENT.STATUS.${source.status.name}`) }}
					</span>
				</c-acrylic-sheet>
			</c-translide>
		</div>

		<div class="v-bizum-movement__limit">
			<c-translide>
				<section v-if="source" data-testid="content">
					<c-list-icon-item
						class="v-bizum-movement__item"
						v-if="source"
						:title="beneficiaryTitle"
						:description="beneficiary"
						:icon="beneficiaryIcon"
					/>

					<c-list-icon-item
						class="v-bizum-movement__item"
						v-if="source.operationDate"
						:title="$t('DETAIL.ORDER_DATE')"
						:description="$d(new Date(source.operationDate), 'numeric')"
						icon="@icons/calendar"
					/>

					<c-list-icon-item
						class="v-bizum-movement__item"
						v-if="source.amount"
						:title="$t('TRANSFERS.AMOUNT')"
						:description="$nc(source.amount)"
						icon="@icons/valueAccountUnit"
					/>

					<c-list-icon-item
						class="v-bizum-movement__item"
						v-if="source.reason"
						:title="$t('TRANSFERS.REASON')"
						:description="source.reason"
						icon="@icons/paper"
					/>

					<c-list-icon-item
						data-testid="justification"
						class="v-bizum-movement__item"
						v-if="additionalJustification"
						:title="$t(`BIZUM.MOVEMENT.JUSTIFICATION.${source.status.name}`)"
						icon="@icons/paper"
					>
						<div class="v-bizum-movement__justification">{{ additionalJustification }}</div>
						<c-icon-button
							v-if="canRemoveJustification"
							data-testid="remove-additional-justification"
							icon="@icons/trash"
							size="l"
							@click.prevent="removeJustification"
						/>
					</c-list-icon-item>

					<div v-if="additionalText || additionalImage">
						<p class="v-bizum-movement__title text-m-medium">
							{{ $t('ADDITIONAL_CONTENT') }}
							<c-icon-button
								v-if="canRemoveAdditionalContent"
								data-testid="remove-additional-content"
								icon="@icons/trash"
								size="l"
								@click.prevent="removeAdditionalContent"
							/>
						</p>

						<div v-if="additionalImage">
							<img
								class="v-bizum-movement__image"
								data-testid="additional-content-image"
								:src="additionalImage"
								alt=""
								@click="openImage(additionalImage)"
							/>
						</div>

						<div v-if="additionalText" class="text-m-book">{{ additionalText }}</div>
					</div>
				</section>
			</c-translide>
		</div>

		<w-actions
			v-if="actionOptions && actionOptions.length"
			:options="actionOptions"
			slot="buttons"
		/>
	</l-details>
</template>

<script>
import LDetails from '@layouts/l-details';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';
import CTranslide from '@components/c-translide';
import CListIconItem from '@components/c-list-icon-item';
import moduleBizum from '@modules/bizum/m-bizum';
import WActions from '@widgets/w-actions';
import iconEcommerce from '@icons/ecommerce';
import iconUser from '@icons/user';
import iconCancel from '@icons/cancel';
import iconSendMoney from '@icons/sendMoney';
import { Unibabel } from 'unibabel';
import MImage from '@modals/m-image';
import MConfirm from '@modals/m-confirm';
import CIconButton from '@components/c-icon-button';

const actionIcons = {
	CANCEL: iconCancel,
	ACCEPT: iconSendMoney,
	DENY: iconCancel,
	RETURN: iconSendMoney,
};

// C2CED: Enviar dinero. C2CSD: Solicitud de dinero.
const contentSendedOrRequested = ({ type }) => ['C2CED', 'C2CSD'].includes(type);
const not = (fn) => (value) => !fn(value);

export default {
	name: 'v-bizum-movement',

	modules: { bizum: moduleBizum },

	components: {
		LDetails,
		CAcrylicSheet,
		CIcon,
		CTranslide,
		CListIconItem,
		WActions,
		CIconButton,
	},

	props: {
		movementId: { type: String, required: true },
	},

	data() {
		return {
			source: null,
		};
	},

	watch: {
		movementId: {
			immediate: true,
			handler(movementId) {
				/* istanbul ignore else */
				if (movementId) {
					this.$store.dispatch('bizum/getMovement', movementId).then((movement) => {
						if (!movement) {
							this.$router.go(-1);
						}
						this.source = movement;
					});
				}
			},
		},
	},

	computed: {
		beneficiary({ source }) {
			const beneficiaryTypes = ['SENT', 'REQUEST-SENT', 'SENT-COM', 'SENT-ECOM', 'SENT-SELAE'];

			if (beneficiaryTypes.includes(source.type.name)) {
				return source.beneficiary.name || source.beneficiary.phone;
			}

			return source.sender.name || source.sender.phone;
		},

		beneficiaryIcon({ source }) {
			const beneficiaryTypes = ['SENT-COM', 'SENT-ECOM'];

			if (beneficiaryTypes.includes(source.type.name)) {
				return iconEcommerce;
			}

			return iconUser;
		},

		beneficiaryTitle({ source }) {
			const isECommerce = ['SENT-COM', 'SENT-ECOM', 'SENT-SELAE'].includes(source?.type?.name);
			return isECommerce
				? this.$t('ECOMMERCE')
				: this.$t(`BIZUM.MOVEMENT.TYPE.${source.type.name}`);
		},

		additionalImage({ source }) {
			/* istanbul ignore else */
			if (source?.additionalContext) {
				const validContent = source.additionalContext.find(contentSendedOrRequested);

				/* istanbul ignore else */
				if (validContent?.image) {
					return `data:image/jpeg;base64,${validContent.image}`;
				}
			}
			return '';
		},

		additionalText({ source }) {
			/* istanbul ignore else */
			if (source?.additionalContext) {
				const validContent = source.additionalContext.find(contentSendedOrRequested);

				/* istanbul ignore else */
				if (validContent?.text) {
					return Unibabel.base64ToUtf8(validContent.text);
				}
			}
			return '';
		},

		additionalJustification({ source }) {
			/* istanbul ignore else */
			if (source?.additionalContext) {
				const validContent = source.additionalContext.find(not(contentSendedOrRequested));

				/* istanbul ignore else */
				if (validContent?.text) {
					return Unibabel.base64ToUtf8(validContent.text);
				}
			}

			return '';
		},

		canRemoveAdditionalContent({ source }) {
			return ['SENT', 'REQUEST-SENT'].includes(source.type.name) && !source.isDonation;
		},

		canRemoveJustification({ source }) {
			// No hay documentación de qué son los type. Esto funciona porque sí.
			return (
				source.additionalContext &&
				((source.type.name === 'REQUEST-SENT' &&
					source.additionalContext.find(({ type }) => type === 'C2CNSD')) ||
					(source.type.name === 'REQUEST-RECEIVED' &&
						source.additionalContext.find(({ type }) => type === 'C2CDSD')))
			);
		},

		actionOptions({ source }) {
			if (!source) {
				return null;
			}

			return source?.possibleActions?.map((action) => {
				return {
					id: action,
					title: this.$t(`BIZUM.ACTION.${action}`),
					icon: actionIcons[action],
					action: () => {
						this.$router.push({
							name: 'bizum-transfer',
							params: { movementId: source.id, action: action.toLowerCase() },
						});
					},
				};
			});
		},
	},

	methods: {
		openImage(image) {
			return this.$store.dispatch('modal/open', {
				component: MImage,
				props: { image },
			});
		},

		async removeAdditionalContent() {
			const props = {
				title: this.$t('ADDITIONAL_CONTENT'),
				text: this.$t('DELETE_ADDITIONAL_CONTENT_CONFIRMATION'),
				acceptText: this.$t('ACTIONS.DELETE'),
			};

			const confirmation = await this.$store.dispatch('modal/open', { component: MConfirm, props });

			/* istanbul ignore else */
			if (confirmation) {
				await this.$store.dispatch('bizum/deleteAdditionalContent', this.movementId);
				const newData = await this.$store.dispatch('bizum/getMovement', this.movementId);
				this.source = null;
				this.source = newData;
				await this.$store.dispatch('notification/open', {
					text: this.$t('ADDITIONAL_CONTENT_REMOVED'),
				});
			}
		},

		async removeJustification() {
			const props = {
				title: this.$t('ADDITIONAL_JUSTIFICATION'),
				text: this.$t('DELETE_ADDITIONAL_JUSTIFICATION_CONFIRMATION'),
				acceptText: this.$t('ACTION.DELETE'),
			};

			const confirmation = await this.$store.dispatch('modal/open', { component: MConfirm, props });

			/* istanbul ignore else */
			if (confirmation) {
				await this.$store.dispatch('bizum/deleteAdditionalJustification', this.movementId);
				const newData = await this.$store.dispatch('bizum/getMovement', this.movementId);
				this.source = null;
				this.source = newData;
				await this.$store.dispatch('notification/open', {
					text: this.$t('ADDITIONAL_JUSTIFICATION_REMOVED'),
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.v-bizum-movement__header {
	margin-left: 20px;
	margin-right: 20px;
	max-width: 400px;
	flex-grow: 1;
	width: 100%;
}

.v-bizum-movement__limit {
	max-width: 400px;
	margin: 0 auto;
}

.v-bizum-movement__item:not(:last-child) {
	margin-bottom: 18px;
}

.v-bizum-movement__value {
	margin: 15px 0;
}

.v-bizum-movement__justification {
	flex-grow: 1;
}

.v-bizum-movement__image {
	width: 100%;
	height: 150px;
	object-fit: cover;
	object-position: center;
	margin-bottom: 10px;
	cursor: zoom-in;
	border-radius: $border-radius-xs;
}

.v-bizum-movement__title {
	margin-top: 25px;
	border-top: 1px solid RGBA(0, 0, 0, 0.1);
	padding-top: 5px;
	padding-bottom: 0;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>
