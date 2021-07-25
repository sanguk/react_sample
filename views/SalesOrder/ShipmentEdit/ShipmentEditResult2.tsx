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
  SvgIcon,
  Slide
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
import ShipmentInfo from './ShipmentInfo';
import TransportationInfo from './TransportationInfo';
import ShipmentGroup from './ShipmentItem';
import { processScopedUiProps } from '@fullcalendar/core';
import type { Order, Lot, OrderStatus } from 'src/types/simpleorder';
import { orderBy } from 'lodash';
import { TransitionProps } from '@material-ui/core/transitions';


interface ShipmentEditResult2Props {
  className?: string;
  open: boolean;

}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  listName: {
    fontWeight: theme.typography.fontWeightMedium
  },
  checklist: {
    '& + &': {
      marginTop: theme.spacing(3)
    }
  },


}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const ShipmentEditResult2: FC<ShipmentEditResult2Props> = ({
  open,

}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();



  /*
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
  return (
    <Dialog
      fullScreen open={open}

      TransitionComponent={Transition}


    >
      <div className={classes.root}>

      </div>
    </Dialog>
  );
};

ShipmentEditResult2.propTypes = {
  // @ts-ignore
  // card: PropTypes.object.isRequired,
  className: PropTypes.string,
  // @ts-ignore
  // list: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

ShipmentEditResult2.defaultProps = {
  open: false,

};

export default ShipmentEditResult2;
