import React from 'react';
import type { FC } from 'react';
import { 
    Box,
    Typography,
    Grid,
} from '@material-ui/core';
import type { ShipmentTableType } from 'src/types/simpleorder';
import numeral from 'numeral';

interface ShipmentFulfillmentTooltipProps {
    className?: string;
    shipmentLot: ShipmentTableType;
}

const ShipmentFulfillmentTooltip: FC<ShipmentFulfillmentTooltipProps> = ({ shipmentLot }) => {

    return (
        <Grid container flex-flow="nowrap" justify="space-between">
            <Grid item>
                <Box>
                    <Typography variant="caption">
                        Invoiced: {numeral(shipmentLot.invoiced).format(`0,0`)}
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ShipmentFulfillmentTooltip;