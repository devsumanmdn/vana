import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/styles/withStyles';
import { FixedSizeList as List, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { connect } from 'react-redux';

import SongListItem from './SongListItem';

const styles = {
  root: {
    flexGrow: 1,
    overflow: 'auto hidden',
    overflowY: 'hidden',
    padding: '0 0 0 40px',
  },

  title: {
    fontSize: 18,
    padding: '0px 20px',
  },
};

const Row = memo(({ data, index, style }) => {
  const metaData = data[index];
  return metaData ? (
    <SongListItem style={style} key={metaData.id} metaData={metaData} />
  ) : null;
}, areEqual);

Row.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.shape().isRequired,
};

const PlayingQueueList = ({ classes, player, songs }) => {
  const [songListWithMeta, setSongListWithMeta] = useState([]);

  const { queue } = player;
  const { all: allSongs } = songs;

  useEffect(() => {
    if (queue?.length) {
      Promise.all(queue.map((songId) => allSongs[songId] || {})).then(
        setSongListWithMeta
      );
    }
  }, [queue, allSongs]);

  if (!songListWithMeta.length) {
    return null;
  }

  return (
    <div className={classes.root}>
      <p className={classes.title}>Now Playing</p>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={songListWithMeta.length}
            itemData={songListWithMeta}
            itemSize={80}
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

PlayingQueueList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  player: PropTypes.shape({
    queue: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  songs: PropTypes.shape({
    all: PropTypes.objectOf(PropTypes.shape({})).isRequired,
  }).isRequired,
};

const mapStateToProps = ({ player, songs }) => ({ player, songs });

export default connect(mapStateToProps)(withStyles(styles)(PlayingQueueList));
