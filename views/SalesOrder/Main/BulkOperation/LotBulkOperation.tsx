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
import numeral from 'numeral';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import type { Theme } from 'src/theme';


interface LotBulkOperationProps {
  className?: string;
  open: boolean;
  selectedLineItems: string[];

  allocatable: number;
  handleActionItem1Click: () => void;
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

const LotBulkOperation: FC<LotBulkOperationProps> = ({
  className,
  open,
  selectedLineItems,

  allocatable,
  handleClearSelectedLineItems,
  handleActionItem1Click,
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

        <Grid
          alignItems="center"
          container
          spacing={2}
        >
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
                  {numeral(allocatable).format(`0,0`)}
                  {' '}
                lb Selected
              </Typography>
              </Box>
            </Grid>

          </Hidden>

          <Grid item xs={12} lg={4}>
            <Box textAlign="center">

              <Button
                onClick={handleActionItem1Click}
                startIcon={
                  <SvgIcon>
                    <ShareOutlinedIcon />
                  </SvgIcon>
                }
              >

                Quick Allocation {' '}
                {numeral(allocatable).format(`0,0`)}
                {' lb'}

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

LotBulkOperation.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool,
  //selectedLots: PropTypes.array.isRequired
};

LotBulkOperation.defaultProps = {
  open: false
};

export default LotBulkOperation;
