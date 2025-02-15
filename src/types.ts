export interface Exercise {
  id: number
  name: string
  videoUrl: string | null
  photoUrlList: string[]
  description: string | null
  difficulty: ExerciseDifficulty
  sportsItems: string[]
  tags: string[]
}

export type ExerciseDifficulty = 'простое' | 'среднее' | 'сложное'
