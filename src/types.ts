export interface Exercise {
  id: number
  name: string
  video: null | ExerciseVideo
  photoUrlList: string[]
  description: string | null
  difficulty: ExerciseDifficulty
  sportsItems: string[]
  tags: string[]
  unitsList: ExerciseUnit[]
}

export interface ExerciseVideo {
  type: 'iframe' | 'video'
  url: string
}

export type ExerciseDifficulty = 'простое' | 'среднее' | 'сложное'

export type ExerciseUnit = 'время' | 'подходы' | 'повторения' | 'вес'

export interface Workout {
  id: number
  name: string
  exercises: ExerciseWithGoal[]
}

export type ExerciseWithGoal = Exercise & {
  goal: WorkoutExerciseGoal
}

export interface WorkoutExerciseGoal {
  time?: GoalTime
  sets?: number
  repetitions?: number
  weightKg?: number
}

export interface GoalTime {
  minutes: number
  seconds: number
}

export interface ExerciseWithGoalValidation {
  time: boolean
  sets: boolean
  repetitions: boolean
  weightKg: boolean
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
  heightCm: number
  weightKg: number
  level: number
  xp: number
  points: number
  character: Character
  customizationItems: string[]
  achievements: string[]
  history: UserHistory
}

export interface UserHistory {
  lastCompletedWorkouts: Workout[]
}

export interface Character {
  hat: string | null
  body: BodyType
  necklace: string | null
  bracelet: string | null
  pants: string | null
  boots: string | null
}

type BodyType = 'skinny' | 'normal' | 'fit'
