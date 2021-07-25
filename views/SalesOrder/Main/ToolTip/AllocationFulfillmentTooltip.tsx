import React from 'react';
import type { FC } from 'react';
import {
    Box,
    Typography,
    Grid,
} from '@material-ui/core';
import type { Allocation } from 'src/types/simpleorder';
import numeral from 'numeral';

interface AllocationFulfillmentTooltipProps {
    className?: string;
    allocation: Allocation;
}


const AllocationFulfillmentTooltip: FC<AllocationFulfillmentTooltipProps> = ({ allocation }) => {

    return (
        <Grid container flex-flow="nowrap" justify="space-between">
            <Grid item>
                <Box style={{ paddingRight: 3 }}>
                    <Typography variant="caption">
                        Shipped: {numeral(allocation.shipped).format(`0,0`)}
                    </Typography>
                </Box>
            </Grid>

            <Grid item>
                <Box>
                    <Typography variant="caption">
                        Invoiced: {numeral(allocation.invoiced).format(`0,0`)}
                    </Typography>
                </Box>
            </Grid>
        </Grid>

    );
};

export default AllocationFulfillmentTooltip;