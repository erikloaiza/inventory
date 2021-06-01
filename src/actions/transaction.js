import { UPDATE_PRODUCT_SUCCESS } from "./product";
export const START_TRANSACTION_ACTION = 'START_TRANSACTION_ACTION';
export const ADD_TRANSACTION_SUCCESS = 'ADD_TRANSACTION_SUCCESS';
export const GET_TRANSACTION_LIST = 'GET_TRANSACTION_LIST';

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
                transactions.products.map(({ id, code, total }) =>
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

export const getTransactions = () => {
    return (dispatch, getState, { getFirestore }) => {
        dispatch({ type: START_TRANSACTION_ACTION });
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;
        return firestore
            .collection('transactions')
            .where('userId', '==', userId)
            .get()
            .then(querySnapshot => {
                const transactions = []
                querySnapshot.forEach((doc) => {
                    transactions.push({ id: doc.id, ...doc.data() })
                });
                dispatch({ type: GET_TRANSACTION_LIST, payload: transactions });
            })
    }
}
