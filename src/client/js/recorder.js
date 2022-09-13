import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async() => {
    // ffmpeg 사용
    const ffmpeg = createFFmpeg({ log:true });
    await ffmpeg.load();
    // ffmpeg 파일 생성
    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
    // recording.webm 파일을 input 으로 받아 mp4로 변환(초당 60프레임)
    await ffmpeg.run("-i","recording.webm","-r","60","output.mp4");

    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "My recording.webm";
    document.body.appendChild(a);
    a.click();
};

const handleStop = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);
    recorder.stop();
};

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

    recorder = new window.MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true ;
        video.play();
    }
    recorder.start();
};

const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        video : { width:400, height:200 }, 
        audio : false,
    });
    video.srcObject = stream;
    video.play();
};

init();

startBtn.addEventListener("click", handleStart);