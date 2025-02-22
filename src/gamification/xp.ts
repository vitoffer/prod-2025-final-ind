import type { FilledExercisesWorkout, FilledExerciseWithGoal } from '@/types'
import { baseXP, XPGrowthRate } from './constants'

export function XPForLevel(currentLevel: number) {
  return Math.ceil(baseXP * XPGrowthRate ** (currentLevel - 1))
}

export function XPForCompletedWorkout(completedWorkout: FilledExercisesWorkout) {
  return completedWorkout.exercises.reduce((prev, exercise: FilledExerciseWithGoal) => {
    let computedXP = 0

    // Базовый множитель сложности
    const difficultyMultiplier =
      {
        простое: 1,
        среднее: 1.5,
        сложное: 2,
      }[exercise.difficulty] || 1

    // Вклад повторений и подходов
    if (exercise.goal.repetitions && exercise.goal.sets) {
      computedXP += exercise.goal.repetitions * exercise.goal.sets * 0.5
    } else if (exercise.goal.repetitions) {
      computedXP += exercise.goal.repetitions * 1
    } else if (exercise.goal.sets) {
      computedXP += exercise.goal.sets * 1
    }

    // Вклад времени (минуты и секунды)
    if (exercise.goal.time) {
      const totalSeconds =
        (exercise.goal.time.minutes || 0) * 60 + (exercise.goal.time.seconds || 0)
      computedXP += totalSeconds * 0.1 // 0.1 XP за каждую секунду
    }

    // Вклад веса
    if (exercise.goal.weightKg) {
      computedXP += exercise.goal.weightKg * 0.2 // 0.2 XP за каждый кг
    }

    // Учитываем сложность упражнения
    computedXP *= difficultyMultiplier

    return prev + Math.round(computedXP)
  }, 0)
}

export function getNewLevel(currentLevel: number, currentXp: number) {
  let level = currentLevel
  let remainingXP = currentXp

  while (remainingXP >= XPForLevel(level + 1)) {
    remainingXP -= XPForLevel(level + 1)
    level++
  }

  return { newLevel: level, newXP: remainingXP }
}

export function checkLevelRewards(oldLevel: number, newLevel: number) {}
