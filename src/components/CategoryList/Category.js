import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 150,
  },
  group: {
    flex: 1,
  },
  link: {
    color: 'dodgerblue',
    textDecoration: 'none',
  },
}));

const Category = props => {
  const classes = useStyles();
  const { group } = props;

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Grid item xs={12} md={4} lg={3}>
      <Paper className={fixedHeightPaper}>
        <Typography
          component="h1"
          variant="h4"
          color="primary"
          className={classes.group}
        >
          {group}
        </Typography>
        <div>
          <Link to={group} className={classes.link}>
            {`View more on ${group} group`}
          </Link>
        </div>
      </Paper>
    </Grid>
  );
};

Category.propTypes = {
  group: PropTypes.string,
};

export default Category;
