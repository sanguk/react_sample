import React from 'react';
import type { FC } from 'react';
import type { Theme } from 'src/theme';
import {
    Box,
    Grid,
    Typography,
    Tooltip,
    makeStyles,
    CircularProgress
} from '@material-ui/core';
import type { ShipmentTableType } from 'src/types/simpleorder';
import ShipmentFulfillmentTooltip from '../ToolTip/ShipmentFulfillmentTooltip';


interface ShipmentFulfillmentCardProps {
    className?: string;
    shipmentTable: ShipmentTableType;
}

const useStyles = makeStyles((theme: Theme) => ({
    progressCircle: {
        marginTop: 5,
        marginLeft: 10,
    },
    typography: {
        fontSize: '0.7rem',
        color: 'textSecondary',
    },
}));

const ShipmentFulfillmentCard: FC<ShipmentFulfillmentCardProps> = ({ shipmentTable }) => {
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
  var invoiceProgress = (shipmentTable.invoiced / shipmentTable.weight) * 100;
  if (isNaN(invoiceProgress)) {
    invoiceProgress = 0;
  }
  console.log('invoiceProgress', invoiceProgress)
    return (
        <Tooltip
        arrow
        placement="top"
        interactive
        title={<ShipmentFulfillmentTooltip shipmentLot={shipmentTable} />}
        >
        <Grid item>
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

export default ShipmentFulfillmentCard;