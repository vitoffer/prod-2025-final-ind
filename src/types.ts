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

export interface FilledExercisesWorkout extends Workout {
  exercises: FilledExerciseWithGoal[]
  skippedExercisesIndexes?: number[]
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
  customizationItems: CustomItem[]
  achievements: Achievement[]
  stats: {
    totalSeconds: number
    totalReps: number
    totalWeight: number
    totalWorkouts: number
    completedExercises: number
    skippedExercises: number
    lastCompletedWorkouts: FilledExercisesWorkout[]
  }
}

export interface UserStats {
  totalReps: number
  totalWeight: number
  totalTime: number
  completedWorkouts: number
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
  id: number
  name: string
  description: string
  xpReward: number
}

export interface AchievementRequirements {
  workoutsCount?: number
  exercises?: ExerciseRequirement
  units?: UnitsRequirement
}

export interface ExerciseRequirement {
  count: number
  type: 'skipped' | 'completed'
  difficulty?: ExerciseDifficulty
  sportsItems?: string[]
  tags?: string[]
}

export interface UnitsRequirement {
  timeInSeconds?: number
  sets?: number
  repetitions?: number
  weightKg?: number
}

export interface CustomItem {
  id: number
  name: string
  type: CustomItemType
  imageUrl: string
  price: number
}

export type CustomItemType = 'hat' | 'necklace' | 'bracelet' | 'pants' | 'boots'
