export const removeZeroFromEnd = (arr: number[]) => {
  const tmp = [...arr]
  while (tmp[tmp.length - 1] === 0) {
    tmp.pop()
  }
  return tmp
}

export const calculateCumulativeSum = (
  arr: number[],
  initValue: number,
): number[] => {
  return arr.map((_, index) => {
    return arr.slice(0, index + 1).reduce((sum, curr) => sum + curr, initValue)
  })
}
