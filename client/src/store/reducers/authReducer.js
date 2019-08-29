const initState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem("token"),
  isLoading: true
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "USER_LOADING":
      return {
        ...state,
        isLoading: true
      };
    case "USER_LOADED": {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        token: localStorage.getItem("token"),
        isLoading: false
      };
    }
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: localStorage.getItem("token"),
        isLoading: false
      };
    case "LOGIN_FAIL":
    case "AUTH_FAIL":
    case "LOGOUT_SUCCESS":
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false
      };
    case "LOADING":
      return {
        ...state,
        isLoading: true
      };
    default:
      return state;
  }
};

export default authReducer;
