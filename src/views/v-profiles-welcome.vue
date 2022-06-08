<template>
	<l-page>
		<div class="v-profiles-welcome__popup" slot="state">
			<div class="v-profiles-welcome__desc text-s-book">
				<p>
					{{ $t('PROFILES.WELCOME.DESCRIPTION.PART1') }}
					<i class="text-s-medium">{{ $t('PROFILES.WELCOME.DESCRIPTION.PART2') }}</i>
					{{ $t('PROFILES.WELCOME.DESCRIPTION.PART3') }}
				</p>
			</div>
			<div class="v-profiles-welcome__image" />
			<c-button class="v-profiles-welcome__button" raised data-testid="create" @click="goto">
				{{ $t('ACTIONS.CREATE_NEW_PROFILE') }}
			</c-button>
		</div>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import CButton from '@components/c-button';

export default {
	name: 'v-profiles-welcome',

	components: { LPage, CButton },

	methods: {
		goto() {
			this.$store.dispatch('profiles/setWelcome');
			window.history.replaceState({}, '', this.$router.resolve({ name: 'profiles' }).href);
			this.$router.push({ name: 'profiles-create' });
		},
	},
};
</script>

<style lang="scss" scoped>
.v-profiles-welcome__popup {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	background-image: var(--color-gradient-menu);
}

.v-profiles-welcome__desc {
	color: RGB(var(--color-text-primary-light));
	max-width: 280px;
	margin-top: 30px;
	margin-bottom: 10px;
	text-align: center;
}

.v-profiles-welcome__desc p i {
	color: RGB(var(--color-text-secondary));
	font-style: normal;
}

.v-profiles-welcome__image {
	width: 100%;
	height: 100%;
	max-width: 330px;
	max-height: 500px;
	background-image: url(~@project/assets/img/mockup-profiles.png);
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	background-origin: content-box;
}

.v-profiles-welcome__button {
	width: 100%;
	max-width: 280px;
	margin-bottom: 30px;
}
</style>
