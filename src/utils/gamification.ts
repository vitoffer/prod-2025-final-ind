import { baseXP, XPGrowthRate } from '@/constants'

export function XPForLevel(currentLevel: number) {
  return baseXP * XPGrowthRate ** (currentLevel - 1)
}
