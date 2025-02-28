const audioPlayer = document.getElementById("audioPlayer");
const musicDuration = document.querySelector(".duration");
const playButton = document.getElementById("playBtn");
const pause = document.getElementById("pause");
const play = document.getElementById("play");
const progressBar = document.querySelector(".colored-bar");
const circleIndicator = document.querySelector(".circle");

document.querySelector(".cd-img-container");

let currentTime = 0;
let isPlaying = false;
let rotationAngle = 0;

let minutes = 0;
let seconds = 0;
let countdownInterval;
progress = 0;
progressBar.style.width = `${progress}%`;

progressBar.max = audioPlayer.duration;


const formatTime = (time) =>{
  let min = Math.floor(time / 60);
  if (min< 10){
    min =`0${min}`;
  }
  let sec = Math.floor(time / 60);
  if (sec< 10){
    sec =`0${sec}`;
  }
  return `${min}:${sec}`;
}
    musicDuration.innerHTML = formatTime(audioPlayer.duration);

function updateProgressBar() {
  if (isPlaying) {
    currentTime = audioPlayer.currentTime;
    
    
 
    const progress = (currentTime / songDuration) * 100;
    progressBar.style.width = `${progress}%`;

    if (currentTime >= songDuration) {
      currentTime = 0;
      isPlaying = false;
      circleIndicator.style.display = "block";
      audioPlayer.pause();
      clearInterval(countdownInterval); // Stop the countdown when the audio finishes
    }
  }
  
  requestAnimationFrame(updateProgressBar);
}

play.style.display = "block";
pause.style.display = "none";
audioPlayer.style.display = "none";

playButton.addEventListener("click", () => {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    play.style.display = "block";
    pause.style.display = "none";
    circleIndicator.style.display = "none";
    clearInterval(countdownInterval); // Stop the countdown when the audio is paused
    pauseAnimation();
  } else {
    audioPlayer.play();
    isPlaying = true;
    play.style.display = "none";
    pause.style.display = "block";
    circleIndicator.style.display = "block";

    resumeAnimation();

    // Start the countdown
    countdownInterval = setInterval(function () {
      seconds++;

      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }

      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");

      document.getElementById("count").innerHTML =
        formattedMinutes + ":" + formattedSeconds;

      if (minutes === 3 && seconds === 35) {
        clearInterval(countdownInterval);
        document.getElementById("count").innerHTML = "03:35";
        play.style.display = "block";
        pause.style.display = "none";
      }
    }, 1000);
  }
});

updateProgressBar();

function pauseAnimation() {
  isPlaying = false;
}

function resumeAnimation() {
  isPlaying = true;
}

function animateObject() {
  if (isPlaying) {
    rotationAngle += 2;
    animatedObject.style.transform = `rotate(${rotationAngle}deg)`;
  }

  requestAnimationFrame(animateObject);
}

animateObject();

const fetchLyrics = async () => {
  const options = {
     method: 'GET',
  url: 'https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/',
  params: {id: '2396871'},
  headers: {
    'x-rapidapi-key': '28f8ba6447msh10358295f257a1dp13a4ecjsn9010bbcfa35c',
    'x-rapidapi-host': 'genius-song-lyrics1.p.rapidapi.com'
  },
  };

  try {
    const response = await axios.request(options);
    const lyrics = response.data.lyrics.lyrics.body.html;
    displayLyrics(lyrics);
  } catch (error) {
    console.error(error);
  }
};

fetchLyrics();

// spotify
const fetchSpotify = async () => {
  const options = {
    method: "GET",
    url: "https://spotify23.p.rapidapi.com/search/?type=multi&offset=0&limit=10&numberOfTopResults=5",
    params: {
      q: "alan walker,the weeknd",
      type: "multi",
      offset: "0",
      limit: "5",
      numberOfTopResults: "10",
    },
     headers: {
    'x-rapidapi-key': '28f8ba6447msh10358295f257a1dp13a4ecjsn9010bbcfa35c',
    'x-rapidapi-host': 'spotify23.p.rapidapi.com'
  },
  };
  try {
    const response = await axios.request(options);
    // console.log(response.data);
    displayAlbums(response.data.albums);
    displayArtist(response.data.artists);
  } catch (error) {
    console.error(error);
  }
};
fetchSpotify();

const lyricsBtn = document.getElementById("lyricsBtn");
const albumsBtn = document.getElementById("albumsBtn");
const artistBtn = document.getElementById("artistBtn");
const lyricsContainer = document.getElementById("lyricsContainer");
const albumContainer = document.getElementById("albumContainer");
const artistContainer = document.getElementById("artistContainer");

lyricsBtn.addEventListener("click", (e) => {
  e.target.classList.add("active");
  albumsBtn.classList.remove("active");
  artistBtn.classList.remove("active");

  lyricsContainer.style = "display:flex;";
  albumContainer.style = "display:none;";
  artistContainer.style = "display:none;";
});

albumsBtn.addEventListener("click", (e) => {
  lyricsBtn.classList.remove("active");
  e.target.classList.add("active");
  artistBtn.classList.remove("active");

  lyricsContainer.style = "display:none;";
  albumContainer.style = "display:flex;";
  artistContainer.style = "display:none;";
});

artistBtn.addEventListener("click", (e) => {
  lyricsBtn.classList.remove("active");
  albumsBtn.classList.remove("active");
  e.target.classList.add("active");

  lyricsContainer.style = "display:none;";
  albumContainer.style = "display:none;";
  artistContainer.style = "display:flex;";
});

// View
const displayLyrics = (lyrics) => {
  document.getElementById("lyricsContainer").innerHTML = lyrics;
};

const displayAlbums = (album) => {
  album.items.map((item) => {
    const container = document.createElement("div");
    container.classList.add("album-boxes");
    const anchor = document.createElement("a");
    anchor.setAttribute("href", item.data.artists.items[0].uri);
    anchor.classList.add("img-container");
    const image = document.createElement("img");
    image.setAttribute("src", item.data.coverArt.sources[0].url);
    const parOne = document.createElement("p");
    parOne.classList.add("song-name");
    parOne.innerText = item.data.name;
    const parTwo = document.createElement("p");
    parTwo.classList.add("album-year");
    parTwo.innerText = item.data.date.year;

    container.appendChild(anchor);
    anchor.appendChild(image);
    container.appendChild(parOne);
    container.appendChild(parTwo);
    document.getElementById("albumContainer").appendChild(container);
  });
};

const displayArtist = (artist) => {
  artist.items.map((item) => {
    const container = document.createElement("div");
    container.classList.add("artist-boxes");
    const anchor = document.createElement("a");
    anchor.setAttribute("href", item.data.uri);
    anchor.classList.add("img-container");
    const image = document.createElement("img");
    image.setAttribute("src", item.data.visuals.avatarImage.sources[0].url);
    const parOne = document.createElement("p");
    parOne.classList.add("artist-name");
    parOne.innerText = item.data.profile.name;

    container.appendChild(anchor);
    anchor.appendChild(image);
    container.appendChild(parOne);
    document.getElementById("artistContainer").appendChild(container);
  });
};
