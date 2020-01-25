import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/styles/makeStyles';
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
  DialogActions,
  Box
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
  }
});

function SettingsDialog({
  settings,
  setTransparecnyAmount,
  toggleSettingsModal,
  toggleTransparency
}) {
  const classes = useStyles();
  return (
    <Dialog open={settings.showModal}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <form className={classes.form}>
          <FormControl>
            <Box alignItems="center" display="flex">
              <FormLabel>Transparent Mode:</FormLabel>
              <Switch
                checked={settings.transparentMode}
                onChange={value => toggleTransparency(value)}
              />
            </Box>
          </FormControl>
          <FormControl>
            <FormLabel>Transparancy Amount:</FormLabel>
            <Slider
              onChange={(e, value) => setTransparecnyAmount(100 - value)}
              value={100 - settings.transparencyAmount}
              max={100}
            />
          </FormControl>
        </form>
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
