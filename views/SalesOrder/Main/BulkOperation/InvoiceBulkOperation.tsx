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
//import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import numeral from 'numeral';
import AddShoppingCartOutlinedIcon from '@material-ui/icons/AddShoppingCartOutlined';

interface InvoiceBulkOperationProps {
  className?: string;
  open: boolean;
  selectedLineItems: string[];
  handleActionItem1Click: (event: React.MouseEvent<unknown>, shipmentNo: string) => void;
  handleClearSelectedLineItems: () => void;
  shippable: number;
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

const InvoiceBulkOperation: FC<InvoiceBulkOperationProps> = ({
  className,
  open,
  selectedLineItems,
  handleClearSelectedLineItems,
  handleActionItem1Click,
  shippable,
  ...rest
}) => {

  const classes = useStyles();
  // const [actionLabel, setActionLabel] = useState<string>();

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
                <Typography
                  color="primary"
                  variant="subtitle1"
                >
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
                onClick={(event) => handleActionItem1Click(event, null)}
                startIcon={
                  <SvgIcon>
                    <AddShoppingCartOutlinedIcon />
                  </SvgIcon>
                }
              >
                Assign Items
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

InvoiceBulkOperation.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool,
  //selectedLots: PropTypes.array.isRequired
};

InvoiceBulkOperation.defaultProps = {
  open: false
};

export default InvoiceBulkOperation;