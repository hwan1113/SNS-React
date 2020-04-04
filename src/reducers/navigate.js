import initialState from '../constants/initialState';
import * as types from '../constants/types';

export function navigate(state = initialState.navigate, action) {
    switch (action.type) {
        case types.navigate.TO: {
            const redirectLocation = action.location
            state = {...state, toWhere:redirectLocation, redirect:true}
            let nextState = state;
            return nextState;
        }
        default:
            return state;
    }
}