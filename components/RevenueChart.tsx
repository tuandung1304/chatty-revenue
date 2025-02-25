'use client'

import {
  CUMULATIVE_TARGET_REVENUE,
  TARGET_MONTHLY_REVENUE,
  chartLabels,
  chartOptions,
} from '@/constants'
import { calculateCumulativeSum, removeZeroFromEnd } from '@/utils'
import { Button, TextField } from '@mui/material'
import {
  BarController,
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { useState } from 'react'
import { Chart } from 'react-chartjs-2'

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title,
  LineController,
  BarController,
)

// todo: data from db
const ACTUAL_MONTHLY_REVENUE = [4967, 4857, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

export default function RevenueChart() {
  const [monthlyEarned, setMonthlyEarned] = useState(ACTUAL_MONTHLY_REVENUE)

  const handleChangeData = (index: number, value: number) => {
    const newMonthlyEarned = [...monthlyEarned]
    newMonthlyEarned[index] = value
    setMonthlyEarned(newMonthlyEarned)
  }

  const handleReset = () => {
    setMonthlyEarned(ACTUAL_MONTHLY_REVENUE)
  }

  const cumulativeActualRevenue = calculateCumulativeSum(
    removeZeroFromEnd(monthlyEarned),
    3374,
  )

  const monthlyRemaining = CUMULATIVE_TARGET_REVENUE.map((target) => {
    const result =
      target - cumulativeActualRevenue[cumulativeActualRevenue.length - 1]
    return result > 0 ? result : 0
  })

  const chartData: ChartData<'line' | 'bar'> = {
    labels: chartLabels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Actual Revenue',
        borderColor: 'rgba(53, 162, 235, 0.5)',
        backgroundColor: 'rgb(53, 162, 235)',
        data: cumulativeActualRevenue,
      },
      {
        type: 'line' as const,
        label: 'Target Revenue',
        borderColor: 'rgba(255, 99, 132, 0.5)',
        backgroundColor: 'rgb(255, 99, 132)',
        data: CUMULATIVE_TARGET_REVENUE,
      },
      {
        type: 'bar' as const,
        label: 'Monthly earned',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        data: monthlyEarned,
      },
      {
        type: 'bar' as const,
        label: 'Monthly target',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        data: TARGET_MONTHLY_REVENUE,
      },
      {
        type: 'bar' as const,
        label: 'Remaining',
        backgroundColor: 'rgba(87, 230, 103, 0.5)',
        data: monthlyRemaining,
        hidden: true,
      },
    ],
  }

  return (
    <div className="flex h-[100vh] p-10 gap-8">
      <div className="w-32 shrink-0 flex flex-col gap-4 bg-neutral-300 p-3 rounded-lg self-start">
        <p className="text-sm font-semibold text-gray-950 text-nowrap text-center">
          Monthly earned
        </p>
        {chartLabels.map((label, index) => (
          <TextField
            key={index}
            label={label}
            size="small"
            type="number"
            value={monthlyEarned[index]}
            onChange={(e) => handleChangeData(index, Number(e.target.value))}
            slotProps={{
              inputLabel: {
                style: {
                  fontSize: 13,
                },
              },
              htmlInput: {
                style: {
                  padding: '6px 10px',
                  fontSize: 15,
                },
              },
            }}
          />
        ))}
        <div className="flex flex-col gap-1">
          <Button size="small" variant="contained">
            Save
          </Button>
          <Button size="small" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>
      <div className="w-[1400px]">
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
