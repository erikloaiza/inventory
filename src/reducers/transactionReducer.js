import {
    START_TRANSACTION_ACTION,
    ADD_TRANSACTION_SUCCESS,
} from '../actions/transaction';

const initialState = {
    isLoading: false,
    error: null,
};

const TransactionReducer = (state = initialState, action) => {
    switch (action.type) {
        case START_TRANSACTION_ACTION:
            return { ...state, error: null, isLoading: true };
        case ADD_TRANSACTION_SUCCESS:
            return { ...state, error: null, isLoading: false };
        default:
            return state;
    }
};

export default TransactionReducer;
