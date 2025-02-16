import type { Exercise } from '@/types'

export const formatExercise = (exercise: Exercise): Exercise => {
  return {
    id: exercise.id,
    name: exercise.name.trim(),
    videoUrl: exercise.videoUrl,
    photoUrlList: exercise.photoUrlList,
    description: exercise.description,
    difficulty: exercise.difficulty,
    sportsItems: exercise.sportsItems,
    tags: exercise.tags,
  }
}
