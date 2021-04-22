import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Search from '@material-ui/icons/Search';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';

import { viewProduct } from '../../actions/product'
import { createTransaction } from "../../actions/transaction";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
const Store = ({ addedProduct, viewProduct, createTransaction }) => {
  const video = useRef()
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([])
  const [manualProductSerial, setManualProductSerial] = useState('')
  const [clientInfo, setClientInfo] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')

  const [isCreditCard, setIsCreditCard] = useState(false)


  useEffect(() => {
    const hints = new Map();
    const formats = [
      BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.PDF_417,
      BarcodeFormat.QR_CODE,
      BarcodeFormat.EAN_13,
    ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

    const codeReader = new BrowserMultiFormatReader(hints);
    codeReader
      .decodeFromVideoDevice(undefined, video.current, result => {
        if (result)
          viewProduct(result.text)
      })
  }, [video])

  useEffect(() => {
    if (addedProduct) {
      const current = products.find(p => p.serial === addedProduct.serial)
      if (current) {
        updateTotal(current.serial, current.total + 1)
      }
      else {
        const product = { ...addedProduct, total: 1 }
        setProducts([...products, product])
      }
    }
  }, [addedProduct])

  const updateTotal = (serial, total) => {
    setProducts(products.map(x => {
      if (x.serial === serial)
        x.total = total
      return x
    }))
  }

  const saveTransaction = () => {
    if (products.length) {
      setOpen(true)
      setProducts([])
      setClientInfo('')
      setAdditionalInfo('')
      createTransaction({ clientInfo, additionalInfo, products, isCreditCard })
    }
  }

  const removeItem = (serial) => {
    setProducts(products.filter(x => x.serial !== serial))
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={10}>
        {!products[0] && <Typography component="h1" variant="h4" color="primary" style={{ margin: 'auto' }}>
          Add items to Cart
        </Typography>}
        {products[0] && <Grid item xs={12}>
          <Typography component="h1" variant="h4" color="primary" gutterBottom>
            Current Cart
          </Typography>
          <ToggleButtonGroup
            value={isCreditCard}
            exclusive
            onChange={(e, v) => setIsCreditCard(v)}
            aria-label="payment type"
          >
            <ToggleButton value={true} aria-label="credit-card">
              <CreditCardIcon /> Credit Card
            </ToggleButton>
            <ToggleButton value={false} aria-label="cash">
              <LocalAtmIcon />Cash
            </ToggleButton>
          </ToggleButtonGroup>
          <Paper>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Product Model</TableCell>
                  <TableCell>Number of Products</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.model}</TableCell>
                    <TableCell><OutlinedInput type='number' value={product.total} onChange={e => updateTotal(product.serial, e.target.value)} InputProps={{
                      inputProps: {
                        max: product.total
                      }
                    }} />
                      <IconButton aria-label="delete" onClick={() => removeItem(product.serial)}>
                        <DeleteIcon fontSize="small" color="secondary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>}
      </Grid>
      <Grid container item xs={2}>
        <Grid item xs={12}>
          <Typography component="h2" variant="h5" color="primary" gutterBottom xs={12}>
            Search
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ marginBottom: '1em' }}>
          <video ref={video} width={200}></video>
        </Grid>
        <Grid item xs={10}>
          <TextField label="Serial" variant="outlined" value={manualProductSerial} onChange={e => setManualProductSerial(e.target.value)} />
        </Grid>
        <Grid item xs={2}>
          <IconButton color="primary" aria-label="Search by Code" onClick={() => viewProduct(manualProductSerial)}>
            <Search />
          </IconButton>
        </Grid>
        <Grid item style={{ marginTop: '2em' }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom xs={12}>
            Additional Info
          </Typography>
          <TextField label="Client" variant="outlined" value={clientInfo} onChange={e => setClientInfo(e.target.value)} />
          <TextField style={{ marginTop: '1em' }} label="Additional Info" multiline variant="outlined" value={additionalInfo} onChange={e => setAdditionalInfo(e.target.value)} />
          <Button variant="contained" color="primary" style={{ width: '100%', marginTop: '1em' }} onClick={saveTransaction}>
            Save Transaction
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={e => setOpen(false)}>
        <MuiAlert elevation={6} variant="filled" onClose={e => setOpen(false)} severity="success">
          Saved Transaction
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
};

const mapStateToProps = (state, ownProps) => ({
  addedProduct: state.products.product
})

export default connect(
  mapStateToProps,
  { viewProduct, createTransaction },
)(Store);