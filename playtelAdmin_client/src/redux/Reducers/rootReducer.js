// rootReducer.js
import { combineReducers } from 'redux';
import playerReducer from '../../redux/Reducers/player';  
// Add more reducers as needed

const rootReducer = combineReducers({
  player: playerReducer,
  // Add more reducer slices as needed
});

export default rootReducer;     