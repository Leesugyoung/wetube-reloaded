const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
let deleteBtns = document.querySelectorAll("#deleteBtn");

const addComment = (text, id, comment) => {
      const videoComments = document.querySelector(".video__comments ul");
      const newComment = document.createElement("li");
      newComment.dataset.id = id;
      newComment.className = "video__comment";

      const span = document.createElement("span");
      span.className = "comment__text";
      span.innerText = ` ${text}`;
      
      // 작성자 아바타
      const owenrAvatar = document.createElement("img");
      owenrAvatar.setAttribute('src',comment.avatarUrl);
      owenrAvatar.className = "comments__avatar";

      // 작성자
      const ownerNameSpan = document.createElement("span");
      ownerNameSpan.className = "comment__owner";
      ownerNameSpan.innerText = comment.ownername;

      // 작성시간
      const commnetCreate = document.createElement("span");
      commnetCreate.innerText = new Date(comment.createdAt).toLocaleDateString("ko-kr", {year: 'numeric', month: 'numeric', day: 'numeric'})
      commnetCreate.className ="comment__createdAt";

      // 댓글삭제 버튼
      const deleteSpan = document.createElement("span");
      deleteSpan.innerText = "❌";
      deleteSpan.id = "deleteBtn";
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
        const { 
          newCommentId, comment
        } = await response.json();
        addComment(
          text, 
          newCommentId, 
          comment
        );
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