'use client'

import {
  ACTUAL_MONTHLY_REVENUE,
  CUMULATIVE_ACTUAL_REVENUE,
  CUMULATIVE_TARGET_REVENUE,
  labels,
  REMAINING_MONTHLY_REVENUE,
  TARGET_MONTHLY_REVENUE,
} from '@/constants'
import {
  BarController,
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
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

export default function RevenueChart() {
  const options = {
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

  const data: ChartData<'line' | 'bar'> = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Target Revenue',
        borderColor: 'rgba(255, 99, 132, 0.5)',
        backgroundColor: 'rgb(255, 99, 132)',
        data: CUMULATIVE_TARGET_REVENUE,
      },
      {
        type: 'line' as const,
        label: 'Actual Revenue',
        borderColor: 'rgba(53, 162, 235, 0.5)',
        backgroundColor: 'rgb(53, 162, 235)',
        data: CUMULATIVE_ACTUAL_REVENUE,
      },
      {
        type: 'bar' as const,
        label: 'Monthly target',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        data: TARGET_MONTHLY_REVENUE,
      },
      {
        type: 'bar' as const,
        label: 'Monthly actual',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        data: ACTUAL_MONTHLY_REVENUE,
      },
      {
        type: 'bar' as const,
        label: 'Remaining',
        backgroundColor: 'rgba(87, 230, 103, 0.5)',
        data: REMAINING_MONTHLY_REVENUE,
        hidden: true,
      },
    ],
  }

  return (
    <div className="w-[1200px] m-auto">
      <Chart type="bar" data={data} options={options} />
    </div>
  )
}
