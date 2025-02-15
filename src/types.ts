import type { ComputedRef } from 'vue'

export interface Exercise {
  id: number | ComputedRef<number>
  name: string
  videoUrl: string | null
  photoUrlList: string[]
  description: string | null
  difficulty: ExerciseDifficulty
  sportsItems: string[]
  tags: string[]
}

export type ExerciseDifficulty = 'простое' | 'среднее' | 'сложное'
