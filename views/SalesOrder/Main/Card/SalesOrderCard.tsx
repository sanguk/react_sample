import React from 'react';
import type { FC } from 'react';
import type { Order, OrderStatus } from 'src/types/simpleorder';
import type { Theme } from 'src/theme';
import {
  Avatar,
  Button,
  Box,
  Card,
  Grid,
  Tooltip,
  Typography,
  makeStyles,
  colors,
} from '@material-ui/core';
import numeral from 'numeral';
import ToolTipCard from '../ToolTip/SalesOrderTooltip';
import moment from 'moment';

interface SalesOrderCardProps {
  className?: string;
  order: Order;
  getStatusLabel: (orderStatus: OrderStatus) => JSX.Element;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    maxWidth: 'none',
    paddingLeft: 10,
    paddingRight: 10,
    background: 'none'
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.common.white
  },
  Typography: {
    fontSize: '0.6rem',
  },
  tooltip: {
    padding: 'none',
    background: '#535353',
    minWidth: 300
  },
  marginTop: {
    marginTop: 5
  }
}));

const SalesOrderCard: FC<SalesOrderCardProps> = ({ order, getStatusLabel, OpenOrderEdit }) => {
  const classes = useStyles();

  return (
    <Tooltip
      arrow
      interactive
      classes={{ tooltip: classes.tooltip }}
      title={<ToolTipCard order={order}
        getStatusLabel={getStatusLabel} />}
      placement="right"
    >
      <Card className={classes.card}>
        <Grid container alignItems="center" >
          <Grid item xs={12} sm={1}>
            <Avatar
              aria-label="Order Card"
              variant="circular"
              className={classes.small}
              style={
                order.orderClass == 'B' ? { backgroundColor: colors.red['600'] }
                  : order.orderClass == 'C' ? { backgroundColor: colors.orange['600'] }
                    : order.orderClass == 'H' ? { backgroundColor: colors.amber['600'] }
                      : order.orderClass == 'S' ? { backgroundColor: colors.teal['600'] }
                        : order.orderClass == 'P' ? { backgroundColor: colors.blue['600'] }
                          : order.orderClass == 'T' ? { backgroundColor: colors.purple['600'] }
                            : { backgroundColor: colors.grey['600'] }
              }
            >
              {order.orderClass}
            </Avatar>
            <Typography className={classes.marginTop} color="textSecondary">
              ST
          </Typography>
          </Grid>

          <Grid item xs={12} sm={11}>
            <Grid container alignItems="center">

              <Grid item xs={12} sm={4} >
                
              </Grid>

              <Grid item xs={12} sm={8}>
                <Box
                  textOverflow="ellipsis"
                  overflow="hidden"
                >
                  <Typography variant="caption" noWrap>
                    {order.customerNo}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Grid container alignItems="center">
              <Grid item xs={12} sm={4}>
                <Box>
                  {getStatusLabel(order.orderStatus)}
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary" >
                    {moment(order.estDeliveryAt).format('MM/DD/yyyy').replace('Invalid date', 'No Est Date')}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Box>
                  <Typography variant="caption" color="textSecondary" className={classes.Typography}>
                    Ordered
                  </Typography>
                </Box>

                <Box>
                  <Typography>
                    {numeral(order.totalWeight).format(`0,0`)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={2} >
                <Box>
                  <Typography variant="caption" color="textSecondary" className={classes.Typography}>
                    Allocated
                  </Typography>
                </Box>
                <Box>
                  <Typography>
                    {numeral(order.allocated).format(`0,0`)}
                    {/*{Math.ceil((25000 / order.totalQty) * 100)}% */}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={2} >
                <Box>
                  <Typography variant="caption" color="textSecondary" className={classes.Typography}>
                    Shipped
                  </Typography>
                </Box>
                <Box textAlign="left">
                  <Typography >
                    {numeral(order.shipped).format(`0,0`)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={2} >
                <Box>
                  <Typography variant="caption" color="textSecondary" className={classes.Typography}>
                    Invoiced
                  </Typography>
                </Box>
                <Box>
                  <Typography >
                    {numeral(order.invoiced).format(`0,0`)}
                  </Typography>
                </Box>
              </Grid>

            </Grid>
          </Grid>
        </Grid>

      </Card>
    </Tooltip>

  )

}

export default SalesOrderCard;
