import * as types from '../constants/types';

export function navigate(toWhere) {
    return {
        type: types.navigate.TO,
        location: toWhere
    };
}