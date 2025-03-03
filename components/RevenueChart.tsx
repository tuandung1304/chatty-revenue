'use client'

import { updateData } from '@/actions'
import {
  chartLabels,
  chartOptions,
  CUMULATIVE_TARGET_REVENUE,
  TARGET_MONTHLY_REVENUE,
} from '@/constants'
import { calculateCumulativeSum, removeZeroFromEnd } from '@/utils'
import { Button, TextField } from '@mui/material'
import { MonthlyRevenue } from '@prisma/client'
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
import { useEffect, useMemo, useRef, useState } from 'react'
import { Chart } from 'react-chartjs-2'
import cloneDeep from 'lodash/cloneDeep'

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

interface Props {
  data: MonthlyRevenue[]
}

export default function RevenueChart({ data }: Props) {
  const initState = useRef(data)

  const [monthlyEarned, setMonthlyEarned] = useState(initState.current)
  const [updating, setUpdating] = useState(false)
  const [input, setInput] = useState(
    initState.current.map((item) => item.revenue),
  )

  const monthlyEarnRevenue = useMemo(() => {
    return monthlyEarned.map((item) => item.revenue)
  }, [monthlyEarned])

  const toUpdate = useMemo(() => {
    return monthlyEarned.filter(
      (item, index) => item.revenue !== initState.current[index].revenue,
    )
  }, [monthlyEarned, initState.current])

  const handleChangeData = (index: number, value: number) => {
    const newInput = cloneDeep(input)
    newInput[index] = value
    setInput(newInput)
  }

  const handleReset = () => {
    setMonthlyEarned(initState.current)
    setInput(initState.current.map((item) => item.revenue))
  }

  const handleUpdate = async () => {
    try {
      setUpdating(true)
      await updateData(toUpdate)
      initState.current = monthlyEarned
    } catch (error) {
      console.error(error)
    } finally {
      setUpdating(false)
    }
  }

  const cumulativeActualRevenue = useMemo(
    () => calculateCumulativeSum(removeZeroFromEnd(monthlyEarnRevenue), 3374),
    [monthlyEarnRevenue],
  )

  const monthlyRemaining = useMemo(
    () =>
      CUMULATIVE_TARGET_REVENUE.map((target) => {
        const lastCumulative =
          cumulativeActualRevenue[cumulativeActualRevenue.length - 1]
        return Math.max(target - lastCumulative, 0)
      }),
    [cumulativeActualRevenue],
  )

  const chartData: ChartData<'line' | 'bar'> = useMemo(() => {
    return {
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
          data: monthlyEarnRevenue,
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
  }, [cumulativeActualRevenue, monthlyEarnRevenue, monthlyRemaining])

  const chart = useMemo(() => {
    return <Chart type="bar" data={chartData} options={chartOptions} />
  }, [chartData])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMonthlyEarned((prev) =>
        prev.map((item, index) => ({ ...item, revenue: input[index] })),
      )
    }, 300)

    return () => clearTimeout(timeout)
  }, [input])

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
            value={input[index]}
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
          <Button
            size="small"
            variant="contained"
            onClick={handleUpdate}
            loading={updating}
            disabled={!toUpdate.length}>
            Save
          </Button>
          <Button
            size="small"
            onClick={handleReset}
            disabled={!toUpdate.length || updating}>
            Reset
          </Button>
        </div>
      </div>
      <div className="w-[1400px]">{chart}</div>
    </div>
  )
}
