<template>
	<div class="c-card-item" :class="{ '--active': active }" :data-type="type">
		<div class="c-card-item__col1">
			<div class="c-card-item__icon text-m-medium">
				<c-icon v-if="icon" :src="icon" size="inherit" />
				<span class="c-card-item__image" v-else-if="type" />
				<c-icon v-else src="@icons/productFolder" size="inherit" />
			</div>
		</div>
		<div class="c-card-item__col2">
			<div v-if="title" class="c-card-item__title text-m-medium" :aria-label="title.concat(':')">
				{{ title }}
			</div>
			<div
				v-if="subTitle"
				class="c-card-item__subtitle text-s-light"
				:aria-hidden="Boolean(accessibleSubTitle)"
			>
				{{ subTitle }}
			</div>
			<div class="a11y-hide" v-if="accessibleSubTitle">{{ accessibleSubTitle }}</div>
		</div>
		<div class="c-card-item__col3">
			<div class="c-card-item__info text-l-medium">{{ info }}</div>
			<div class="c-card-item__subinfo text-s-light">{{ subInfo }}</div>
		</div>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'c-card-item',

	components: {
		CIcon,
	},

	props: {
		title: { type: String },
		subTitle: { type: String },
		accessibleSubTitle: { type: String },
		info: { type: String },
		subInfo: { type: String },
		icon: { type: null },
		active: { type: Boolean },
		type: { type: String },
	},
};
</script>

<style lang="scss" scoped>
.c-card-item {
	display: flex;
	align-items: center;
	padding: 15px 10px;
	background-color: RGB(var(--color-surface-light));
	box-shadow: 0px 5px 10px -10px rgba(0, 0, 0, 0.3);
	border-radius: $border-radius-m;
	color: RGB(var(--color-text-primary));
	flex-direction: row;
	line-height: 1.6;
	position: relative;
}

.c-card-item[disabled] {
	background-color: RGB(var(--color-surface-dark));
}

.c-card-item:not([disabled]) {
	&:active,
	&.--active {
		background-image: var(--color-gradient-card-item);
		color: RGB(var(--color-text-primary-light));
		--c-card-item-icon-color: RGB(var(--color-text-secondary-light));
	}
}

.c-card-item[data-type='debit-card'],
.c-card-item[data-type='credit-card'] {
	& .c-card-item__col1 {
		width: 74px;
	}
	& .c-card-item__col2 {
		padding-left: 20px;
	}
}

.c-card-item__image {
	display: block;
	position: relative;
	width: 74px;
	height: 43px;
	background: url(~@local-assets/cards/generic.svg) no-repeat;
	background-size: 100%;
	background-color: transparent;
	border-radius: 6px;
}

.c-card-item__image::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	box-shadow: 0px 5px 10px -10px rgba(0, 0, 0, 1);
}

.c-card-item__col1 {
	width: 46px;
	flex-shrink: 0;
}

.c-card-item__col2 {
	flex-shrink: 1;
	flex-grow: 1;
	overflow: hidden;
	padding-right: 10px;
}

.c-card-item__col3 {
	flex-shrink: 0;
	flex-grow: 1;
	height: 44px;
}

.c-card-item__icon {
	display: flex;
	grid-area: icon;
	font-size: 28px;
	color: var(--c-card-item-icon-color, inherit);
	align-items: center;
	justify-content: flex-start;
	background-color: transparent;
}

.c-card-item__title {
	grid-area: title;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.c-card-item__info {
	grid-area: info;
	text-align: right;
	white-space: nowrap;
}

.c-card-item__subtitle {
	grid-area: subtitle;
}

.c-card-item__subinfo {
	grid-area: subinfo;
	text-align: right;
	white-space: nowrap;
}

@media ($on-desktop) {
	.c-card-item {
		padding: 25px 15px;
		line-height: 1.8;
	}
}
</style>
