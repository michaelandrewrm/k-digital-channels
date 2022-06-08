<template>
	<div class="w-interveners">
		<template v-for="(group, groupLabel) in groups">
			<c-list-icon-item
				v-if="group.length > 0"
				:key="groupLabel"
				:title="$tc(`DETAIL.INTERVENER.${groupLabel.toUpperCase()}`, group.length)"
				:icon="group.length > 1 ? iconInterveners : iconIntervener"
			>
				<ul>
					<li v-for="intervener in group" :key="intervener.id">{{ intervener.name }}</li>
				</ul>
			</c-list-icon-item>
		</template>
	</div>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';
import { intervenersById } from '@modules/products/product-interveners';
import iconIntervener from '@icons/intervener';
import iconInterveners from '@icons/interveners';

export default {
	name: 'w-interveners',

	components: {
		CListIconItem,
	},

	data() {
		return {
			iconIntervener,
			iconInterveners,
		};
	},

	props: {
		interveners: {
			type: Array,
		},
	},

	computed: {
		groups({ interveners = [] }) {
			return Object.entries(intervenersById).reduce((reducer, [interId, interLabel]) => {
				return {
					...reducer,
					[interLabel]: interveners.filter(({ relationType: { id } }) => id === interId),
				};
			}, {});
		},
	},
};
</script>

<style lang="scss" scoped>
.w-interveners > *:not(:last-child) {
	margin-bottom: 15px;
}
</style>
