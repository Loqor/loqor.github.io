const lanyardUrl = 'https://api.lanyard.rest/v1/users/368694479391293442';
let previousData = null; // Store the previous data
let intervalId; // Store the interval ID

function fetchDiscordData() {
  fetch(lanyardUrl)
    .then(response => response.json())
    .then(res => {
      console.log(res.data);
      if (isDataChanged(previousData, res.data)) {
        // Data has changed, update the UI
        updateUI(res.data);
        previousData = res.data; // Update the previous data
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function isDataChanged(previousData, currentData) {
  // Implement your logic to compare data and return true if it has changed
  return JSON.stringify(previousData) !== JSON.stringify(currentData);
}

function updateUI(data) {
  // Update the UI based on the new data
  const status = data.discord_status;
  const spotify = data.spotify;
  const element = document.getElementById('pfp');
  const song = document.getElementById('spotifysong');
  const artistalbum = document.getElementById('spotifyartistalbum');
  const albumart = document.getElementById('albumart');

  if (status == 'online') {
    const onl = '5px solid #43b581';
    element.style.border = onl;
  } else if (status == 'dnd') {
    const dnd = '5px solid #f04747';
    element.style.border = dnd;
  } else if (status == 'idle') {
    const idl = '5px solid #faa61a';
    element.style.border = idl;
  } else if (status == 'offline') {
    const ofl = '5px solid rgba(16 18 27 / 40%)';
    element.style.border = ofl;
  }

  if (data.listening_to_spotify) {
    song.textContent = spotify.song;
    artistalbum.textContent = spotify.artist + ' - ' + spotify.album;
    albumart.src = spotify.album_art_url;
    albumart.style.boxShadow = '2px 2px 20px black';
  } else {
    song.textContent = 'No Music Here; ' + status.toUpperCase();
    artistalbum.textContent = '';
    albumart.src = './img/spotify.png';
    albumart.style.boxShadow = 'none';
  }
}

function startInterval() {
  intervalId = setInterval(fetchDiscordData, 10 * 1000);
}

function clearInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

window.addEventListener('beforeunload', () => {
  clearInterval();
});

window.addEventListener('load', () => {
  startInterval();
  fetchDiscordData();
});

document.addEventListener('DOMContentLoaded', function () {
  const buttonelement = document.getElementById('albumart');
  const refreshdataelement = document.getElementById('spotifysong');
  buttonelement.addEventListener('click', () => {
    window.location.href = 'https://open.spotify.com/track/' + previousData.spotify.track_id;
  });
  refreshdataelement.addEventListener('click', () => {
    fetchDiscordData();
  });
});
