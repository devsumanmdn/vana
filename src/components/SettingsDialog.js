import React, { useState } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/styles/makeStyles';
import { connect } from 'react-redux';

import {
  Dialog,
  Button,
  Slider,
  Switch,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core';

import {
  toggleSettingsModal as toggleSettingsModalAction,
  setTransparecnyAmount as setTransparecnyAmountAction,
  toggleTransparency as toggleTransparencyAction
} from '../redux/settings/settingsActions';
import { settingsPropType } from '../redux/settings/settingsReducer';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',

    '& > div': {
      marginTop: 20
    }
  },
  paper: {
    minWidth: 300
  }
});

const TransparencyDialog = ({
  open,
  onClose,
  transparencyAmount,
  setTransparecnyAmount
}) => (
  <Dialog open={open}>
    <DialogTitle>Transparancy Amount</DialogTitle>
    <DialogContent style={{ overflowY: 'visible' }}>
      <Slider
        valueLabelDisplay="auto"
        aria-labelledby="slider-list-label-transparency-amount"
        onChange={(e, value) => setTransparecnyAmount(100 - value)}
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
  setTransparecnyAmount: PropTypes.func.isRequired
};

function SettingsDialog({
  settings,
  setTransparecnyAmount,
  toggleSettingsModal,
  toggleTransparency
}) {
  const classes = useStyles();
  const [transparencyDialogOpen, setTransparencyDialogOpen] = useState(false);

  const transparencyAmount = 100 - settings.transparencyAmount;

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
                  onChange={value => toggleTransparency(value)}
                  checked={settings.transparentMode}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-tranparent-mode'
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
  toggleTransparency: PropTypes.func.isRequired
};

const mapStateToProps = ({ settings }) => ({ settings });

const mapDispatchToProps = {
  toggleSettingsModal: toggleSettingsModalAction,
  setTransparecnyAmount: setTransparecnyAmountAction,
  toggleTransparency: toggleTransparencyAction
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog);
