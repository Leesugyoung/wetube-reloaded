const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumeValue = 0.5;
video.volume = volumeValue;
let videoPlayStatus = false;
let setVideoPlayStatus = false;
let controlsTimeout = null;
let controlsMovementTimeout = null;

const handlePlayClick = (event) => {
    // if the video is playing, pause it
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas- fa-play" : "fas fa-pause";
};

const handleMuteClick = (event) => {
    if(video.muted){
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted 
        ? "fas fa-volume-mute" 
        : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const { 
        target: {value}
    } = event;

    if(video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = Number(value);
    video.volume = value;

    if (volumeValue === 0) {
        video.muted = true;
        muteBtn.innerText = "Unmute";
    }
};

const formatTime = (seconds) => {
    if(seconds >= 3600) {
        return new Date(seconds*1000).toISOString().substring(11, 19);
    } else {
        return new Date(seconds*1000).toISOString().substring(14, 19);
    }
};


const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    const fullscreen = document.fullscreenElement;

    if (fullscreen) {
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
  };

/** 비디오 시간 감지 function */
const handleTimeUpdate = () => {
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
    const {
        target:{value}
    } = event;

    if (!setVideoPlayStatus) {
        videoPlayStatus = video.paused ? false : true;
        setVideoPlayStatus = true;
    }
    video.pause();
    video.currentTime = value;
};
        
const handleTimelineSet = () => {
    // 타임라인 옮기기 전 재생 상태를 유지
    // 재생중이였다면 재생, 일시정지 중이었다면 일시중지 되게
    videoPlayStatus ? video.play() : video.pause();
    setVideoPlayStatus = false;
};

/** 전체 화면 조절 function */
const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen) {
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
};

// let controlsTimeout = null; 
// let controlsMovementTimeout = null;
// 잊지말자

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if(controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMovementTimeout) {
        // controlsMovementTimeout가 timeOut의 id 가 되었을 때
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
timeline.addEventListener("change", handleTimelineSet);
fullScreenBtn.addEventListener("click", handleFullscreen);
