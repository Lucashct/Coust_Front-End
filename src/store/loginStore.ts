import { Module } from 'vuex';
import { RootState } from '.';

export interface UserLogged {
  id: number,
  name: string,
  email: string,
  bills: Array<any>
  cards: Array<any>
  entries: Array<any>
}

export interface UserState {
  userLogged: UserLogged
}

const state: UserState = {
  userLogged: {
    id: 0,
    name: '',
    email: '',
    bills: [],
    cards: [],
    entries: []
  },
}

const mutations = {
  updateUserLogged(state: UserState, payload: UserLogged) {
    state.userLogged = payload
  },

  updateUserCards(state: UserState, payload: Array<any>) {
    state.userLogged.cards = payload
  },

  updateUserEntries(state: UserState, payload: any) {
    state.userLogged.entries.push(...payload);
  },

  updateUserBills(state: UserState, payload: any) {
    state.userLogged.bills.push(payload);
  }
} 

const actions = {
  updateUserLogged({ commit }: { commit: Function }, payload: object) {
    commit('updateUserLogged', payload);
  },

  updateUserCards({ commit }: { commit: Function }, payload: Array<any>) {
    commit('updateUserCards', payload);
  },

  updateUserEntries({ commit }: { commit: Function }, payload: any) {
    commit('updateUserEntries', payload);
  },

  updateUserBills({ commit }: { commit: Function }, payload: any) {
    commit('updateUserBills', payload);
  }
}

export const loginStore: Module<UserState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}