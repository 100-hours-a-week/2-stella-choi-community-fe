// 데이터 로딩 및 출력

async function loadData() {
    try {
        const path = window.location.pathname;
        const postID = path.split('/')[2];
        console.log(postID);    
        const response = await fetch(`/data/boards/${postID}.json`); // 로컬 JSON 파일 경로
        const jsonData = await response.json();
        console.log(jsonData);
        renderPost(jsonData);
    } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
    } 
}

const commentInput = document.querySelector('.comment-textarea');
const commentSubmitButton = document.querySelector('.submit-comment');
const buttonText = document.querySelector('.comment-text');

function renderPost(data) {
    document.querySelector('.post-title').textContent = data.title;
    document.querySelector('.author-name').textContent = data.user_name;
    document.querySelector('.profile-user-real-img').src = data.user_profile;
    document.querySelector('.post-date').textContent = data.date;
    document.querySelector('.post-text .text').textContent = data.content;
    document.querySelector('.post-image').src = data.image;
    document.querySelectorAll('.stat-num')[0].textContent = data.likes_count;
    document.querySelectorAll('.stat-num')[1].textContent = data.view_count;
    document.querySelectorAll('.stat-num')[2].textContent = data.comment_count;

    const commentSection = document.querySelector('.comment-part');
    commentSection.innerHTML = '';
    

    let isEditing = false;
    let editingCommentId = null;

    data.comments.forEach(comment => {
        const commentHTML = `
            <div class="comment-check-section" data-comment-id="${comment.comment_id}">
                <div class="comment-info-part">
                <div class="comment-info">
                    <div class="profile-user-img">
                    <img src="${comment.comment_writer_profile}" alt="profile-user-img" class="profile-user-real-img">
                    </div>
                    <span class="comment-author">${comment.comment_writer}</span>
                    <span class="comment-date">2021-01-01 00:00:00</span>
                </div>
                <div class="comment-content">
                    <span class="comment-data">${comment.comment_data}</span>
                </div>
                </div>
                <div class="comment-controls">
                <button class="edit-button" id="comment-edit">수정</button>
                <button class="delete-button" id="comment-delete">삭제</button>
                </div>
            </div>`;
        commentSection.insertAdjacentHTML('beforeend', commentHTML);
        const commentDeleteButton = document.querySelectorAll('#comment-delete');
        commentDeleteButton.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('댓글 삭제 버튼 눌림');
                openCommentModal();
            });
        });

        document.querySelectorAll('#comment-edit').forEach(button => {
            button.addEventListener('click', (e)=>{
                e.preventDefault();
                console.log('댓글 수정 버튼 눌림');
                const commentSection = button.closest('.comment-check-section');
                const commentId = commentSection.dataset.commentId;
                const commentContent = commentSection.querySelector('.comment-data').textContent;

                isEditing = true;
                editingCommentId = commentId;

                commentInput.value = commentContent;
                buttonText.textContent='댓글 수정';
            })
        })

        commentSubmitButton.addEventListener('click', (e) => {
            e.preventDefault();
            const newCommentContent = commentInput.value;

            if(isEditing){
                const commentToEdit = document.querySelector(`.comment-check-section[data-comment-id="${editingCommentId}"]`);
                commentToEdit.querySelector('.comment-data').textContent = newCommentContent;

                isEditing = false;
                editingCommentId = null;
                buttonText.textContent = '댓글 등록'; 
                commentInput.value = ''; 
            }
            else{
                // ✅ [TODO] 댓글 등록 로직
                console.log("댓글 등록:", newCommentContent);
            }
        })
    });
}

// 초기 데이터 로드
document.addEventListener('DOMContentLoaded', loadData);

const deletePostModal = document.getElementById('delete-post-modal');
const modalOverlay = document.getElementById('modal-overlay');
const postDeleteButton = document.getElementById('post-delete');
const cancelPostDeleteButton = document.getElementById('cancelDeletePost');
const confirmPostDeleteButton = document.getElementById('confirmDeletePost');

const deleteCommentModal = document.getElementById('delete-comment-modal');

const cancelCommentDeleteButton = document.getElementById('cancelDeleteComment');
const confirmCommentDeleteButton = document.getElementById('confirmDeleteComment');

function openPostModal() {
    modalOverlay.style.display = 'block';
    deletePostModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 스크롤 막기
}

function closePostModal() {
    modalOverlay.style.display = 'none';
    deletePostModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 스크롤 허용
}

// 삭제 버튼 클릭 시 모달 열기
postDeleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('삭제 버튼 눌림');
    openPostModal();
});

// 취소 버튼 클릭 시 모달 닫기
cancelPostDeleteButton.addEventListener('click', closePostModal);

// 확인 버튼 클릭 시 [TODO] 실제 삭제 및 모달 닫기
confirmPostDeleteButton.addEventListener('click', () => {
    closePostModal();
});


function openCommentModal() {
    modalOverlay.style.display = 'block';
    deleteCommentModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 스크롤 막기
}

function closeCommentModal() {
    modalOverlay.style.display = 'none';
    deleteCommentModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 스크롤 허용
}


// 취소 버튼 클릭 시 모달 닫기
cancelCommentDeleteButton.addEventListener('click', closeCommentModal);

// 확인 버튼 클릭 시 [TODO] 실제 삭제 및 모달 닫기
confirmCommentDeleteButton.addEventListener('click', () => {
    // 실제 삭제 로직 추가
    closeCommentModal();
});


document.querySelector('.arrow-wrap').addEventListener('click', () => {
    window.location.href = `/board`;
});

document.querySelector('.edit-button').addEventListener('click', () => {
    window.location.href = `/editpost`;
});


commentInput.addEventListener('input', function () {
    const inputValue = this.value.trim();
    if (inputValue.length > 0) {
        commentSubmitButton.disabled = false;
        commentSubmitButton.style.backgroundColor = '#7F6AEE'; // 버튼 활성화 색상
    } else {
        commentSubmitButton.disabled = true;
        commentSubmitButton.style.backgroundColor = '#ACA0EB'; // 버튼 비활성화 색상
    }
});
