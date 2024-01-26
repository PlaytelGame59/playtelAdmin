// playerReducer.js
import * as actionTypes from '../ActionTypes/actionTypes'

const initialState = {
  playerData: null,
  error: null,
  // Add more state properties as needed
};

const playerReducer = (state = initialState, action) => {
  const { payload, type } = action
  switch (type) {
    case actionTypes.SET_PLAYER_DATA: {
      return {
        ...state,
        playerData: payload
      }
    }
    default: {
      return state;
    }
  }
};

export default playerReducer;