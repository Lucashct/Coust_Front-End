const BASE_URL = import.meta.env.VITE_URL_BASE_LOCAL;

//END POINTS DE LOGIN
const RECOVER_SESSION = BASE_URL + '/'
const GOOGLE_LOGIN = BASE_URL + '/verify/code'
const LOGIN = BASE_URL + '/login'
const LOG_OUT = BASE_URL + '/logout'
const CREATE_USER = BASE_URL + "/user/create"

//END POINTS CARDS
const CREATE_CARD = BASE_URL + '/cards/create'
const REMOVE_CARD = BASE_URL + '/cards/remove'

//END POINTS BILLS
const CREATE_BILL = BASE_URL + '/bills/create'

export default {
  RECOVER_SESSION,
  GOOGLE_LOGIN,
  LOGIN,
  LOG_OUT,
  CREATE_USER,
  CREATE_CARD,
  REMOVE_CARD,
  CREATE_BILL
}