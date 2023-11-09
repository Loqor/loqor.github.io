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
    offline: 'rgba(16, 18, 27, 0.4)',
  };

  const status = data.discord_status;
  const spotify = data.spotify;
  const element = document.getElementById('pfp');
  const song = document.getElementById('spotifysong');
  const artistalbum = document.getElementById('spotifyartistalbum');
  const albumart = document.getElementById('albumart');

  element.style.border = `5px solid ${statusColors[status] || statusColors.offline}`;

  if (data.listening_to_spotify) {
    song.textContent = spotify.song || 'No Song Detected... ' + status.toUpperCase();
    artistalbum.textContent = spotify.artist ? `${spotify.artist} - ${spotify.album}` : 'No Artist - No Album';
    albumart.src = spotify.album_art_url || './img/spotify.png';
    albumart.style.boxShadow = '2px 2px 20px black';
  } else {
    song.textContent = 'No Song Detected... ' + status.toUpperCase();
    artistalbum.textContent = 'No Artist - No Album';
    albumart.src = './img/spotify.png';
    albumart.style.boxShadow = 'none';
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

document.addEventListener('DOMContentLoaded', function () {
  const buttonelement = document.getElementById('albumart');
  const song = document.getElementById('spotifysong');
  buttonelement.addEventListener('click', () => {
    if (previousData && previousData.spotify && previousData.spotify.track_id) {
      window.location.href = 'https://open.spotify.com/track/' + previousData.spotify.track_id;
    }
  });
  song.addEventListener('click', () => {
    fetchDiscordData();
  });

  window.addEventListener('beforeunload', () => {
    clearCustomInterval();
  });
  
  window.addEventListener('load', () => {
    startInterval();
    fetchDiscordData();
  });
});