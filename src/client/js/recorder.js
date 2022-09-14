import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
};
  
  const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
};

const handleDownload = async() => {
    // 다운로드 버튼 클릭 후
    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.innerText = "Transcoding...";
    actionBtn.disabled = true;
    
    // ffmpeg 사용
    const ffmpeg = createFFmpeg({ log:true });
    await ffmpeg.load();
    // ffmpeg 파일 생성
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
    // recording.webm 파일을 input 으로 받아 mp4로 변환(초당 60프레임)
    await ffmpeg.run("-i", files.input, "-r", "60", files.output);
    // recording.webm 파일을 input 으로 받아 00:00:01 시간대의 화면을 캡처해 
    // thumbnail.jpg 파일로 저장(썸네일)
    await ffmpeg.run(
        "-i",
        files.input,
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        files.thumb
    );
    // mp4
    const mp4File = ffmpeg.FS("readFile", files.output);
    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const mp4Url = URL.createObjectURL(mp4Blob);
    
    // thumbnail
    const thumbFile = ffmpeg.FS("readFile", files.thumb);
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
    const thumbUrl = URL.createObjectURL(thumbBlob);
    
    downloadFile(mp4Url,"My recording.mp4");
    downloadFile(thumbUrl,"My Thumbnail.jpg");

    // blob 삭제
    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);

    // URL 해제
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);
    
    // 인코딩 및 다운로드까지 끝난 후
    actionBtn.disabled = false;
    actionBtn.innerText = "Record Again";
    actionBtn.addEventListener("click", handleStart);
};

const handleStart = () => {
    actionBtn.innerText = "Recording";
    actionBtn.disabled = true;
    actionBtn.removeEventListener("click", handleStart);

    recorder = new window.MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true ;
        video.play();

        actionBtn.innerText = "Download";
        actionBtn.disabled = false;
        actionBtn.addEventListener("click", handleDownload);
    }
    recorder.start();
    setTimeout(() => {
        recorder.stop();
    }, 10000);
};

const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        video : { width:1024, height:576 }, 
        audio : true,
    });
    video.srcObject = stream;
    video.play();
};

init();

actionBtn.addEventListener("click", handleStart);