export const returnError = (status, msg, id = null) => dispatch => {
  dispatch({
    type: "RETURN_ERROR",
    payload: {
      status,
      msg,
      id
    }
  });
};
