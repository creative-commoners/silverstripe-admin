import ACTION_TYPES from './MessageActionTypes';

const initialState = [];

function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD_MESSAGE: {
      return [
        ...state,
        action.payload,
      ];
    }

    case ACTION_TYPES.REMOVE_MESSAGE: {
      const newState = state.filter(message => message.id !== action.payload.id);

      return [
        ...newState,
      ];
    }

    case ACTION_TYPES.CLEAR_MESSAGES: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

export default reducer;
