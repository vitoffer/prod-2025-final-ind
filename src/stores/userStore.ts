import type { User } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isNewUser = ref<boolean>(localStorage.getItem('user') === null)

  function toggleIsNewUser() {
    isNewUser.value = !isNewUser.value
  }

  const baseUser: User = {
    age: 20,
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
  }

  const user = ref<User>(baseUser)

  if (localStorage.getItem('user')) {
    user.value = JSON.parse(localStorage.getItem('user')!)
  }

  function updateUser(params: Partial<User>) {
    user.value = {
      ...user.value,
      ...params,
    }

    localStorage.setItem('user', JSON.stringify(user.value))
  }

  return { isNewUser, toggleIsNewUser, user, updateUser }
})
