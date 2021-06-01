import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import Grid from '@material-ui/core/Grid';

import { useStyles } from '../auth/authStyles';
import FormButton from '../shared/FormButton';

const ProductForm = props => {
  const classes = useStyles();
  const { update, addProduct, categoryName, productById, isLoading } = props;

  const [autogenerate, setAutogenerate] = useState(false)

  const [product, setProduct] = useState({
    code: '',
    name: '',
    price: 0,
    presentation: '',
    units: 0,
    clasification: '',
    group: '',
    subgroup: '',
    observation: '',
    voucher: '',
    total: 0,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryName) {
      setProduct(prev => ({
        ...prev,
        category: categoryName,
      }));
    }
    if (productById) {
      setProduct(prev => ({
        ...prev,
        ...productById,
        updatedAt: new Date(),
      }));
    }
  }, [categoryName, productById]);

  const handleSubmit = e => {
    e.preventDefault();
    const { name, group, subgroup, code } = product;
    const formIsValid = name.trim() && group.trim() && subgroup.trim() && code.trim();
    if (formIsValid) {
      setError('');
      return chooseFormAction();
    }
    return setError('All Form Fields are Required');
  };

  const chooseFormAction = () => {
    try {
      if (!props.update) {
        addProduct(product);
      } else {
        update(product);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const inputChange = ({ target }) => {
    const name = target.name;
    const value = name === 'price' ? parseFloat(target.value.replace(/,/g, '')) : target.value;
    setProduct(prev => ({ ...prev, [name]: value }));
    if ((name === 'name' || name === 'group' || name === 'subgroup')) {
      generateCode()
    }
  };

  const generateCode = () => {
    if (autogenerate) {
      const code = product.group.split(' ').map(x => x.charAt(0)).join('') + product.subgroup.split(' ').map(x => x.charAt(0)).join('') + product.name.split(' ').map(x => x.charAt(0)).join('') + Math.ceil(Math.random() * 100)
      setProduct(prev => ({ ...prev, code }));
    }
  }

  useEffect(
    () => {
      generateCode()
    }, [autogenerate]
  )

  return (
    <Container component="main" maxWidth="xs">
      <form className={classes.form} onSubmit={handleSubmit} noValidate>
        {error && <p>{error}</p>}
        <div
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            id="code"
            label="Product code"
            name="code"
            autoComplete="code"
            value={product.code}
            onChange={inputChange}
          />
          <FormControlLabel
            control={<Switch color="primary" checked={autogenerate} onChange={e => setAutogenerate(p => !p)} />}
            label="Autogenerate"
            labelPlacement="start"
          />
        </div>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Product Name"
          name="name"
          autoComplete="productName"
          onChange={inputChange}
          value={product.name}
        />
        <CurrencyTextField
          label="Product Price"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="price"
          value={product.price}
          currencySymbol="$"
          //minimumValue="0"
          outputFormat="string"
          decimalCharacter="."
          digitGroupSeparator=","
          onChange={inputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="presentation"
          label="Product Presentation"
          name="presentation"
          autoComplete="presentation"
          onChange={inputChange}
          value={product.presentation}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="units"
          label="Container Units"
          name="units"
          autoComplete="units"
          value={product.units}
          onChange={inputChange}
          type="number"
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="clasification"
          label="Product Clasification"
          name="clasification"
          autoComplete="model"
          onChange={inputChange}
          value={product.clasification}
        />
        {!categoryName && (
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="group"
            label="Product Group"
            name="group"
            autoComplete="group"
            onChange={inputChange}
            value={product.group}
          />
        )}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="subgroup"
          label="Product Sub-Group"
          name="subgroup"
          autoComplete="subgroup"
          onChange={inputChange}
          value={product.subgroup}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="observation"
          label="Observations "
          name="observation"
          onChange={inputChange}
          value={product.observation}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="voucher"
          label="Voucher "
          name="voucher"
          onChange={inputChange}
          value={product.voucher}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="total"
          label="Total products"
          name="total"
          autoComplete="total"
          value={product.total}
          onChange={inputChange}
          type="number"
        />

        <FormButton
          isLoading={isLoading}
          text={
            update
              ? 'Save Changes'
              : categoryName
                ? `Add New to ${categoryName}`
                : 'Add New'
          }
        />
      </form>
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    isLoading: state.products.isLoading,
  };
};

export default connect(
  mapStateToProps,
  {},
)(ProductForm);
