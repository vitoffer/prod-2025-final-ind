import type { FilledExercisesWorkout, User } from '@/types'
import { default as achievementsList } from '@/base-data/achievements'
import { useUserStore } from '@/stores/userStore'

export function checkAchievements(user: User, completedWorkout: FilledExercisesWorkout) {
  const userStore = useUserStore()

  const achievements = user.achievements
  const stats = user.stats

  // Обновляем статистику
  stats.totalWorkouts += 1
  stats.totalReps += completedWorkout.exercises.reduce(
    (sum, ex) => sum + (ex.goal.repetitions || 0),
    0,
  )
  stats.totalWeight += completedWorkout.exercises.reduce(
    (sum, ex) => sum + (ex.goal.weightKg || 0),
    0,
  )
  stats.totalSeconds += completedWorkout.exercises.reduce(
    (sum, ex) => sum + (ex.goal.time?.minutes || 0) * 60 + (ex.goal.time?.seconds || 0),
    0,
  )
  stats.skippedExercises += completedWorkout.skippedExercisesIndexes?.length || 0

  // Проверяем ачивки
  const completedAchievements = achievementsList.filter((ach) => {
    if (achievements.some((a) => a.id === ach.id)) return false

    switch (ach.id) {
      case 1:
        return stats.totalWorkouts >= 1
      case 2:
        return stats.totalWorkouts >= 5
      case 3:
        return stats.totalWorkouts >= 10
      case 4:
        return stats.totalWorkouts >= 20
      case 5:
        return stats.skippedExercises >= 1
      case 6:
        return stats.skippedExercises >= 5
      case 7:
        return stats.skippedExercises >= 10
      case 8:
        return stats.totalReps >= 100
      case 9:
        return stats.totalReps >= 300
      case 10:
        return stats.totalReps >= 1000
      default:
        return false
    }
  })

  const newAchievements = completedAchievements.filter(
    (ach) => !user.achievements.find((userAch) => userAch.id === ach.id),
  )

  newAchievements.forEach((ach) => {
    userStore.addAchievement(ach)
  })

  return newAchievements
}
