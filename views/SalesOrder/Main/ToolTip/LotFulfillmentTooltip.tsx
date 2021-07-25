import React from 'react';
import type { FC } from 'react';
import { Theme } from 'src/theme';
import {
    Box,
    Typography,
    Grid,
    makeStyles
} from '@material-ui/core';
import type { Lot } from 'src/types/simpleorder';
import numeral from 'numeral';
//import { StringNullableChain } from 'lodash';
//import { OrderedMap } from 'immutable';

interface LotFulfillmentTooltipProps {
    className?: string;
    lot: Lot;
}

//const useStyles = makeStyles((theme: Theme) => ({
    
//}))

const LotFulfillmentTooltip: FC<LotFulfillmentTooltipProps> = ({ lot }) => {
    //const classes = useStyles();

    return (
        <Grid container flex-flow="nowrap" justify="space-between">
            <Grid item>
                <Box style={{ paddingRight: 3 }}>
                    <Typography variant="caption">
                        Allocated: {numeral(lot.allocated).format(`0,0`)}
                    </Typography>
                </Box>
            </Grid>

            <Grid item>
                <Box style={{ paddingRight: 3 }}>
                    <Typography variant="caption">
                        Shippped: {numeral(lot.shipped).format(`0,0`)}
                    </Typography>
                </Box>
            </Grid>

            <Grid item>
                <Box >
                    <Typography variant="caption">
                        Invoiced: {numeral(lot.invoiced).format(`0,0`)}
                    </Typography>
                </Box>
            </Grid>
        </Grid>

    );
};

export default LotFulfillmentTooltip;