const initState = {
  msg: null,
  status: null,
  id: null
};

const errorReducer = (state = initState, action) => {
  switch (action.type) {
    case "RETURN_ERROR":
      const { msg, status, id } = action.payload;
      return {
        ...state,
        msg,
        status,
        id
      };
    case "CLEAR_ERRORS":
      return {
        msg: null,
        status: null,
        id: null
      };
    default:
      return state;
  }
};

export default errorReducer;
