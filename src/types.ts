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
  exercises: WorkoutExercise[]
}

export type FilledExercisesWorkout = Pick<Workout, 'id' | 'name'> & {
  exercises: FilledExerciseWithGoal[]
}

export type WorkoutExercise = Pick<Exercise, 'id'> & {
  goal: WorkoutExerciseGoal
}

export type FilledExerciseWithGoal = Exercise & {
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

export interface FilledExercisesWorkoutValidation {
  name: boolean
  exercises: ExerciseWithGoalValidation[]
}

export interface ExerciseWithGoalValidation {
  goal: ExerciseGoalValidation
}

export interface InvalidWorkoutField {
  field: 'name' | 'exercises'
  detail: 'пустое значение' | 'некорректное значение'
}

export interface ExerciseGoalValidation {
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

export type BodyType = 'skinny' | 'normal' | 'fit'

export interface Achievement {
  name: string
  description: string
  requirements: AchievementRequirements
}

export interface AchievementRequirements {
  xp?: number
  level?: number
  workouts?: WorkoutRequirement[]
  repetitions?: number
  timeInSeconds?: number
  weightKg?: number
}

export interface WorkoutRequirement {
  count: number
  difficulty?: ExerciseDifficulty
  sportsItem?: string
  tag?: string
}

export interface CustomItem {
  id: number
  name: string
  type: CustomItemType
  imageUrl: string
  price: number
}

export type CustomItemType = 'hat' | 'necklace' | 'bracelet' | 'pants' | 'boots'
