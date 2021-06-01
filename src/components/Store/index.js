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

import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

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
  const [openError, setOpenError] = useState(false);

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
      if (addedProduct.total === '0') {
        setOpenError(`No tiems available for product: ${addedProduct.name}`)
      }
      else {
        const current = products.find(p => p.code === addedProduct.code)
        if (current) {
          updateTotal(current.code, current.total + 1)
        }
        else {
          const product = { ...addedProduct, total: 1, max: addedProduct.total }
          setProducts([...products, product])
        }
      }
    }
  }, [addedProduct])

  const updateTotal = (code, total) => {
    setProducts(products.map(x => {
      if (x.code === code) {
        console.log(total)
        if (x.max < total) {
          setOpenError(`trying to add ${total} to ${x.name}, but only ${x.max} in stock`)
        }
        else if (total <= 0 && total !== undefined) {
          setOpenError(`Minimum amount is 1, to remove the item use the delete button instead`)
        }
        else {
          x.total = total
        }
      }
      return x
    }))
  }

  const saveTransaction = async () => {
    try {
      if (products.length) {
        setOpen(true)
        setProducts([])
        setClientInfo('')
        setAdditionalInfo('')
        if (isCreditCard) {
          const res = await axios.post(`${process.env.REACT_APP_SQUAREUP_URL}locations/${process.env.REACT_APP_SQUAREUP_LOCATION_ID}/checkouts`,
            {
              idempotency_key: uuidv4(),
              order: {
                idempotency_key: uuidv4(),
                order: {
                  location_id: process.env.REACT_APP_SQUAREUP_LOCATION_ID,
                  customer_id: clientInfo,
                  note: additionalInfo,
                  line_items:
                    products.map(p => ({
                      quantity: p.total,
                      base_price_money: {
                        amount: p.price * 100,
                        currency: "USD"
                      },
                      name: p.name
                    }))
                }
              }

            },
            {
              headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_SQUAREUP_ACCESS_TOKEN}`
              }
            }
          )
          const { checkout_page_url: checkoutUrl, id: squareUpId } = res.data;
          const newWindow = window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
          if (newWindow) newWindow.opener = null
          return createTransaction({ clientInfo, additionalInfo, products, isCreditCard, squareUpId, total: products.map(p => p.total * p.price).reduce((a, c) => a + c) },)
        }
        return createTransaction({ clientInfo, additionalInfo, products, isCreditCard, total: products.map(p => p.total * p.price).reduce((a, c) => a + c) },)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const removeItem = (code) => {
    setProducts(products.filter(x => x.code !== code))
  }

  const formatPrice = (price = 0) => {
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(price)
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
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.model}</TableCell>
                    <TableCell><OutlinedInput type='number' value={product.total} onChange={e => updateTotal(product.code, e.target.value)} InputProps={{
                      inputProps: {
                        max: product.total,
                        min: 1
                      }
                    }} />
                    </TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{formatPrice(product.price * product.total)}</TableCell>
                    <TableCell>
                      <IconButton aria-label="delete" onClick={() => removeItem(product.code)}>
                        <DeleteIcon fontSize="small" color="secondary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell>
                    <Typography component="h2" variant="h5" color="primary" gutterBottom xs={12}>
                      TOTAL:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography component="h2" variant="h5" color="primary" gutterBottom xs={12}>
                      {formatPrice(products.map(p => p.total * p.price).reduce((a, c) => a + c))}
                    </Typography>
                  </TableCell>
                </TableRow>
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
          <TextField label="code" variant="outlined" value={manualProductSerial} onChange={e => setManualProductSerial(e.target.value)} />
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
      <Snackbar open={openError} autoHideDuration={6000} onClose={e => setOpenError(false)}>
        <MuiAlert elevation={6} variant="filled" onClose={e => setOpen(false)} severity="error">
          {openError}
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