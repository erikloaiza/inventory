import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { useStyles } from '../auth/authStyles';
import FormButton from '../shared/FormButton';

const ProductForm = props => {
  const classes = useStyles();
  const { update, addProduct, categoryName, productById, isLoading } = props;

  const [serial, setSerial] = useState('');
  const [product, setProduct] = useState({
    name: '',
    model: '',
    serial: '',
    category: '',
    description: '',
    total: 0
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
    const { name, model, category } = product;
    const formIsValid = name.trim() && category.trim(); //model.trim() && category.trim();
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
    const value = target.value;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container component="main" maxWidth="xs">
      <form className={classes.form} onSubmit={handleSubmit} noValidate>
        {error && <p>{error}</p>}
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
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="model"
          label="Product Model"
          name="model"
          autoComplete="model"
          onChange={inputChange}
          value={product.model}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="description"
          label="Description"
          name="description"
          onChange={inputChange}
          value={product.description}
        />
        {!categoryName && (
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="category"
            label="Product Category"
            name="category"
            autoComplete="category"
            onChange={inputChange}
            value={product.category}
          />
        )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="serial"
          label="Product Serial"
          name="serial"
          autoComplete="serial"
          value={product.serial}
          onChange={inputChange}
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
