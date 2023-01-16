const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
let deleteBtns = document.querySelectorAll(".video__comment__deleteBtn");

// addComment 기능
// 댓글을 작성하여 데이터베이스에 추가된 댓글이 바로 탬플릿에 적용되면 좋지만 정보는 변경되기 전을 반영하고 있기 때문에,
// 새로고침을 하지 않으면 댓글 추가가 바로 반영되지 않아서 javascript trick을 사용하여 실시간으로 추가되는 것 같은 탬플릿을 만듦
// html로만 추가를 해두었다가 나중에 다시 접속했을 때는 실제 서버로부터 받아와서 적용되는 효과를 얻을 수 있다.
const addComment = (text, id, comment) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";

  const span = document.createElement("span");
  span.className = "comment__text";
  span.innerText = ` ${text}`;
  span.dataset.id = id;

  // 작성자 아바타
  const owenrAvatar = document.createElement("img");
  owenrAvatar.setAttribute("src", comment.avatarUrl);
  owenrAvatar.className = "comments__avatar";

  // 작성자
  const ownerNameSpan = document.createElement("span");
  ownerNameSpan.className = "comment__owner";
  ownerNameSpan.innerText = comment.ownername;

  // 작성시간
  const commnetCreate = document.createElement("span");
  commnetCreate.innerText = new Date(comment.createdAt).toLocaleDateString(
    "ko-kr",
    { year: "numeric", month: "numeric", day: "numeric" }
  );
  commnetCreate.className = "comment__createdAt";

  // 댓글삭제 버튼
  const deleteSpan = document.createElement("span");
  deleteSpan.dataset.id = id;
  deleteSpan.innerText = "❌";
  deleteSpan.className = "video__comment__deleteBtn";
  deleteSpan.addEventListener("click", handleDelete);

  // 추가
  newComment.appendChild(owenrAvatar);
  newComment.appendChild(ownerNameSpan);
  newComment.appendChild(commnetCreate);
  newComment.appendChild(span);
  newComment.appendChild(deleteSpan);

  videoComments.prepend(newComment);
};

const handleSubmit = async event => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "" || text.trim() === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId, comment, commentId } = await response.json();
    addComment(text, newCommentId, comment, commentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

// 코드챌린지(댓글삭제)

const removeComment = commentId => {
  const commentToRemove = document.querySelector(`li[data-id='${commentId}']`);
  commentToRemove.remove();
};

const handleDelete = async event => {
  const commentId = event.target.dataset.id;
  const response = await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  if (response.status === 204) {
    removeComment(commentId);
  }
};

// 삭제 버튼에 이벤트 리스너 추가
deleteBtns.forEach(btn => {
  btn.addEventListener("click", handleDelete);
});
