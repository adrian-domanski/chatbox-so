const initState = {
  msg: null,
  type: null,
  id: null
};

const errorReducer = (state = initState, action) => {
  switch (action.type) {
    case "RETURN_ERROR":
      const { msg, type, id } = action.payload;
      return {
        ...state,
        msg,
        type,
        id
      };
    default:
      return state;
  }
};

export default errorReducer;
