import { calculateCumulativeSum } from '@/utils'
import { ChartOptions } from 'chart.js'

export const chartLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const chartOptions = {
  interaction: {
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      text: 'Chatty Awards',
      display: true,
      font: {
        size: 26,
      },
    },
  },
} satisfies ChartOptions

export const TARGET_MONTHLY_REVENUE = [
  2808, 4702, 8221, 10934, 14404, 17090, 20592, 23278, 26779, 29464, 32966,
  35652,
]

export const CUMULATIVE_TARGET_REVENUE = calculateCumulativeSum(
  TARGET_MONTHLY_REVENUE,
  3329,
)
