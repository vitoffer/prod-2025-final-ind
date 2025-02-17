import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    height: 180,
    weight: 75,
    level: 1,
    xp: 0,
    points: 10,
    character: {
      hat: null,
      body: 'normal',
      jacket: null,
      pants: null,
      boots: null,
    },
    customizationItems: [],
    achievements: [],
  })

  return { user }
})
