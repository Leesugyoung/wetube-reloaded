# Wetube (Youtube 클론코딩)

프론트부터 백까지 모두 다뤄보고 싶어 Youtube 클론코딩 강의를 보며 제작하였습니다 :)

---

### 🌐 프로젝트 링크

[Wetube 바로가기](https://wetube.fly.dev/)

---

- 언어 : JavaScript(ES6)
- 프론트 : SCSS, PUG
- 백엔드 : NodeJs, MongoDB, Express
- 배포 : AWS S3, Mongo Atlas, Fly.io
- 라이브러리 : npm, WebPack, Mongoose, babel, express-session, multer, FFmpeg 등

---

### ⚙️ 기능 설명

- User
  - 깃헙 openAPI 를 이용한 소셜 로그인 기능
  - 세션을 통한 로그인/ 로그아웃 기능
  - 프로필 수정(사진, 닉네임 등) 기능
- Video
  - 동영상/ 이미지(섬네일) 업로드 기능(AWS S3)
  - 동영상 녹화 및 녹화한 영상 다운로드 & 썸네일 다운로드 기능(FFmpeg)
  - 동영상 조회수 기능
  - 동영상 수정 및 삭제 기능
  - (화면에서 보이는 좋아요, 싫어요는 기능되지 않습니다..🤣)
- 그 외
  - 댓글 추가 및 삭제 기능
  - 영상 제목 검색 기능

---

### 📝 프로젝트 구조

-📂[src]  
➡[client] ➡️ js 　　―　 js 폴더 (videoEvent)  
➡[client] ➡️ scss 　　―　 css 폴더  
➡[controllers]　　―　사용자 요청/응답 처리 폴더  
➡[models]　　―　 DB model 폴더  
➡[routers]　　―　사용자 요청/응답 라우터 폴더  
➡[views]　　―　 PUG 템플릿 폴더  
➡db.js 　　―　 mongoose DB 연결  
➡init.js 　　―　서버 실행  
➡middlewares.js 　　―　 express middleware  
➡server.js 　　―　 express 서버 세팅

---

### 📖 배운점? 성과?

- 학원에서 배웠던 ES5가 아닌, ES6 버전을 공부하며, Arrow function 과 async/await 와 같은 비동기 함수 처리와 같은 차이점에 대해 알 수 있었다.
- FFmpeg 라이브러리를 사용해 직접 녹화 후 영상을 다운로드 받는 기능을 배울 수 있었다.  
  해당 기능이 기기에 따라 간혹 모바일에서 작동하지 않는 듯 하여 여러 기계로 테스트 후 문제가 발견될 경우 빠르게 개선할 예정입니다.
- Mongoose 의 schema & model 에 대해 공부하며 백엔드의 구조에 대해 배울 수 있었다. 어렵지만 직접 모델을 설계하고 구조를 잡아가는 과정이 즐거웠다.

---

### ❗가장 어려웠던 것, 해결 까지

- MongoDB Atlas + AWS S3 서버를 사용하는 것은 처음이다보니 어려움이 많았었는데,

      특히 동영상 녹화 및 변환 라이브러리인 FFmpeg 와 AWS S3 의 **CORS**, header 정책이 부딪혀

      정상적인 작동이 안 됬었다. 처음 맞던 CORS 정책 오류로 머리가 하얗게 변하는 듯 했다.

- FFmpeg 는 보안을 위해 출처간 격리된 페이지에서만 사용이 가능하나,

      내 아바타 URL 은 AWS S3 에서 CROS 를 통해 가져와야했따.

- 이에 AWS S3 버킷 정책과 더불어 추가로 초면이였던 CORS 정책에 대해 여러 문서를 참고하고 직접 정리하는 등 문제를 해결하였다.

[📕에러노트\_CORS 오류 해결(2) feat. SharedArrayBuffer](https://velog.io/@tnrud4685/%EC%97%90%EB%9F%AC%EB%85%B8%ED%8A%B8CORS-%EC%98%A4%EB%A5%98-%ED%95%B4%EA%B2%B02...feat.-SharedArrayBuffer)

- 아래는 문제가 발생했던 `server.js` 의 부분.

```jsx
// 기존 코드

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Cross-Origin-Embedder-Policy", "credentialless");
  next();
});

// 수정 후 정상 동작

app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "credentialless");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
```

---

### **🤯  디벨롭 예정**

- 네이버 openAPI 소셜 로그인 기능 구현
- 동영상 좋아요, 싫어요 기능
- 해시태그를 통해 영상을 검색하는 기능
