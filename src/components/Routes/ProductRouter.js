import React from 'react';
import { Switch, Route } from 'react-router-dom';

import * as routes from './routes';
import Home from '../Home';
import AddProduct from '../Products/AddProduct';
import CategoryList from '../CategoryList';
import ProductList from '../Products/ProductList';
import UpdateProduct from '../Products/UpdateProduct';
import Search from '../Search';
import ProductDetail from '../Products/ProductDetail';
import Store from '../Store'
import Stats from '../Stats'

const ProductRouter = () => {
  return (
    <Switch>
      <Route
        exact
        path={routes.HOME}
        component={Home}
      />
      <Route
        path={routes.ADDPRODUCT}
        component={AddProduct}
      />
      <Route
        path={routes.CATEGORYLIST}
        component={CategoryList}
      />
      <Route
        path={routes.SEARCH}
        component={Search}
      />
      <Route
        path={routes.STORE}
        component={Store}
      />
      <Route
        exact
        path={routes.REPORTS}
        component={Stats}
      />
      <Route
        exact
        path={`${routes.DASHBOARD}/:group`}
        component={ProductList}
      />
      <Route
        exact
        path={`${routes.DASHBOARD}/:group/:productId`}
        component={ProductDetail}
      />
      <Route
        exact
        path={`${routes.DASHBOARD}/:group/:productId/edit`}
        component={UpdateProduct}
      />
    </Switch>
  );
};

export default ProductRouter;
