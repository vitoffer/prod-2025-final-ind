import type { ExerciseDifficulty, ExerciseUnit } from './types'

export const difficultyOptions: ExerciseDifficulty[] = ['простое', 'среднее', 'сложное']
export const unitsOptions: ExerciseUnit[] = ['время', 'подходы', 'повторения', 'вес']

export const baseXP = 10
export const XPGrowthRate = 1.01
export const baseLevel = 1
export const basePoints = 10
export const baseBody = 'skinny'
export const requiredLevelToNormalBody = 10
export const requiredLevelToFitBody = 20
