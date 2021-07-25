import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Box,
  Dialog,
  Divider,
  Grid,
  Typography,
  makeStyles,
  IconButton,
  SvgIcon
} from '@material-ui/core';
import {
  XCircle as CloseIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  ArrowRight as ArrowRightIcon,
  Archive as ArchiveIcon,
  CheckSquare as CheckIcon,
  Copy as CopyIcon,
  Users as UsersIcon,
  File as FileIcon,
  Layout as LayoutIcon
} from 'react-feather';
import type { Theme } from 'src/theme';
import { useDispatch } from 'src/store';
import {
  deleteCard,
  updateCard,
  addChecklist
} from 'src/slices/kanban';
import type { Card, List } from 'src/types/kanban';
import Details from './Details';
import Checklist from './Checklist';
import Comment from './Comment';
import CommentAdd from './CommentAdd';
import ActionButton from './ActionButton';
import OrderInfo from './OrderInfo';
import OrderItem from './OrderItem';
import { processScopedUiProps } from '@fullcalendar/core';
import type { Order, Lot, OrderStatus } from 'src/types/simpleorder';
import { orderBy } from 'lodash';
import type { Customer } from 'src/types/customer1';

interface OrderEditResultProps {
  className?: string;
  onClose?: () => void;
  open: boolean;
  salesOrder: any;
  handleCloseOrderEdit: () => void;
  OpenOrderEdit: (event: React.MouseEvent<unknown>, orderNo: string) => void
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
    minWidth: 1900
  },
  listName: {
    fontWeight: theme.typography.fontWeightMedium
  },
}));

const OrderEditResult: FC<OrderEditResultProps> = ({
  className,
  onClose,
  open,
  salesOrder,
  handleCloseOrderEdit,
  OpenOrderEdit,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      fullScreen
      {...rest}
    >
      <div className={classes.root}>
        <OrderInfo salesOrder={salesOrder} handleCloseOrderEdit={handleCloseOrderEdit} OpenOrderEdit={OpenOrderEdit}/>
      </div>
    </Dialog>
  );
};

OrderEditResult.propTypes = {
  // @ts-ignore
  //card: PropTypes.object.isRequired,
  className: PropTypes.string,
  // @ts-ignore
  // list: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

OrderEditResult.defaultProps = {
  open: false,
  onClose: () => { }
};

export default OrderEditResult;


/*
 *
 * //const dispatch = useDispatch();
  //const { enqueueSnackbar } = useSnackbar();
  //const [salesOrder, setSalesOrder] = useState<Order>(null);

  const handleSubscribe = async (): Promise<void> => {
    try {
      await dispatch(updateCard(card.id, { isSubscribed: true }));
      enqueueSnackbar('Unsubscribed', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleUnsubscribe = async (): Promise<void> => {
    try {
      await dispatch(updateCard(card.id, { isSubscribed: false }));
      enqueueSnackbar('Subscribed', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await dispatch(deleteCard(card.id));
      enqueueSnackbar('Card archived', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleAddChecklist = async (): Promise<void> => {
    try {
      await dispatch(addChecklist(card.id, 'Untitled Checklist'));
      enqueueSnackbar('Checklist added', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };
*/