'use server'

import { prisma } from '@/lib/prisma'
import { MonthlyRevenue } from '@prisma/client'

export const updateData = async (toUpdate: MonthlyRevenue[]) => {
  await Promise.all(
    toUpdate.map((item) =>
      prisma.monthlyRevenue.update({
        where: {
          id: item.id,
        },
        data: { revenue: item.revenue },
      }),
    ),
  )
}
