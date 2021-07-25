import React, { useState } from 'react';
import type { FC } from 'react';
import { Theme } from 'src/theme';
import {
  Box,
  Divider,
  Typography,
  Grid,
  Chip,
  makeStyles
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import moment from 'moment';
import type { Order, OrderStatus } from 'src/types/simpleorder';
import numeral from 'numeral';

interface ToolTipCardProps {
  className?: string;
  order: Order;
  getStatusLabel: (orderStatus: OrderStatus) => JSX.Element;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  font: {
    fontSize: '0.7rem',
    color: '#9699a4'
  },
}))


const ToolTipCard: FC<ToolTipCardProps> = ({ order, getStatusLabel }) => {
  const classes = useStyles();
  const [checkList, setCheckList] = useState<string[]>(order.checkList);


  return (
    <React.Fragment>

      <Grid container alignItems="center">
        <Grid item >
          <Box>
            <Typography variant="caption">
              {order.customerPO}
            </Typography>
          </Box>
        </Grid>

      </Grid>

      <Grid container alignItems="center" justify="space-evenly">

        <Grid item >
          {checkList?.includes("SO") &&
            <Chip
              variant="outlined"
              size="small"
              label="SO"
              color="primary"
              icon={<DoneIcon />}
            />}
        </Grid>

        <Grid item >
          {checkList?.includes("MTC") &&
            <Chip
              variant="outlined"
              size="small"
              label="MTC"
              color="primary"
              icon={<DoneIcon />}
            />}
        </Grid>

        <Grid item >
          <Box>
            <Typography variant="caption" color="textSecondary" className={classes.font}>
              total amount
            </Typography>
          </Box>
          <Box>
            <Typography>
              {numeral(order.totalAmount).format(`$0,0.00`)}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container alignItems="center">
        <Grid item xs={12} sm={4}>
          <Box>
            <Typography variant="caption" color="textSecondary" className={classes.font}>
              sales rep
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption">
              {order.salesRep}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Box>
            <Typography variant="caption" color="textSecondary" className={classes.font}>
              order date
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption">
              {moment(order.orderedAt).format('MM/DD/yyyy')}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Box>
            <Typography variant="caption" color="textSecondary" className={classes.font}>
              ship to
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption">
              {order.shipTo[0].state}, {order.shipTo[0].city}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider />

      <Grid container >
        <Grid item xs={12} sm={4}>
          <Box>
            <Typography variant="caption" color="textSecondary" className={classes.font}>
              payment term
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption">
              {order.paymentTerm}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Box>
            <Typography variant="caption" color="textSecondary" className={classes.font}>
              freight term
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption">
              {order.freightTerm}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Box>
            <Typography variant="caption" color="textSecondary" className={classes.font}>
              payment term
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption">
              {order.discountPercentage}{'% '}{order.discountPayIn}{' '}{order.paymentTerm}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider />

      <Grid container alignItems="center">
        <Grid item>
          <Box>
            <Typography variant="caption" color="textSecondary" className={classes.font}>
              note
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption">
              {order.internalMemo}
            </Typography>
          </Box>
        </Grid>
      </Grid>

    </React.Fragment>

  )
};


export default ToolTipCard;