import React from 'react';
import type { FC } from 'react';

import type { Theme } from 'src/theme';
import {
  Box,
  Grid,
  Tooltip,
  Typography,
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import type { Lot } from 'src/types/simpleorder';
import LotFulfillmentTooltip from '../ToolTip/LotFulfillmentTooltip';

interface LotFulfillmentCardProps {
  className?: string;
  lot: Lot;
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

const LotFulfillmentCard: FC<LotFulfillmentCardProps> = ({ lot }) => {
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


  const allocationProgress = (lot.allocated / lot.weight) * 100
  const shipmentProgress = (lot.shipped / lot.weight) * 100
  const invoiceProgress = (lot.invoiced / lot.weight) * 100

  return (
    <Tooltip
      arrow
      placement="top"
      interactive
      title={<LotFulfillmentTooltip lot={lot} />}
    >

      <Grid item>
        <Box justifyContent="center" position="relative" display="inline-flex">
          <CircularProgress
            size={20}
            style={{ color: applyColor(allocationProgress) }}
            className={classes.progressCircle}
            variant="determinate"
            value={allocationProgress}
          />
          <Box top={5} left={10} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
            <Typography className={classes.typography} component="div" color="textSecondary">
              A
        </Typography>
          </Box>
        </Box>

        <Box justifyContent="center" position="relative" display="inline-flex">
          <CircularProgress
            size={20}
            style={{ color: applyColor(shipmentProgress) }}
            className={classes.progressCircle}
            variant="determinate"
            value={shipmentProgress}
          />
          <Box top={5} left={10} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
            <Typography className={classes.typography} component="div" color="textSecondary">
              S
        </Typography>
          </Box>
        </Box>

        <Box justifyContent="center" position="relative" display="inline-flex">
          <CircularProgress
            size={20}
            style={{ color: applyColor(invoiceProgress) }}
            className={classes.progressCircle}
            variant={"determinate"}
            value={invoiceProgress}
          />
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

export default LotFulfillmentCard;