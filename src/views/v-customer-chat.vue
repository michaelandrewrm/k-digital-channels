<template>
	<l-page>
		<h1 tabindex="-1" slot="header">{{ $t('CUSTOMER_SERVICE.CHAT.TITLE') }}</h1>

		<section class="v-customer-chat__content">
			<div class="v-customer-chat__icon" tabindex="-1">
				<c-icon src="@icons/chat" />
			</div>

			<p class="v-customer-chat__desc text-m-medium" tabindex="0">
				{{ $t('CUSTOMER_CHAT.DESC1') }}
			</p>

			<p class="v-customer-chat__desc text-m-book" tabindex="0">
				{{ $t('CUSTOMER_CHAT.DESC2') }}
			</p>

			<p
				v-if="!online"
				data-testid="offline-desc"
				class="v-customer-chat__time v-customer-chat__desc text-s-book"
				tabindex="0"
			>
				{{ $t('CUSTOMER_CHAT.OFFLINE.DESC') }}
			</p>

			<p v-else data-testid="online-desc" class="v-customer-chat__desc text-m-book" tabindex="0">
				{{ $t('CUSTOMER_CHAT.ONLINE.DESC') }}
			</p>
		</section>
		<div class="v-customer-chat__actions" slot="buttons">
			<c-button :disabled="!online" raised data-testid="init-button" @click="startChat">
				{{ $t('ACTIONS.INIT_CHAT') }}
			</c-button>
		</div>
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import LPage from '@layouts/l-page';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';

export default {
	name: 'v-customer-chat',

	components: { LPage, CButton, CIcon },

	data() {
		return { userId: null };
	},

	computed: {
		...mapState('app', ['liveagent']),
		...mapState('liveagent', ['online']),
	},

	methods: {
		startChat() {
			const { buttonId } = this.liveagent;

			/* istanbul ignore else */
			if (window.liveagent && buttonId) {
				window.liveagent.startChat(buttonId);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.v-customer-chat__indicator {
	visibility: hidden;
}

.v-customer-chat__content {
	display: flex;
	position: relative;
	flex-direction: column;
	max-width: 400px;
	margin: 0 auto;
	text-align: center;
}

.v-customer-chat__icon {
	color: RGB(var(--color-secondary));
	font-size: 48px;
	padding-top: 30px;
	padding-bottom: 30px;
}

.v-customer-chat__desc {
	display: inline-block;
	position: relative;
}

.v-customer-chat__desc:not(:last-of-type) {
	margin-bottom: 20px;
}

.v-customer-chat__time {
	margin-top: 20px;
	margin-bottom: 70px;
	padding-top: 30px;
	padding-bottom: 30px;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.v-customer-chat__actions {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: 1fr;
	gap: 20px;
}

.v-customer-chat__actions.--mode-row {
	grid-auto-flow: row;
	grid-auto-rows: 45px 1fr;
	padding-top: 10px;
	padding-bottom: 15px;
	text-align: center;
}
</style>
