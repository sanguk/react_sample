import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    Button,
    Box,
    Drawer,
    Grid,
    Hidden,
    SvgIcon,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { X as XIcon } from 'react-feather';
import type { Theme } from 'src/theme';
import numeral from 'numeral';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';

interface AssignedItemBulkOperationProps {
    className?: string;
    open: boolean;
    selectedLineItems: string[];
    shippable: number;
    invoiceable: number;
    handleActionItemClick: (event: React.MouseEvent<unknown>) => void;
    handleClearSelectedLineItems: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(3)
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > * + *': {
            marginLeft: theme.spacing(2)
        }
    }
}));

const AssignedItemBulkOperation: FC<AssignedItemBulkOperationProps> = ({
    className,
    open,
    selectedLineItems,
    shippable,
    invoiceable,
    handleClearSelectedLineItems,
    handleActionItemClick,
    ...rest
}) => {

    const classes = useStyles();


    return (
        <Drawer
            anchor="bottom"
            open={open}
            PaperProps={{ elevation: 1 }}
            variant="persistent"
        >
            <div
                className={clsx(classes.root, className)}
                {...rest}
            >
                <Grid container spacing={2} alignItems="center">
                    <Hidden smDown>
                        <Grid item xs={12} lg={4}>
                            <Box textAlign="center">
                                <Typography color="primary" variant="subtitle1">
                                    {selectedLineItems.length}
                                    {' '}
                                    Item,
                                    {' '}
                                    {numeral(shippable).format(`0,0`)}
                                    {' '}
                                    lb Selected
                                </Typography>
                            </Box>
                        </Grid>
                    </Hidden>

                    <Grid item xs={12} lg={4}>
                        <Box textAlign="center">
                            <Button
                                onClick={(event) => handleActionItemClick(event)}
                                startIcon={
                                    <SvgIcon>
                                        <MonetizationOnOutlinedIcon />
                                    </SvgIcon>
                                }
                            >
                                Create Invoice
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <Box textAlign="right">
                            <Button
                                onClick={handleClearSelectedLineItems}
                                startIcon={
                                    <SvgIcon>
                                        <XIcon />
                                    </SvgIcon>
                                }
                            >
                                Clear Selections
                            </Button>
                        </Box>
                    </Grid>

                </Grid>
            </div>
        </Drawer>
    );
}

AssignedItemBulkOperation.propTypes = {
    className: PropTypes.string,
    open: PropTypes.bool,
};

AssignedItemBulkOperation.defaultProps = {
    open: false
};

export default AssignedItemBulkOperation;