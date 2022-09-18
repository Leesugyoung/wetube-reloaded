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

    // 코드챌린지(댓글삭제)
    const deleteSpan = document.createElement("span");
    deleteSpan.innerText = "❌";
    deleteSpan.id = "deleteBtn";
    deleteSpan.className = "video__comment__deleteBtn";
    deleteSpan.addEventListener("click", handleDelete);
    newComment.appendChild(deleteSpan);
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
        const { name, createdAt, newCommentId } = await response.json();
        addComment(text, newCommentId, name, createdAt);
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