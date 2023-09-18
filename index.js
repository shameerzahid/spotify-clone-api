$(document).ready(async function () {
  $("#image-slider").carousel(); // Initialize the carousel

  // Get all like buttons with the "like-button" class
  const likeButtons = document.querySelectorAll(".like-button");

  // Initialize the liked state for each button based on localStorage
  likeButtons.forEach(function (likeButton) {
    let liked = false;
    const likedState = localStorage.getItem(`likedState-${likeButton.id}`);

    if (likedState === "liked") {
      liked = true;
      likeButton.querySelector("i").style.color = "#ff6b6b"; // Change heart color to red
    }

    // Add a click event listener to toggle the heart color and update localStorage
    likeButton.addEventListener("click", function () {
      liked = !liked;

      if (liked) {
        likeButton.querySelector("i").style.color = "#ff6b6b"; // Change heart color to red
        localStorage.setItem(`likedState-${likeButton.id}`, "liked");
      } else {
        likeButton.querySelector("i").style.color = ""; // Reset heart color to default
        localStorage.setItem(`likedState-${likeButton.id}`, "unliked");
      }
    });
  });

  // Fetch the Spotify album covers and update the HTML
  const albumCoverElements = document.querySelectorAll(".album-cover");

  function getRandomAlbumCover(trendingTracks) {
    const randomIndex = Math.floor(Math.random() * trendingTracks.length);
    return trendingTracks[randomIndex].album_cover_url;
  }

  let currentAudio = null; // To keep track of the currently playing audio element

  // Get the previous and next buttons
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const prevButton2 = document.getElementById("prevButton2");
  const nextButton2 = document.getElementById("nextButton2");
  const prevButton3 = document.getElementById("prevButton3");
  const nextButton3 = document.getElementById("nextButton3");

  // Get the scrollable content element
  const scrollableContent = document.getElementById("playlist1Songs");
  const scrollableContent2 = document.getElementById("playlist2Songs");
  const scrollableContent3 = document.getElementById("playlist4Songs");

  // Calculate the scroll width for each scroll action
  const scrollWidth = 300; // You can adjust this value as needed

  // Initialize the current scroll position
  let scrollPosition = 0;

  // Function to scroll to the left
  function scrollLeft() {
    scrollPosition -= scrollWidth;
    if (scrollPosition < 0) {
      scrollPosition = 0;
    }
    scrollableContent.scrollLeft = scrollPosition;
  }

  function scrollLeft2() {
    scrollPosition -= scrollWidth;
    if (scrollPosition < 0) {
      scrollPosition = 0;
    }
    scrollableContent2.scrollLeft = scrollPosition;
  }

  function scrollLeft3() {
    scrollPosition -= scrollWidth;
    if (scrollPosition < 0) {
      scrollPosition = 0;
    }
    scrollableContent3.scrollLeft = scrollPosition;
  }

  // Function to scroll to the right
  function scrollRight() {
    scrollPosition += scrollWidth;
    if (
      scrollPosition >
      scrollableContent.scrollWidth - scrollableContent.clientWidth
    ) {
      scrollPosition =
        scrollableContent.scrollWidth - scrollableContent.clientWidth;
    }
    scrollableContent.scrollLeft = scrollPosition;
  }

  function scrollRight2() {
    scrollPosition += scrollWidth;
    if (
      scrollPosition >
      scrollableContent.scrollWidth - scrollableContent.clientWidth
    ) {
      scrollPosition =
        scrollableContent.scrollWidth - scrollableContent.clientWidth;
    }
    scrollableContent2.scrollLeft = scrollPosition;
  }
  function scrollRight3() {
    scrollPosition += scrollWidth;
    if (
      scrollPosition >
      scrollableContent.scrollWidth - scrollableContent.clientWidth
    ) {
      scrollPosition =
        scrollableContent.scrollWidth - scrollableContent.clientWidth;
    }
    scrollableContent3.scrollLeft = scrollPosition;
  }

  // Add click event listeners to the previous and next buttons
  prevButton.addEventListener("click", scrollLeft);
  nextButton.addEventListener("click", scrollRight);
  prevButton2.addEventListener("click", scrollLeft2);
  nextButton2.addEventListener("click", scrollRight2);
  prevButton3.addEventListener("click", scrollLeft3);
  nextButton3.addEventListener("click", scrollRight3);
  const fetchPlaylistTracks = async (playlistId, heading) => {
    try {
      const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials&client_id=280fc23c92cf4f1790e82a6188ce1da3&client_secret=a7b24e3dda754c2c82dce2a14d52de26",
        }
      );

      if (!tokenResponse.ok) {
        throw new Error("Failed to fetch token");
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.access_token;

      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tracks");
      }

      const jsonData = await response.json();
      return { items: jsonData.items, heading };
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const displayTracksthumbnail = ({ items, heading }) => {
    if (items.length === 0) {
      errorMessage.textContent = `No tracks found for ${heading}`;
    } else {
      // Use slice to get the first 4 tracks
      const firstFourTracks = items.slice(0, 4);

      firstFourTracks.forEach((trackItem) => {
        const track = trackItem.track;

        if (track.preview_url) {
          const trendingTracksList = document.getElementById("slides");
          const listItem = document.createElement("li");
          listItem.className = "album-1";

          function formatDuration(durationMs) {
            const totalSeconds = Math.floor(durationMs / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            const formattedMinutes = minutes.toString().padStart(2, "0");
            const formattedSeconds = seconds.toString().padStart(2, "0");

            return `${formattedMinutes}:${formattedSeconds}`;
          }

          // Split the song name into words and take the first four words
          const words = track.name.split(" ");
          const firstFourWords = words.slice(0, 4).join(" ");

          const listItemContent = `
         <div class="carousel-item active">
        <img class="d-block w-40 image-thumb" src="${track.album.images[0].url}" width='48px' />
        <div class="divtext">
        <h3 class="featured">FEATURED SONG</h3>
       
        <p class="artist-name">${track.artists[0].name}</p>
         <p class="song-name">${firstFourWords}</p> </div>
        <div class="carousel-caption">
          <button class="slider-btn" id="playButton${track.id}"  data-state="paused" data-track-id="${track.id}" class="btn">Play
          </button>
          <audio id="${track.id}" class="audio-player" src="${track.preview_url}"></audio> 
        </div>  
      </div>
    `;

          listItem.innerHTML = listItemContent;
          trendingTracksList.appendChild(listItem);

          const audioPlayer = listItem.querySelector(".audio-player");
          const playButton = listItem.querySelector(`#playButton${track.id}`);

          playButton.addEventListener("click", () => {
            if (audioPlayer.paused) {
              audioPlayer.play();
              playButton.textContent = "Pause";
            } else {
              audioPlayer.pause();
              playButton.textContent = "Play";
            }

            if (currentAudio && currentAudio !== audioPlayer) {
              currentAudio.pause();
            }
            currentAudio = audioPlayer;
          });
        }
      });
    }
  };

  function displayTracks({ items, heading }) {
    const trendingTracksList = document.getElementById("trending");
    trendingTracksList.innerHTML = ""; // Clear previous content

    if (items.length === 0) {
      errorMessage.textContent = `No tracks found for ${heading}`;
    } else {
      items.slice(0, 4).forEach((trackItem) => {
        const track = trackItem.track;

        if (track.preview_url) {
          function formatDuration(durationMs) {
            const totalSeconds = Math.floor(durationMs / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            const formattedMinutes = minutes.toString().padStart(2, "0");
            const formattedSeconds = seconds.toString().padStart(2, "0");

            return `${formattedMinutes}:${formattedSeconds}`;
          }

          // Split the song name into words and take the first four words
          const words = track.name.split(" ");
          const firstFourWords = words.slice(0, 4).join(" ");

          const listItem = document.createElement("li");
          listItem.className = "album-1";

          const listItemContent = `
          <img src="${track.album.images[0].url}" width='48px' />
          <h5 class="doja-title">${firstFourWords}</h5>
          <p class="trending-artist">${track.artists[0].name}</p>
          <p class="duration">${formatDuration(track.duration_ms)}</p>
          <button id="playButton${track.id}" data-state="paused" class="btn">
            <i class='bx bx-play-circle play-btn' style="font-size: 2em;"></i> 
          </button>
          <audio id="${track.id}" class="audio-player" src="${
            track.preview_url
          }"></audio> 
        `;

          listItem.innerHTML = listItemContent;
          trendingTracksList.appendChild(listItem);

          const audioPlayer = listItem.querySelector(".audio-player");
          const playButton = listItem.querySelector(`#playButton${track.id}`);

          playButton.addEventListener("click", () => {
            if (audioPlayer.paused) {
              audioPlayer.play();
              playButton.innerHTML =
                '<i class="bx bx-pause-circle pause-btn" style="font-size: 2em;"></i>';
            } else {
              audioPlayer.pause();
              playButton.innerHTML =
                '<i class="bx bx-play-circle play-btn" style="font-size: 2em;"></i>';
            }

            if (currentAudio && currentAudio !== audioPlayer) {
              currentAudio.pause();
            }
            currentAudio = audioPlayer;
          });

          audioPlayer.addEventListener("play", () => {
            if (currentAudio && currentAudio !== audioPlayer) {
              currentAudio.pause();
              const currentPlayButton = document.querySelector(
                `#playButton${currentAudio.id}`
              );
              currentPlayButton.innerHTML =
                '<i class="bx bx-play-circle play-btn" style="font-size: 2em;"></i>';
            }
            currentAudio = audioPlayer;
          });
        }
      });
    }
  }

  const displayTracksInScrollableRow = ({ items, heading }) => {
    const scrollableRow = document.getElementById("playlist1Songs");
    scrollableRow.innerHTML = ""; // Clear previous content

    if (items.length === 0) {
      errorMessage.textContent = `No tracks found for ${heading}`;
    } else {
      items.forEach((trackItem) => {
        const track = trackItem.track;

        if (track.preview_url) {
          const listItem = document.createElement("div");
          listItem.className = "scrollable-item";

          // Split the song name into words and take the first four words
          const words = track.name.split(" ");
          const firstFourWords = words.slice(0, 4).join(" ");

          const listItemContent = `
          <div class="scrollable-item-inner">
            <img src="${track.album.images[0].url}" class="album-image"/>
            <div class="album-items">
              <h5 class="album-title">${firstFourWords}</h5>
              <p class="album-artist">${track.artists[0].name} 
                <button id="playButton${track.id}" data-state="paused" onclick="togglePlayPause2('${track.id}', 'Another Song', 'Another Artist')" class="btn">
                  <i class='bx bx-play-circle album-play-btn' style="font-size: 2em;"></i> 
                </button>
                <audio id="${track.id}" class="audio-player" src="${track.preview_url}"></audio>
              </p>
            </div>
          </div>
        `;

          listItem.innerHTML = listItemContent;
          scrollableRow.appendChild(listItem);
        }
      });
    }
  };

  const displayTracksInScrollableRow2 = ({ items, heading }) => {
    const scrollableRow = document.getElementById("playlist2Songs");
    scrollableRow.innerHTML = ""; // Clear previous content

    if (items.length === 0) {
      errorMessage.textContent = `No tracks found for ${heading}`;
    } else {
      items.forEach((trackItem) => {
        const track = trackItem.track;

        if (track.preview_url) {
          const listItem = document.createElement("div");
          listItem.className = "scrollable-item";

          // Split the song name into words and take the first four words
          const words = track.name.split(" ");
          const firstFourWords = words.slice(0, 4).join(" ");

          const listItemContent = `
          <div class="scrollable-item-inner">
            <img src="${track.album.images[0].url}" class="album-image"/>
            <div class="album-items">
              <h5 class="album-title">${firstFourWords}</h5>
              <p class="album-artist">${track.artists[0].name} 
                <button id="playButton${track.id}" data-state="paused" onclick="togglePlayPause2('${track.id}', 'Another Song', 'Another Artist')" class="btn">
                  <i class='bx bx-play-circle album-play-btn' style="font-size: 2em;"></i> 
                </button>
                <audio id="${track.id}" class="audio-player" src="${track.preview_url}"></audio>
              </p>
            </div>
          </div>
        `;

          listItem.innerHTML = listItemContent;
          scrollableRow.appendChild(listItem);
        }
      });
    }
  };
  const displayTracksInScrollableRow3 = ({ items, heading }) => {
    const scrollableRow = document.getElementById("playlist4Songs");
    scrollableRow.innerHTML = ""; // Clear previous content

    if (items.length === 0) {
      errorMessage.textContent = `No tracks found for ${heading}`;
    } else {
      items.forEach((trackItem) => {
        const track = trackItem.track;

        if (track.preview_url) {
          const listItem = document.createElement("div");
          listItem.className = "scrollable-item";

          // Split the song name into words and take the first four words
          const words = track.name.split(" ");
          const firstFourWords = words.slice(0, 4).join(" ");

          const listItemContent = `
          <div class="scrollable-item-inner">
            <img src="${track.album.images[0].url}" class="album-image"/>
            <div class="album-items">
              <h5 class="album-title">${firstFourWords}</h5>
              <p class="album-artist">${track.artists[0].name} 
                <button id="playButton${track.id}" data-state="paused" onclick="togglePlayPause2('${track.id}', 'Another Song', 'Another Artist')" class="btn">
                  <i class='bx bx-play-circle album-play-btn' style="font-size: 2em;"></i> 
                </button>
                <audio id="${track.id}" class="audio-player" src="${track.preview_url}"></audio>
              </p>
            </div>
          </div>
        `;

          listItem.innerHTML = listItemContent;
          scrollableRow.appendChild(listItem);
        }
      });
    }
  };
  const fetchMultiplePlaylists = async () => {
    const playlistData = [
      {
        playlistId: "37i9dQZF1DWXRqgorJj26U",
        heading: "Playlist 0 Songs",
      },
      {
        playlistId: "37i9dQZF1DXcBWIGoYBM5M",
        heading: "Playlist 1 Songs",
      },
      {
        playlistId: "37i9dQZF1DX4JAvHpjipBk",
        heading: "Playlist 2 Songs",
      },
      {
        playlistId: "37i9dQZF1DX3rxVfibe1L0",
        heading: "Playlist 3 Songs",
      },
      {
        playlistId: "37i9dQZF1DX0XUsuxWHRQd",
        heading: "Playlist 4 Songs",
      },
      // Add more playlists with headings here
    ];

    for (const data of playlistData) {
      const tracks = await fetchPlaylistTracks(data.playlistId, data.heading);
      if (data.heading === "Playlist 0 Songs") {
        displayTracksthumbnail(tracks);
      } else if (data.heading === "Playlist 1 Songs") {
        displayTracksInScrollableRow(tracks);
      } else if (data.heading === "Playlist 2 Songs") {
        displayTracksInScrollableRow2(tracks);
      } else if (data.heading === "Playlist 4 Songs") {
        displayTracksInScrollableRow3(tracks);
      } else {
        displayTracks(tracks);
      }
    }
  };

  fetchMultiplePlaylists();
});

// Initialize a variable to keep track of music player visibility
let musicPlayerVisible = false;

// Variables to store song title and artist name
let currentSongTitle = "";
let currentArtistName = "";

// ...

function togglePlayPause(audioId, songTitle, artistName) {
  const audio = document.getElementById(audioId);
  const playButton = document.getElementById(`playButton${audioId}`);
  const musicPlayer = document.getElementById("musicPlayer");
  console.log(playButton);

  if (audio.paused) {
    audio.play();
    playButton.innerHTML =
      '<i class="bx bx-pause-circle pause-btn" style="font-size: 2em;"></i>';
    playButton.dataset.state = "playing";

    // Show the music player if it's not visible
    if (!musicPlayerVisible) {
      musicPlayer.style.display = "block";
      musicPlayerVisible = true;
    }

    // Update the music player's display with song title and artist name
    const playerTitle = document.querySelector(".player-title");
    const playerArtist = document.querySelector(".player-artist");
    playerTitle.textContent = currentSongTitle = songTitle;
    playerArtist.textContent = currentArtistName = artistName;
  } else {
    audio.pause();
    playButton.innerHTML =
      '<i class="bx bx-play-circle play-btn" style="font-size: 2em;"></i>';
    playButton.dataset.state = "paused";
  }
}

function togglePlayPause2(audioId, songTitle, artistName) {
  const audio = document.getElementById(audioId);
  const playButton = document.getElementById(`playButton${audioId}`);
  const musicPlayer = document.getElementById("musicPlayer");

  if (audio.paused) {
    audio.play();
    playButton.innerHTML =
      '<i class="bx bx-pause-circle album-pause-btn" style="font-size: 2em;"></i>';
    playButton.dataset.state = "playing";

    // Show the music player if it's not visible
    if (!musicPlayerVisible) {
      musicPlayer.style.display = "block";
      musicPlayerVisible = true;
    }

    // Update the music player's display with song title and artist name
    const playerTitle = document.querySelector(".player-title");
    const playerArtist = document.querySelector(".player-artist");
    playerTitle.textContent = currentSongTitle = songTitle;
    playerArtist.textContent = currentArtistName = artistName;
  } else {
    audio.pause();
    playButton.innerHTML =
      '<i class="bx bx-play-circle album-play-btn" style="font-size: 2em;"></i>';
    playButton.dataset.state = "paused";
  }
}
// ...

// Add event listeners to your play buttons
const playButtons = document.querySelectorAll(".play-button");
playButtons.forEach(function (playButton) {
  const audioId = playButton.dataset.audioId;
  const songTitle = playButton.dataset.songTitle;
  const artistName = playButton.dataset.artistName;
  playButton.addEventListener("click", function () {
    togglePlayPause(audioId, songTitle, artistName);
  });
});
