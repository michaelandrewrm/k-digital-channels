<template>
	<div class="w-message-item">
		<button class="w-message-item__button" :class="classList" @click="goto(to)">
			<div
				class="w-message-item__title"
				:class="{ 'text-m-medium': !isUnread, 'text-m-bold': isUnread }"
			>
				{{ source.description }}
			</div>
			<div class="w-message-item__date text-s-light">
				{{ $d(new Date(source.creationDate), 'numeric') }}
			</div>
			<c-icon
				class="w-message-item__icon"
				src="@icons/attachment"
				size="none"
				v-if="hasAttachment"
			/>
		</button>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'w-message-item',

	components: {
		CIcon,
	},

	props: {
		type: { type: String, required: true },
		source: { type: Object, required: true },
	},

	computed: {
		isActive({ source: { id }, $route: { params } }) {
			return params?.messageId === id;
		},

		isUnread({ source: { reviewDate } }) {
			return !reviewDate;
		},

		hasAttachment({ source: { hasAttachment } }) {
			return Boolean(hasAttachment);
		},

		classList({ isUnread, hasAttachment, isActive }) {
			return {
				'--is-unread': isUnread,
				'--is-active': isActive,
				'--has-attachment': hasAttachment,
			};
		},

		to({ source, type }) {
			return { name: 'communication-detail', params: { messageId: source.id, type } };
		},
	},

	methods: {
		/* istanbul ignore next */
		goto(to) {
			// Hay que darle tiempo a Vue para capturar el evento click
			// y que se haga el envio de mensaje leído.
			setTimeout(() => {
				if (this.$route.name === 'communication-detail') {
					if (this.$route.params.messageId !== to.params.messageId) {
						this.$router.replace(to);
					}
				} else {
					this.$router.push(to);
				}
			}, 50);
		},
	},
};
</script>

<style lang="scss" scoped>
.w-message-item {
	padding: 5px 0;
}

.w-message-item__button {
	appearance: none;
	border: 0;
	width: 100%;
	position: relative;
	background-color: RGB(var(--color-surface-dark));
	color: RGB(var(--color-text-primary));
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	padding: 15px 20px;
	min-height: 75px;
	border-radius: $border-radius-s;
	box-shadow: 0 4px 8px -3px rgba(0, 0, 0, 0.07);
	text-decoration: none;
	text-align: left;
}

.w-message-item__button.--is-unread:not(.--is-active) {
	background-color: RGB(var(--color-surface-light));
	border-left: 7px solid RGB(var(--color-secondary));
	padding-left: 13px;
}

.w-message-item__button.--is-active {
	background-image: var(--color-gradient-card-item);
	color: RGB(var(--color-text-primary-light));
}

.w-message-item__button.--has-attachment {
	padding-right: 50px;
}

.w-message-item__icon {
	font-size: 16px;
	position: absolute;
	right: 25px;
	top: calc(50% - 8px);
}

.w-message-item__date {
	margin-top: 6px;
}
</style>
