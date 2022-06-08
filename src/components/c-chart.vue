<template>
	<div
		class="c-chart"
		:class="{
			'highcharts-type-line': type === 'area',
			'highcharts-type-column': type === 'column',
		}"
	>
		<svg style="opacity: 0; position: absolute;" width="0" height="0">
			<defs>
				<linearGradient id="AreaColor" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" />
					<stop offset="60%" />
					<stop offset="100%" />
				</linearGradient>
			</defs>
			<defs>
				<linearGradient id="LineColor" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" />
					<stop offset="100%" />
				</linearGradient>
			</defs>
			<defs>
				<linearGradient id="Bar1Color" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" />
					<stop offset="100%" />
				</linearGradient>
			</defs>
			<defs>
				<linearGradient id="Bar2Color" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" />
					<stop offset="100%" />
				</linearGradient>
			</defs>
		</svg>
		<div class="c-chart__chart" ref="chart"></div>
	</div>
</template>

<script>
import { borderRadiusXL } from '@theme';
import { chart } from 'highcharts/highcharts';

const chartInstance = new WeakMap();

export default {
	name: 'c-chart',

	data() {
		return {
			ChartLibrary: null,
			typeSelected: null,
		};
	},

	props: {
		type: { type: String, default: 'column' },
		source: { type: Array },
	},

	computed: {
		expenses({ source }) {
			if (!source) {
				return;
			}

			return source.map(({ date, outcomeAmount }) => ({
				name: date,
				amount: outcomeAmount,
				y: outcomeAmount.amount,
			}));
		},

		incomes({ source }) {
			if (!source) {
				return;
			}

			return source.map(({ date, incomeAmount }) => ({
				name: date,
				amount: incomeAmount,
				y: incomeAmount.amount,
			}));
		},

		balances({ source }) {
			if (!source) {
				return;
			}

			return source.map(({ date, balance }, i, arr) => ({
				name: date,
				amount: balance,
				y: balance.amount,
				selected: arr.length - 1 === i,
			}));
		},
	},

	watch: {
		type() {
			/* istanbul ignore next */
			if (!this.source) {
				return;
			}

			this.render();
		},

		source(source) {
			/* istanbul ignore next */
			if (!source) {
				return;
			}

			this.render();
		},
	},

	methods: {
		formatMonth(value) {
			return this.$d(Date.parse(value), 'month');
		},

		formatShortMonth(value) {
			return this.$d(Date.parse(value), 'shortMonth').replace('.', '');
		},

		formatCurrency(value) {
			return this.$n(value, {
				locale: 'ca',
				style: 'currency',
				currency: 'EUR',
				currencyDisplay: 'symbol',
				minimumFractionDigits: 0,
				useGrouping: true,
			});
		},

		render() {
			const { type, typeSelected } = this;
			const instance = chartInstance.get(this);
			const target = this.$refs.chart;

			/* istanbul ignore next */
			if (!target) {
				return;
			}

			if (type === typeSelected && instance) {
				instance.reflow();
			} else {
				this.typeSelected = type;

				if (type === 'column') {
					this.columnRenderChart(target);
				} else if (type === 'area') {
					this.areaRenderChart(target);
				}
			}
		},

		columnRenderChart(target) {
			const { expenses, incomes } = this;
			const labelExpenses = this.$t('CHART.EXPENSES');
			const labelIncomes = this.$t('CHART.INCOMES');
			const formatAmount = this.$nc;
			const { formatCurrency, formatMonth } = this;

			const instance = chart(target, {
				chart: {
					reflow: false,
					panning: true,
					styledMode: true,
					type: 'column',
					scrollablePlotArea: {
						// mínimo de ancho de pantalla soportado:
						minWidth: 375,
						scrollPositionX: 1,
					},
					scrollbar: { enabled: false },
					spacing: [30, 0, 0, 0],
				},
				scrollbar: { enabled: false },
				title: { text: '' },
				legend: {
					x: 5,
					align: 'left',
					symbolWidth: 9,
					symbolHeight: 9,
					padding: 10,
				},
				xAxis: {
					type: 'category',
					minPadding: '0',
					maxPadding: '0',
					margin: 0,
					offset: 0,
					labels: {
						enabled: true,
						overflow: 'allow',
						align: 'center',
						formatter: ({ value }) => formatMonth(value),
					},
					tickWidth: 1,
					tickLength: 18,
					min: incomes.length - 3,
					max: incomes.length - 1,
				},
				yAxis: {
					alignTicks: false,
					reserveSpace: false,
					title: { text: '' },
					labels: {
						align: 'left',
						x: 10,
						step: 1,
						reserveSpace: false,
						overflow: 'allow',
						formatter: ({ value }) => formatCurrency(value),
					},
					tickAmount: 4,
					minorGridLineWidth: 0,
				},
				tooltip: {
					useHTML: true,
					headerFormat: '',
					pointFormatter() {
						const { amount } = this;
						const value = formatAmount(amount);

						return `<b>${value}</b>`;
					},
					shadow: true,
					shape: 'callout',
					borderRadius: parseInt(borderRadiusXL, 10),
				},
				plotOptions: {
					column: {
						groupPadding: 0.33,
						maxPointWidth: 15,
						pointWidth: 15,
						animation: { duration: 500 },
						stickyTracking: false,
						events: { legendItemClick: () => false },
					},
				},
				series: [
					{
						allowPointSelect: false,
						name: labelExpenses,
						data: expenses,
					},
					{
						name: labelIncomes,
						data: incomes,
					},
				],
				credits: { enabled: false },
				responsive: {
					rules: [
						{
							condition: { minWidth: 750 },
							chartOptions: {
								xAxis: {
									min: incomes.length - 6,
									max: incomes.length - 1,
								},
							},
						},
					],
				},
			});

			chartInstance.set(this, instance);
		},

		areaRenderChart(target) {
			const { balances } = this;
			const formatAmount = this.$nc;
			const { formatCurrency, formatShortMonth } = this;

			const instance = chart(target, {
				chart: {
					reflow: false,
					styledMode: true,
					type: 'areaspline',
					scrollablePlotArea: {
						// mínimo de ancho de pantalla soportado:
						minWidth: 375,
						scrollPositionX: 1,
					},
					spacing: [30, 0, 10, 0],
				},
				scrollbar: { enabled: true },
				title: { text: '' },
				legend: { enabled: false },
				xAxis: {
					type: 'category',
					minPadding: '0',
					maxPadding: '0',
					margin: 0,
					offset: 20,
					labels: {
						useHTML: true,
						enabled: true,
						overflow: 'allow',
						align: 'center',
						formatter: ({ value }) => formatShortMonth(value),
					},
					tickWidth: 1,
					tickLength: 18,
					min: balances.length - 6,
					max: balances.length - 1,
					gridLineWidth: 0,
					startOnTick: true,
					zoomEnabled: false,
				},
				yAxis: {
					alignTicks: false,
					allowDecimals: false,
					title: { text: '' },
					labels: {
						align: 'left',
						x: 10,
						step: 1,
						reserveSpace: false,
						overflow: 'allow',
						formatter: ({ value }) => formatCurrency(value),
					},
					minorGridLineWidth: 0,
					floor: Math.min(...balances.map(({ y }) => y)),
					ceiling: Math.max(...balances.map(({ y }) => y)),
				},
				tooltip: {
					useHTML: true,
					headerFormat: '',
					pointFormatter() {
						const {
							x,
							series: { xAxis },
							amount,
						} = this;

						const date = xAxis.labelFormatter({ value: xAxis.names[x] });
						const value = formatAmount(amount);

						return `${date} <b>${value}</b>`;
					},
					shadow: true,
					borderRadius: parseInt(borderRadiusXL, 10),
				},
				plotOptions: {
					areaspline: {
						getExtremesFromAll: true,
						threshold: 0,
						stickyTracking: true,
						animation: false,
						lineWidth: 2,
						marker: {
							enabled: true,
							radius: 0.1,
							states: {
								normal: {
									animation: false,
								},
								hover: {
									radius: 3,
									animation: { duration: 0 },
								},
								select: {
									enabled: true,
									radius: 3,
								},
							},
						},
					},
				},
				series: [{ data: balances }],
				credits: { enabled: false },
			});

			chartInstance.set(this, instance);
		},
	},

	beforeDestroy() {
		chartInstance.delete(this);
		window.removeEventListener('resize', this.render);
	},

	mounted() {
		if ('ResizeObserver' in window) {
			new ResizeObserver(this.render).observe(this.$el);
		} else {
			window.addEventListener('resize', this.render);
		}
	},
};
</script>

<style lang="scss" scoped>
.c-chart {
	width: 100%;
	height: 100%;
}

.c-chart__chart {
	position: relative;
	width: 100%;
	height: 100%;
}

#AreaColor > stop:first-child() {
	stop-opacity: 0.6;
	stop-color: RGB(var(--color-gradient-chart-line-stop-1));
}

#AreaColor > stop + stop {
	stop-opacity: 0;
	stop-color: RGB(var(--color-surface-light));
}

#LineColor > stop:first-child() {
	stop-opacity: 1;
	stop-color: RGB(var(--color-gradient-chart-line-stop-2));
}

#LineColor > stop + stop {
	stop-opacity: 1;
	stop-color: RGB(var(--color-gradient-chart-line-stop-1));
}

#Bar1Color > stop:first-child() {
	stop-opacity: 1;
	stop-color: RGB(var(--color-gradient-chart-column-secondary-1));
}

#Bar1Color > stop + stop {
	stop-opacity: 1;
	stop-color: RGB(var(--color-gradient-chart-column-secondary-2));
}

#Bar2Color > stop:first-child() {
	stop-opacity: 1;
	stop-color: RGB(var(--color-gradient-chart-column-primary-1));
}

#Bar2Color > stop + stop {
	stop-opacity: 1;
	stop-color: RGB(var(--color-gradient-chart-column-primary-2));
}
</style>

<style lang="scss">
.highcharts-container {
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 100%;
	text-align: left;
	line-height: normal;
	/* #1072 */
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.highcharts-root {
	display: block;
}

.highcharts-background {
	fill: transparent;
}

.highcharts-plot-border,
.highcharts-plot-background {
	fill: none;
}

.highcharts-label-box {
	fill: none;
}

.highcharts-button-box {
	fill: inherit;
}

.highcharts-tracker-line {
	stroke-linejoin: round;
	stroke: rgba(192, 192, 192, 0.0001);
	stroke-width: 22;
	fill: none;
}

.highcharts-tracker-area {
	fill: rgba(192, 192, 192, 0.0001);
	stroke-width: 0;
}

/* Axes */
.highcharts-axis-line {
	fill: none;
	stroke: RGB(var(--color-accent-icon));
}

.highcharts-yaxis .highcharts-axis-line {
	stroke-width: 0;
}

.highcharts-axis-labels {
	fill: RGB(var(--color-text-primary));
	cursor: default;
	@extend %typo-s-book;
	text-transform: capitalize;
}

.highcharts-grid-line {
	fill: none;
	stroke: RGBA(var(--color-dark-surface), 0.15);
	stroke-dasharray: 2 4;
}

.highcharts-xaxis-grid .highcharts-grid-line {
	stroke-width: 0px;
}

.highcharts-xaxis {
	stroke: RGB(var(--color-primary));
}

.highcharts-xaxis .highcharts-tick {
	stroke-width: 1px;
	transform: translateY(6px);
	stroke: RGB(var(--color-accent-icon));
}

.highcharts-yaxis .highcharts-tick {
	stroke-width: 0;
}

.highcharts-graph {
	fill: none;
	stroke-width: 2px;
	stroke-linecap: round;
	stroke-linejoin: round;
}

/* Legend hover affects points and series */
g.highcharts-series,
.highcharts-point,
.highcharts-markers,
.highcharts-data-labels {
	transition: opacity 250ms;
}

.highcharts-legend-series-active g.highcharts-series:not(.highcharts-series-hover),
.highcharts-legend-point-active .highcharts-point:not(.highcharts-point-hover),
.highcharts-legend-series-active .highcharts-markers:not(.highcharts-series-hover),
.highcharts-legend-series-active .highcharts-data-labels:not(.highcharts-series-hover) {
	opacity: 0.2;
}

/* Series options */
/* Default colors */
.highcharts-color-0 {
	fill: RGB(var(--color-gradient-chart-column-primary-2));
	stroke: RGB(var(--color-gradient-chart-column-primary-2));
	stroke: url(#LineColor);
}

.highcharts-color-1 {
	fill: RGB(var(--color-gradient-chart-column-secondary-2));
	stroke: RGB(var(--color-gradient-chart-column-secondary-2));
}

.highcharts-areaspline-series {
	stroke-width: 0;
	fill: url(#AreaColor);
}

.highcharts-column-series .highcharts-color-0 {
	fill: url(#Bar2Color);
	stroke-width: 0;
}

.highcharts-column-series .highcharts-color-1 {
	fill: url(#Bar1Color);
	stroke-width: 0;
}

.highcharts-type-line .highcharts-point-select {
	fill: RGB(var(--color-secondary));
	stroke: RGB(var(--color-secondary));
	stroke: RGB(var(--color-secondary));
	stroke-width: 9px;
	stroke-opacity: 0.25;
}

.highcharts-type-line .highcharts-tracker .highcharts-point:not(.highcharts-point-select) {
	fill: white;
	stroke: black;
	stroke-width: 1;
	stroke-opacity: 0.25;
}

.highcharts-halo {
	fill: RGB(var(--color-secondary));
	fill-opacity: 0.1;
	stroke: RGB(var(--color-secondary));
	stroke-width: 9px;
	stroke-opacity: 0.05;
}

.highcharts-legend {
	fill: transparent;
}

.highcharts-legend-item text {
	@extend %typo-s-book;
	fill: RGB(var(--color-text-primary));
	stroke-width: 0;
}

.highcharts-legend-item .highcharts-point {
	stroke-width: 0;
}

.highcharts-xaxis-labels {
	font-weight: normal;
	color: RGB(var(--color-text-primary));
}

.highcharts-type-line .highcharts-xaxis-labels {
	width: 100%;
}

.highcharts-yaxis-labels {
	fill: RGB(var(--color-accent-icon));
}

.highcharts-type-column .highcharts-yaxis-labels > :first-child {
	display: none;
}

/* Tooltip */
.highcharts-tooltip {
	cursor: default;
	pointer-events: none;
	white-space: nowrap;
	transition: stroke 150ms;
	stroke-width: 0;
	@extend %typo-s-book;
	color: RGB(var(--color-text-primary));
	text-transform: capitalize;
}

.highcharts-tooltip-box {
	stroke-width: 0px;
	fill: RGB(var(--color-surface-light));
	fill-opacity: 1;
}

.highcharts-type-column .highcharts-tooltip.highcharts-color-0 .highcharts-tooltip-box {
	fill: url(#Bar2Color);
}

.highcharts-type-column .highcharts-tooltip.highcharts-color-1 .highcharts-tooltip-box {
	fill: url(#Bar1Color);
}

.highcharts-type-column .highcharts-tooltip.highcharts-color-0 {
	color: RGB(var(--color-gradient-chart-column-secondary-2));
}

.highcharts-type-column .highcharts-tooltip.highcharts-color-1 {
	color: RGB(var(--color-gradient-chart-column-primary-2));
}

.highcharts-label b {
	font-weight: bold;
}

div.highcharts-tooltip {
	filter: none;
}

/* No-data module */
.highcharts-no-data text {
	font-weight: bold;
	font-size: 12px;
	fill: #666666;
}

/* Drag-panes module */
.highcharts-axis-resizer {
	cursor: ns-resize;
	stroke: black;
	stroke-width: 2px;
}
</style>
