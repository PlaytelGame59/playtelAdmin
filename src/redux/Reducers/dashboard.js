import * as actionTypes from '../ActionTypes/actionTypes'

const initialState = {
    isLoading: false
}

const dashboard = (state = initialState, actions)=>{
    const {payload, type} = actions;

    switch(type){
        case actionTypes.SET_IS_LOADING: {
            return {
                ...state,
                isLoading: payload
            }
        }
        default:{
            return state
        }
    }
}   

export default dashboard