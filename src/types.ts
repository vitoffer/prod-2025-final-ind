export interface Exercise {
  id: number
  name: string
  video: null | ExerciseVideo
  photoUrlList: string[]
  description: string | null
  difficulty: ExerciseDifficulty
  sportsItems: string[]
  tags: string[]
  units: ExerciseUnit[]
}

export interface ExerciseVideo {
  type: 'iframe' | 'video'
  url: string
}

export type ExerciseDifficulty = 'простое' | 'среднее' | 'сложное'

export type ExerciseUnit = 'мин' | 'кг' | 'повт'

export interface Workout {
  id: number
  name: string
  exercises: ExerciseWithGoal[]
}

export type ExerciseWithGoal = Exercise & {
  goal: WorkoutExerciseGoal
}

export interface WorkoutExerciseGoal {
  time?: number
  repetitions?: number
  weight?: number
}

export type EditingEntity = Exercise | Workout

export interface FiltersObject {
  name: string
  description: string
  difficulty: string | null
  sportsItems: string[]
  tags: string[]
}

export interface User {
  age: number
  height: number
  weight: number
  level: number
  xp: number
  points: number
  character: Character
  customizationItems: string[]
  achievements: string[]
}

export interface Character {
  hat: null
  body: 'normal'
  jacket: null
  pants: null
  boots: null
}
