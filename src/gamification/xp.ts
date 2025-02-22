import type { BodyType, FilledExercisesWorkout, FilledExerciseWithGoal, User } from '@/types'
import { useGlobalStore } from '@/stores/globalStore'
import { useUserStore } from '@/stores/userStore'

export const baseLevel = 1
export const baseXP = 0
export const basePoints = 0

export const XPForLevel = (level: number) => {
  return Math.floor(100 * Math.pow(1.1, level - 1))
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

export function checkLevelUp(user: User) {
  const globalStore = useGlobalStore()
  const userStore = useUserStore()

  const requiredXP = XPForLevel(user.level)

  while (user.xp >= requiredXP) {
    user.xp -= requiredXP
    user.level += 1

    globalStore.addToast({
      severity: 'success',
      summary: `Новый уровень!`,
      detail: `Вы достигли ${user.level} уровня`,
      life: 5000,
    })
  }

  userStore.changeBodyType(checkBodyType(user.level))
}

function checkBodyType(newLevel: number): BodyType {
  if (newLevel >= 20) {
    return 'fit'
  }
  if (newLevel >= 5) {
    return 'normal'
  }
  return 'skinny'
}

export function addXP(user: User, xp: number) {
  user.xp += xp
  user.points += xp // Добавляем points в том же количестве
  checkLevelUp(user)
}
