import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Button,
  Drawer,
  Grid,
  Hidden,
  SvgIcon,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  Check as CheckIcon,
  X as XIcon,
  Trash as TrashIcon
} from 'react-feather';
import type {Theme} from 'src/theme';

interface FulfillmentProps {
  className?: string;
  onDelete?: () => void;
  onMarkPaid?: () => void;
  onMarkUnpaid?: () => void;
  open?: boolean;
  anchor?: string;
//  selected: string[];
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
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

const toggleDrawer = (open: boolean) => (
  event: React.KeyboardEvent | React.MouseEvent,
) => {
  if (
    event.type === 'keydown' &&
    ((event as React.KeyboardEvent).key === 'Tab' ||
      (event as React.KeyboardEvent).key === 'Shift')
  ) {
    return;
  }

  
};



const Fulfillment: FC<FulfillmentProps> = ({
  className,
  onDelete,
  onMarkPaid,
  onMarkUnpaid,
  open,
  //selected,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Drawer
      anchor="right"
      open={open}
      PaperProps={{ elevation: 1 }}
 
      onClose={toggleDrawer(false)}
    >
      <div
        className={clsx(classes.root, className)}
        onClick={toggleDrawer(false)}
        {...rest}
      >
        <Grid
          alignItems="center"
          container
          spacing={2}
        >
          <Hidden smDown>
            <Grid
              item
              md={3}
            >
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
            
                {' '}
                selected
              </Typography>
            </Grid>
          </Hidden>
          <Grid
            item
            md={6}
            xs={12}
          >
            <div className={classes.actions}>
              <Button
                onClick={onMarkPaid}
                startIcon={
                  <SvgIcon fontSize="small" >
                    <CheckIcon />
                  </SvgIcon>
                }
              >
                Mark Paid
              </Button>
              <Button
                onClick={onMarkUnpaid}
                startIcon={
                  <SvgIcon fontSize="small" >
                    <XIcon />
                  </SvgIcon>
                }
              >
                Mark Unpaid
              </Button>
              <Button
                onClick={onDelete}
                startIcon={
                  <SvgIcon fontSize="small" >
                    <TrashIcon />
                  </SvgIcon>
                }
              >
                Delete
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </Drawer>
  );
}

Fulfillment.propTypes = {
  className: PropTypes.string,
  onDelete: PropTypes.func,
  onMarkPaid: PropTypes.func,
  onMarkUnpaid: PropTypes.func,
  open: PropTypes.bool,

};

Fulfillment.defaultProps = {
  onDelete: () => {},
  onMarkPaid: () => {},
  onMarkUnpaid: () => {},
  open: false
};

export default Fulfillment;
