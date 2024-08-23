export const getDelayByNumber = (number) => {
  const step = 50
  let order = 0
  
  if ([1].includes(number)) order = 0
  if ([2, 4].includes(number)) order = 1
  if ([3, 5, 7].includes(number)) order = 2
  if ([6, 8].includes(number)) order = 3
  if ([9].includes(number)) order = 4

  return order * step
}