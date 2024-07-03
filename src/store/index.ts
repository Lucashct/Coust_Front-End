import { createStore } from 'vuex'
import { loginStore ,UserState } from './loginStore'
import { GlobalState, globalState } from './globalState';

export interface RootState {
  globalState: GlobalState
  loginStore: UserState
}

const store = createStore<RootState>({
  modules: {
    globalState,
    loginStore
  }
});

export default store;