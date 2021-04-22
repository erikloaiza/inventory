import { UPDATE_PRODUCT_SUCCESS } from "./product";
export const START_TRANSACTION_ACTION = 'START_TRANSACTION_ACTION';
export const ADD_TRANSACTION_SUCCESS = 'ADD_TRANSACTION_SUCCESS';

export const ERROR = 'ERROR';

export const createTransaction = transactions => {
    return (dispatch, getState, { getFirestore }) => {
        dispatch({ type: START_TRANSACTION_ACTION });
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;
        return firestore
            .collection('transactions')
            .add({
                ...transactions,
                userId,
                createdAt: new Date(),
            })
            .then(() => {
                dispatch({ type: ADD_TRANSACTION_SUCCESS });
                console.log(firestore.FieldValue.increment)
                transactions.products.map(({ id, serial, total }) =>
                    firestore
                        .collection('products')
                        .doc(id)
                        .update({
                            total: firestore.FieldValue.increment(-total),
                        })
                        .then(() => {
                            dispatch({ type: UPDATE_PRODUCT_SUCCESS });
                            return true;
                        })
                        .catch(err => {
                            dispatch({ type: ERROR, payload: err.message });
                        })
                );

                return true;
            })
            .catch(err => {
                dispatch({ type: ERROR, payload: err.message });
            });
    }
};
