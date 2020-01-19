import * as mm from 'music-metadata';

export default location =>
  mm.parseFile(location).then(info => {
    if (!(info.common && info.common.title)) {
      const filename = location.split('/').slice(-1)[0];
      info.common.title = filename;
    }
    if (!(info.common && info.common.artists)) {
      info.common.artists = 'Unknown';
    }

    const albumArt =
      info && info.common.picture && info.common.picture[0]
        ? info.common.picture[0]
        : false;

    if (albumArt) {
      info.albumArt = `data:image/jpeg;base64,${albumArt.data.toString(
        'base64'
      )}`;
    } else {
      info.albumArt = `https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/compose_music_ovo2.svg`;
    }

    return info;
  });
