import { Month, PrismaClient } from '@prisma/client'
const chartLabels = [
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
export const INITIAL_MONTHLY_REVENUE = [4967, 4857]

const prisma = new PrismaClient()
async function main() {
  chartLabels.map(async (label, index) => {
    await prisma.monthlyRevenue.create({
      data: {
        month: label as Month,
        revenue: INITIAL_MONTHLY_REVENUE[index] || 0,
      },
    })
  })
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
