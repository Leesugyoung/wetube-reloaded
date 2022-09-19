const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
let deleteBtns = document.querySelectorAll("#deleteBtn");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    newComment.appendChild(span);
    videoComments.prepend(newComment);

    // 코드챌린지
    // 댓글삭제
    const deleteSpan = document.createElement("span");
    deleteSpan.innerText = "❌";
    deleteSpan.id = "deleteBtn";
    deleteSpan.className = "video__comment__deleteBtn";
    deleteSpan.addEventListener("click", handleDelete);
    newComment.appendChild(deleteSpan);

    // // 작성자
    const ownerName = document.createElement("span");
    ownerName.className = "comment__owername";
    ownerName.innerHTML = comment.ownername;
    newComment.appendChild(ownerName);

    // // 작성 시간
    // const commnetCreate = document.createElement("span");
    // commnetCreate.className = "comment__createdat";
    // newComment.appendChild(commnetCreate);

    // // 작성자 아바타
    // const owenrAvatar = document.createElement("span");
    // owenrAvatar.className = "comments__avatar";
    // newComment.appendChild(owenrAvatar);
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "" || text.trim() === "") {
        return;
      }
      const response = await fetch(`/api/videos/${videoId}/comment`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text:text }),
    });
    if (response.status === 201) {
        textarea.value = "";
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    };
};

if(form){
    form.addEventListener("submit", handleSubmit);
}

// 코드챌린지(댓글삭제)
const handleDelete = async (event) => {
    const li = event.target.parentElement;
    const {
      dataset: { id: commentId },
    } = li;
    li.remove();
    await fetch(`/api/comments/${commentId}/delete`, {
      method: "DELETE",
    });
};

if (deleteBtns) {
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", handleDelete);
  });
}