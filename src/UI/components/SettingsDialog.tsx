import React, { useState } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { connect } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

import {
  toggleSettingsModal as toggleSettingsModalAction,
  setTransparecnyAmount as setTransparecnyAmountAction,
  toggleTransparency as toggleTransparencyAction,
} from '../redux/settings/settingsActions';
import { settingsPropType } from '../redux/settings/settingsReducer';

const useStyles = makeStyles({
  root: {},
  form: {
    display: 'flex',
    flexDirection: 'column',

    '& > div': {
      marginTop: 20,
    },
  },
  paper: {
    minWidth: 300,
  },
});

const TransparencyDialog = ({
  open,
  onClose,
  transparencyAmount,
  setTransparecnyAmount,
}: any) => (
  <Dialog open={open}>
    <DialogTitle>Transparancy Amount</DialogTitle>
    <DialogContent style={{ overflowY: 'visible' }}>
      <Slider
        valueLabelDisplay="auto"
        aria-labelledby="slider-list-label-transparency-amount"
        onChange={(e, value: any) => setTransparecnyAmount(100 - value)}
        value={transparencyAmount}
        max={100}
      />
    </DialogContent>
    <DialogActions>
      <Button variant="outlined" onClick={onClose} color="primary">
        Ok
      </Button>
    </DialogActions>
  </Dialog>
);

TransparencyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  transparencyAmount: PropTypes.number.isRequired,
  setTransparecnyAmount: PropTypes.func.isRequired,
};

function SettingsDialog({
  settings,
  setTransparecnyAmount,
  toggleSettingsModal,
  toggleTransparency,
}: any) {
  const classes = useStyles();
  const [transparencyDialogOpen, setTransparencyDialogOpen] = useState(false);

  const transparencyAmount = 100 - settings.transparencyAmount;

  console.log(settings)

  return (
    <Dialog classes={{ paper: classes.paper }} open={settings.showModal}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <form className={classes.form}>
          <List className={classes.root}>
            <ListItem>
              <ListItemText
                id="switch-list-label-tranparent-mode"
                primary="Transparent Mode"
                secondary={settings.transparentMode ? 'On' : 'Off'}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  onChange={(value) => toggleTransparency(value)}
                  checked={settings.transparentMode}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-tranparent-mode',
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button onClick={() => setTransparencyDialogOpen(true)}>
              <ListItemText
                id="slider-list-label-transparency-amount"
                primary="Transparancy Amount"
                secondary={`${transparencyAmount}%`}
              />
            </ListItem>
          </List>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleSettingsModal} color="primary">
          Done
        </Button>
      </DialogActions>
      <TransparencyDialog
        open={transparencyDialogOpen}
        onClose={() => setTransparencyDialogOpen(false)}
        setTransparecnyAmount={setTransparecnyAmount}
        transparencyAmount={transparencyAmount}
      />
    </Dialog>
  );
}

SettingsDialog.propTypes = {
  settings: settingsPropType.isRequired,
  toggleSettingsModal: PropTypes.func.isRequired,
  setTransparecnyAmount: PropTypes.func.isRequired,
  toggleTransparency: PropTypes.func.isRequired,
};

const mapStateToProps = ({ settings }: any) => ({ settings });

const mapDispatchToProps = {
  toggleSettingsModal: toggleSettingsModalAction,
  setTransparecnyAmount: setTransparecnyAmountAction,
  toggleTransparency: toggleTransparencyAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog);
