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
  const body = document.body;
  const lavaballs = document.getElementsByClassName('particle');

  element.style.border = `5px solid ${statusColors[status] || statusColors.offline}`;

  if (data.listening_to_spotify) {
    song.textContent = spotify.song || 'No Song Detected... ' + status.toUpperCase();
    artistalbum.textContent = spotify.artist ? `${spotify.artist} - ${spotify.album}` : 'No Artist - No Album';
    albumart.src = spotify.album_art_url;

    // Get the most and less abundant colors from the album art
    getDominantColors(albumart.src, (mostAbundantColors, lessAbundantColors) => {
      const mostAbundantColor1 = `rgb(${mostAbundantColors[0][0]}, ${mostAbundantColors[0][1]}, ${mostAbundantColors[0][2]})`;
      const mostAbundantColor2 = `rgb(${mostAbundantColors[1][0]}, ${mostAbundantColors[1][1]}, ${mostAbundantColors[1][2]})`;
      const mostAbundantColor3 = `rgb(${mostAbundantColors[2][0]}, ${mostAbundantColors[2][1]}, ${mostAbundantColors[2][2]})`;

      const lessAbundantColor1 = `rgb(${lessAbundantColors[0][0]}, ${lessAbundantColors[0][1]}, ${lessAbundantColors[0][2]})`;
      const lessAbundantColor2 = `rgb(${lessAbundantColors[1][0]}, ${lessAbundantColors[1][1]}, ${lessAbundantColors[1][2]})`;
      const lessAbundantColor3 = `rgb(${lessAbundantColors[2][0]}, ${lessAbundantColors[2][1]}, ${lessAbundantColors[2][2]})`;

      // Set background colors based on the extracted colors
      setGradientColors(body, [mostAbundantColor1, mostAbundantColor2, mostAbundantColor3]);

      // Set lavaball colors based on less abundant colors
      for (let i = 0; i < lavaballs.length; i++) {
        setGradientColors(lavaballs[i], [lessAbundantColor1, lessAbundantColor2, lessAbundantColor3]);
      }
    });

    albumart.style.boxShadow = '2px 2px 20px black';
  } else {
    // Set default background if no album art
    setGradientColors(lavaballs, ['black', 'gray', 'white']);
    setGradientColors(body, ['rgba(16, 18, 27, 0.4)', 'rgba(16, 18, 27, 0.4)']);
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

function setGradientColors(element, colors) {
  element.style.background = `linear-gradient(to top right, ${colors.join(', ')})`;
}

async function getAverageColor(img, factor) {
  try {
    const { width, height } = img;
    const resizeWidth = Math.floor(width * factor);
    const resizeHeight = Math.floor(height * factor);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = resizeWidth;
    canvas.height = resizeHeight;
    context.drawImage(img, 0, 0, resizeWidth, resizeHeight);

    const imageData = context.getImageData(0, 0, resizeWidth, resizeHeight).data;
    let sumR = 0, sumG = 0, sumB = 0;

    for (let i = 0; i < imageData.length; i += 4) {
      sumR += imageData[i];
      sumG += imageData[i + 1];
      sumB += imageData[i + 2];
    }

    const averageR = Math.round(sumR / (imageData.length / 4));
    const averageG = Math.round(sumG / (imageData.length / 4));
    const averageB = Math.round(sumB / (imageData.length / 4));

    return `rgb(${averageR}, ${averageG}, ${averageB})`;
  } catch (error) {
    console.error('Error getting average color:', error);
  }
}

function getLighterColor(color, factor) {
  const [r, g, b] = color
    .replace(/[^\d,]/g, '')
    .split(',')
    .map(val => parseInt(val));

  const adjustedR = Math.round(r + (255 - r) * factor);
  const adjustedG = Math.round(g + (255 - g) * factor);
  const adjustedB = Math.round(b + (255 - b) * factor);

  return `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
}

async function getDominantColors(imageSrc, callback) {
  try {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;

    img.onload = function () {
      const colorThief = new ColorThief();
      const mostAbundantColors = colorThief.getPalette(img, 5); // Increase the number of colors for most abundant set
      const lessAbundantColors = colorThief.getPalette(img, 15); // Increase the number of colors for less abundant set

      callback(mostAbundantColors, lessAbundantColors);
    };
  } catch (error) {
    console.error('Error getting dominant colors:', error);
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
