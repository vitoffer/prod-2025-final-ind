export interface Exercise {
  id: number
  name: string
  videoUrl: string | null
  photoUrlList: string[]
  description: string | null
  difficulty: ExerciseDifficulty
  sportsItems: string[]
  tags: string[]
  // unit: ExerciseUnit
}

export type ExerciseDifficulty = 'простое' | 'среднее' | 'сложное'

export type ExerciseUnit = 'мин' | 'кг' | 'повт'

export interface Workout {
  exercises: { id: number; goal: number }[]
}

export interface FiltersObject {
  name: string
  description: string
  difficulty: string | null
  sportsItems: string[]
  tags: string[]
}
