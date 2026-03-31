const lanyardUrl = 'https://api.lanyard.rest/v1/users/368694479391293442';
let previousData = null;
let intervalId;

function fetchDiscordData() {
  fetch(lanyardUrl)
    .then(response => response.json())
    .then(res => {
      if (isDataChanged(previousData, res.data)) {
        updateUI(res.data);
        previousData = res.data;
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function isDataChanged(previousData, currentData) {
  return JSON.stringify(previousData) !== JSON.stringify(currentData);
}

function updateUI(data) {
  const statusColors = {
    online: '#43b581',
    dnd: '#f04747',
    idle: '#faa61a',
    offline: '#4a4a4a',
  };

  const status = data.discord_status;
  const spotify = data.spotify;
  const profileImage = document.getElementById('realpfp');
  const song = document.getElementById('spotifysong');
  const statusMarker = document.getElementById('statusDesc');
  const artistalbum = document.getElementById('spotifyartistalbum');
  const albumart = document.getElementById('albumart');
  const accentIndicator = document.getElementById('accent-indicator');
  const statusDot = document.querySelector('.status-dot');
  const root = document.documentElement;

  // Update profile border with status color
  if (profileImage) {
    profileImage.style.borderColor = statusColors[status] || statusColors.offline;
  }

  // Update status dot color
  if (statusDot) {
    statusDot.style.background = statusColors[status] || statusColors.offline;
  }

  // Update status text
  if (statusMarker) {
    const statusText = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Offline';
    statusMarker.textContent = statusText;
  }

  if (data.listening_to_spotify && spotify) {
    song.textContent = spotify.song || 'Nothing playing';
    artistalbum.textContent = spotify.artist ? `${spotify.artist} — ${spotify.album}` : '—';
    albumart.src = spotify.album_art_url;

    // Get dominant colors from album art and set CSS custom properties
    getDominantColors(albumart.src, (mostAbundantColors, lessAbundantColors) => {
      const accentPrimary = `rgb(${mostAbundantColors[0][0]}, ${mostAbundantColors[0][1]}, ${mostAbundantColors[0][2]})`;
      const accentSecondary = `rgb(${mostAbundantColors[1][0]}, ${mostAbundantColors[1][1]}, ${mostAbundantColors[1][2]})`;

      // Set CSS custom properties for accent colors
      root.style.setProperty('--accent-primary', accentPrimary);
      root.style.setProperty('--accent-secondary', accentSecondary);

      // Update the accent indicator
      if (accentIndicator) {
        accentIndicator.style.backgroundColor = accentPrimary;
      }
    });
  } else {
    // Reset to default white accent when not playing
    root.style.setProperty('--accent-primary', '#ffffff');
    root.style.setProperty('--accent-secondary', '#888888');

    if (accentIndicator) {
      accentIndicator.style.backgroundColor = '#ffffff';
    }

    song.textContent = 'Nothing playing';
    artistalbum.textContent = '—';
    albumart.src = './img/spotify.png';
  }
}

function startInterval() {
  intervalId = setInterval(fetchDiscordData, 10 * 1000);
}

function clearCustomInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

async function getDominantColors(imageSrc, callback) {
  try {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;

    img.onload = function () {
      const colorThief = new ColorThief();
      const mostAbundantColors = colorThief.getPalette(img, 5);
      const lessAbundantColors = colorThief.getPalette(img, 15);

      callback(mostAbundantColors, lessAbundantColors);
    };
  } catch (error) {
    console.error('Error getting dominant colors:', error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Clear any lingering inline background styles to let CSS take over
  document.body.style.background = '';

  const albumArtElement = document.getElementById('albumart');
  const songElement = document.getElementById('spotifysong');

  if (albumArtElement) {
    albumArtElement.addEventListener('click', () => {
      if (previousData && previousData.spotify && previousData.spotify.track_id) {
        window.open('https://open.spotify.com/track/' + previousData.spotify.track_id, '_blank');
      }
    });
  }

  if (songElement) {
    songElement.addEventListener('click', () => {
      fetchDiscordData();
    });
  }

  window.addEventListener('beforeunload', () => {
    clearCustomInterval();
  });

  window.addEventListener('load', () => {
    startInterval();
    fetchDiscordData();
  });
});
