import React from 'react';
import type { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Box,
  Divider,
  Typography,
  Grid,
} from '@material-ui/core';
import type { Order, OrderStatus } from 'src/types/simpleorder';
import Label from 'src/components/Label';

interface ItemCardProps {
  className?: string;
  order: Order;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
}))

const ItemCard: FC<ItemCardProps> = ({ order }) => {
  const classes = useStyles();


  return (
    <React.Fragment>

      <Grid container spacing={2} alignContent='center' xs={12}>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="caption" color="textSecondary">
              steel
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">
            GL - BTP
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="caption" color="textSecondary">
              grade
          </Typography>
          </Box>
          <Box>
            <Label color="secondary">
            SEC
            </Label>
          </Box>
        </Grid>
      </Grid>
      
      <Divider/>

      <Grid container spacing={2} alignContent='center' xs={12}>
        <Grid item xs={12} sm={3}>
          <Box>
          <Typography variant="h6">
            GR80
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box>
          <Typography variant="h6">
            AZ50
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
          <Typography variant="h6">
            26GA X 41.56
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider/>

      <Grid container spacing={1} alignContent='center' >
        <Grid item>
          <Box>
            <Typography variant="caption" color="textSecondary">
              type
            </Typography>
          </Box>
          <Box>
          <Typography variant="h6">
           SMP
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box>
            <Typography variant="caption" color="textSecondary">
              brand
            </Typography>
          </Box>
          <Box>
          <Typography variant="h6">
          Valspar
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box>
          <Typography variant="caption" color="textSecondary">
            code
            </Typography>
          </Box>
          <Box>
          <Typography variant="h6">
            WXG0029L
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box>
          <Typography variant="caption" color="textSecondary">
            color 
            </Typography>
          </Box>
          <Box>
          <Typography variant="h6">
          WXL Colony Green
            </Typography>
          </Box>
        </Grid>
      </Grid>

    </React.Fragment>

  )
};

export default ItemCard;
