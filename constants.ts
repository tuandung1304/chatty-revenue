export const labels = [
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

const calculateCumulativeSum = (arr: number[], initValue: number): number[] => {
  return arr.map((_, index) => {
    return arr.slice(0, index + 1).reduce((sum, curr) => sum + curr, initValue)
  })
}

export const TARGET_MONTHLY_REVENUE = [
  2808, 4702, 8221, 10934, 14404, 17090, 20592, 23278, 26779, 29464, 32966,
  35652,
]
export const CUMULATIVE_TARGET_REVENUE = calculateCumulativeSum(
  TARGET_MONTHLY_REVENUE,
  3329,
)

export const ACTUAL_MONTHLY_REVENUE = [4967, 4857]
export const CUMULATIVE_ACTUAL_REVENUE = calculateCumulativeSum(
  ACTUAL_MONTHLY_REVENUE,
  3374,
)

export const REMAINING_MONTHLY_REVENUE = CUMULATIVE_TARGET_REVENUE.map(
  target => {
    const result =
      target - CUMULATIVE_ACTUAL_REVENUE[CUMULATIVE_ACTUAL_REVENUE.length - 1]
    return result > 0 ? result : 0
  },
)
