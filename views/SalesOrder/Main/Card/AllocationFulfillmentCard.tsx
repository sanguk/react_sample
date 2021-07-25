import React from 'react';
import type { FC } from 'react';
import type { Order, OrderStatus } from 'src/types/simpleorder';
import type { Theme } from 'src/theme';
import {
  Box,
  Grid,
  Typography,
  Tooltip,
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import type { Lot, Allocation } from 'src/types/simpleorder';
import AllocationFulfillmentTooltip from '../ToolTip/AllocationFulfillmentTooltip';

interface AllocationFulfillmentCardProps {
  className?: string;
  allocation: Allocation;
}

const useStyles = makeStyles((theme: Theme) => ({
  progressCircle: {
    marginTop: 5,
    marginLeft: 10,
  },
  typography: {
    fontSize: '0.7rem',
    color: 'textSecondary'
  },
}));

const AllocationFulfillmentCard: FC<AllocationFulfillmentCardProps> = ({ allocation }) => {
  const classes = useStyles();
  const applyColor = (progress: number) => {
    var status: string

    if (progress >= 0 && progress < 50) {
      status = 'grey'
    }

    if (progress >= 50 && progress < 100) {
      status = 'inherit'
    }

    if (progress >= 100) {
      status = ''
    }
    return (
      status
    )
  }
  const shipmentProgress = (allocation.shipped / allocation.weight) * 100
  const invoiceProgress = (allocation.invoiced / allocation.weight) * 100

  return (
    <Tooltip
      arrow
      placement="top"
      interactive
      title={<AllocationFulfillmentTooltip allocation={allocation} />}
    >

      <Grid item>
        <Box justifyContent="center" position="relative" display="inline-flex">
          <CircularProgress size={20} className={classes.progressCircle} variant="determinate" value={shipmentProgress} style={{ color: applyColor(shipmentProgress) }} />
          <Box top={5} left={10} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
            <Typography className={classes.typography} component="div" color="textSecondary">
              S
        </Typography>
          </Box>
        </Box>

        <Box justifyContent="center" position="relative" display="inline-flex">
          <CircularProgress size={20} className={classes.progressCircle} variant="determinate" value={invoiceProgress} style={{ color: applyColor(invoiceProgress) }} />
          <Box top={5} left={10} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
            <Typography className={classes.typography} component="div" color="textSecondary">
              I
        </Typography>
          </Box>
        </Box>

      </Grid>
    </Tooltip>
  )

}

export default AllocationFulfillmentCard;