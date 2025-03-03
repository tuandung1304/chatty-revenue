import RevenueChart from '@/components/RevenueChart'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const data = await prisma.monthlyRevenue.findMany({
    orderBy: {
      month: 'asc',
    },
  })

  return <RevenueChart data={data} />
}
