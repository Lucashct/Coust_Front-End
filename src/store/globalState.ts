import { Module } from "vuex";
import { RootState } from ".";

export interface GlobalState {
  loadingState: boolean
}

const state: GlobalState = {
  loadingState: false,
}

const mutations = {
  showLoading(state: GlobalState) {
    state.loadingState = true;
  },

  hideLoading(state: GlobalState) {
    state.loadingState = false;
  }
}

const actions = {
  showLoading({ commit }: { commit: Function }) {
    commit('showLoading');
  },

  hideLoading({ commit }: { commit: Function }) {
    commit('hideLoading')
  }
}

export const globalState: Module<GlobalState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}