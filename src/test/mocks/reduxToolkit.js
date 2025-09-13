// Mock createAsyncThunk
export const createAsyncThunk = (type, payloadCreator) => {
  const actionCreator = (...args) => ({
    type,
    payload: args[0],
  });
  actionCreator.pending = `${type}/pending`;
  actionCreator.fulfilled = `${type}/fulfilled`;
  actionCreator.rejected = `${type}/rejected`;
  return actionCreator;
};

// Mock createSlice
export const createSlice = ({ name, initialState, reducers, extraReducers }) => {
  const actionCreators = {};
  Object.keys(reducers).forEach((key) => {
    actionCreators[key] = (payload) => ({
      type: `${name}/${key}`,
      payload,
    });
  });
  return {
    name,
    reducer: (state = initialState, action) => state,
    actions: actionCreators,
  };
};