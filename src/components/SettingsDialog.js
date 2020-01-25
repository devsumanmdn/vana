import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Dialog,
  Button,
  Slider,
  Switch,
  FormControl,
  FormLabel,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';

import {
  toggleSettingsModal as toggleSettingsModalAction,
  setTransparecnyAmount as setTransparecnyAmountAction,
  toggleTransparency as toggleTransparencyAction
} from '../redux/settings/settingsActions';

function SettingsDialog({
  settings,
  setTransparecnyAmount,
  toggleSettingsModal,
  toggleTransparency
}) {
  return (
    <Dialog open={settings.showModal}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <FormControl>
          <FormLabel>Transparent Mode:</FormLabel>
          <Switch
            value={settings.transparentMode}
            onChange={value => toggleTransparency(value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Transparancy Amount:</FormLabel>
          <Slider
            onChange={(e, value) => setTransparecnyAmount(100 - value)}
            value={100 - settings.transparencyAmount}
            max={100}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleSettingsModal} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SettingsDialog.propTypes = {
  settings: PropTypes.shape({
    showModal: PropTypes.bool.isRequired,
    transparentMode: PropTypes.number.isRequired,
    transparentMode: PropTypes.bool.isRequired
  }).isRequired,
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
