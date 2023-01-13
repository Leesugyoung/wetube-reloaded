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

#### 🔥 수정해야할 기능들

- 동영상 댓글 등록 후 avatar url cross-origin 적용안되는 오류  
  (새로고침 시 origin 추가됨;) [ing...]
  ~~- 댓글 삭제 안되는 기능[DONE!]~~ 23.01.13

---

#### 🤯 추후 추가 예정인 기능

- 네이버 openAPI 소셜 로그인 기능 구현
- 동영상 좋아요, 싫어요 기능
- 해시태그를 통해 영상을 검색하는 기능

---

#### 🤗 후기

- 학원에서 배웠던 Javascript 의 ES6 버전을 처음 사용해보았는데, 이전 버전보다 간결해진 코드들과 신기한 기능들을 사용해볼 수 있어서 재밌었다.
- 직접 동영상 뷰어를 만들고, 녹화하는 기능은 시간 가는 줄 모르고 만들었던 것 같다!!
- MongoDB Atlas + AWS S3 를 처음에는 이해하기 힘들었지만, 하면 할 수록 재밌었다. AWS 에는 실제 파일이 올라가고, 그 파일의 경로가 Atlas 에 저장되는 것이 참 신기했다.
- 아쉬웠던 점은, 처음으로 프론트부터 백까지 혼자 했기에 여유가 없어 깊게 파해치지 못했다는 점이다.그러나 Mongo DB 와 Express 는 잊지 못할 것 같다!
