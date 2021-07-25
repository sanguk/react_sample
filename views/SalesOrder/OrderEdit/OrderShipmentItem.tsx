import React from 'react';
import type { FC } from 'react';
//import useIsMountedRef from 'src/hooks/useIsMountedRef';
//import axios2 from 'src/utils/axios2';
import {
    //Box,
    //Table,
    //TableBody,
    TableCell,
    //TableHead,
    TableRow,
    //Typography,
    makeStyles,
    //Button,
    //TextField,
    Grid,
    //SvgIcon,
    //IconButton,
    //Popover,
    //Tooltip
} from '@material-ui/core';
//import type { Order, Lot, OrderStatus, Allocation, FromSite, OrderUseFormMethods, Inventory } from 'src/types/simpleorder';
//import { useForm, Controller, useFormContext } from 'react-hook-form';

interface OrderShipmentItemProps {
    /* itemAssignMethods: any;
    itemAssign: any;
    index;
    index2;
    inventories: Inventory[];
    from: string; */
}

const useStyles = makeStyles(() => ({

}))

const OrderShipmentItem: FC<OrderShipmentItemProps> = ({ ...rest }) => {
    const classes = useStyles();


    return (
        <TableRow>
            <TableCell colSpan={3}>
            </TableCell>

            <TableCell>
                <Grid item>
                    Item Number
                </Grid>
            </TableCell>
            <TableCell colSpan={4}>
                <Grid item>
                    From
                </Grid>
            </TableCell>
            <TableCell>
                <Grid item>
                    Weight
                </Grid>
            </TableCell>
            <TableCell>
                <Grid item>
                    Length
                </Grid>
            </TableCell>
        </TableRow >

    );
}

export default OrderShipmentItem