import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { utils as XlsxUtils, writeFile } from "xlsx";
import { getTransactions } from "../../actions/transaction";

const { json_to_sheet: JsonToXlsx, book_new: CreateWorkBook, book_append_sheet: AppendSheetToWorkBook } = XlsxUtils

const Store = ({ transactions, getTransactions, isLoading }) => {

    useEffect(() => {
        if (transactions && transactions.length) {
            const data = transactions.flatMap(x => x.products.map(p => {
                const s = { ...x }
                delete s.products
                delete s.userId
                console.log(s.createdAt, p.createdAt)
                const product = { productId: p.id, date: s.createdAt.toDate(), ...p, }
                delete product.id
                delete product.createdAt
                delete product.updatedAt
                delete s.createdAt
                delete s.updatedAt
                return { ...s, ...product }
            }))
            console.log(data)
            async function download() {
                const sheet = await JsonToXlsx([].concat.apply([], data))
                const wb = CreateWorkBook()
                AppendSheetToWorkBook(wb, sheet, "data")
                writeFile(wb, `w&h_report_${new Date().toISOString()}.xlsx`)
                console.log('yes')
            };
            download()
        }
    }, [transactions])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Paper>
                    <Typography component="h6" variant="h6" color="primary" gutterBottom>
                        Download stats file
                    </Typography>
                    <Typography component="p" color="" gutterBottom>
                        Download Excel (.xlsx) file with detailed stats of all transactions
                    </Typography>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={getTransactions}
                    >
                        {isLoading ? <CircularProgress color="secondary" /> : 'Download'}
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = state => {
    return {
        isLoading: state.transactions.isLoading,
        transactions: state.transactions.transactions,
    };
};


export default connect(mapStateToProps,
    { getTransactions },
)(Store);
