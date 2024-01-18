// actionCreators.js
import {
  FETCH_PLAYER_DATA_REQUEST,
} from '../../redux/ActionTypes/actionTypes';   // ../ActionTypes/actionTypes

export const fetchPlayerDataRequest = () => ({
  type: FETCH_PLAYER_DATA_REQUEST,
});

// export const fetchPlayerDataSuccess = (data) => ({
//   type: FETCH_PLAYER_DATA_SUCCESS,
//   payload: data,
// });

// export const fetchPlayerDataFailure = (error) => ({
//   type: FETCH_PLAYER_DATA_FAILURE,
//   payload: error,
// });

// export const updatePlayerDataRequest = (id, data) => ({
//   type: UPDATE_PLAYER_DATA_REQUEST,
//   payload: { id, data },
// });

// export const updatePlayerDataSuccess = (updatedData) => ({
//   type: UPDATE_PLAYER_DATA_SUCCESS,
//   payload: updatedData,
// });

// export const updatePlayerDataFailure = (error) => ({
//   type: UPDATE_PLAYER_DATA_FAILURE,
//   payload: error,
// });


// export const deletePlayerDataRequest = (id) => ({
//   type: DELETE_PLAYER_DATA_REQUEST,
//   payload: id,
// });

// export const deletePlayerDataSuccess = () => ({
//   type: DELETE_PLAYER_DATA_SUCCESS,
// });

// export const deletePlayerDataFailure = (error) => ({
//   type: DELETE_PLAYER_DATA_FAILURE,
//   payload: error,
// });

// Add more action creators as needed
