const hostUrl = "http://localhost:8080/api/";
const staticUrl = "http://localhost:8080/";
const serverVersion = "v1";

const path = window.location.pathname;
const postID = path.split('/')[2];

async function loadData() {
    const getPostUrl = `${hostUrl}${serverVersion}/boards/${postID}`;
    try {
        const response = await fetch(getPostUrl,{
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            await handleError(response.status, errorData.message); // 오류 처리
            return;
        }

        const responseData = await response.json();
        const { data } = responseData;
        console.log(data);

        await renderPost(data);
    } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
    } 
}

const commentInput = document.querySelector('.comment-textarea');
const commentSubmitButton = document.querySelector('.submit-comment');
const buttonText = document.querySelector('.comment-text');

function renderPost(data) {
    const profileImage = staticUrl + data.user_profile;
    const postImage = data.post_image ? staticUrl + data.post_image : null;
    document.querySelector('.post-title').textContent = data.title;
    document.querySelector('.author-name').textContent = data.user_name;
    document.getElementById('writer-img').src = profileImage;
    document.querySelector('.post-date').textContent = data.date;
    document.querySelector('.post-text .text').textContent = data.content;

    const postImageElement = document.querySelector('.post-image');
    if (postImage) {
        postImageElement.src = postImage; // 이미지가 존재하면 설정
        postImageElement.style.display = ''; // 감춰져 있을 수도 있으니 다시 보이도록 설정
    } else {
        postImageElement.style.display = 'none'; // 이미지가 없으면 감추기
    }
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
                    <img src="${staticUrl + comment.comment_writer_profile}" alt="profile-user-img" class="profile-user-real-img">
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


async function loadProfile(){
    const getProfileUrl = `${hostUrl}${serverVersion}/users`;

    try {
        const response = await fetch(getProfileUrl, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            await handleError(response.status, errorData.message); // 오류 처리
            return;
        }

        const responseData = await response.json();
        const { data } = responseData;
        console.log(data);
        const profileImage = staticUrl + data.profile_image;
        await renderProfile(profileImage);
    } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
    } finally {
        isLoading = false;
    }
}

async function renderProfile(data){
    const profileImage = document.querySelector('.profile-user-real-img');
    profileImage.src = data;
}

// 초기 데이터 로드
document.addEventListener('DOMContentLoaded', async () => {
        loadData();
        loadProfile();
    }
);


const deletePostModal = document.getElementById('delete-post-modal');
const modalOverlay = document.getElementById('modal-overlay');
const postDeleteButton = document.getElementById('post-delete');
const cancelPostDeleteButton = document.getElementById('cancelDeletePost');
const confirmPostDeleteButton = document.getElementById('confirmDeletePost');

const deleteCommentModal = document.getElementById('delete-comment-modal');
const cancelCommentDeleteButton = document.getElementById('cancelDeleteComment');
const confirmCommentDeleteButton = document.getElementById('confirmDeleteComment');

const editPostButton = document.querySelector('edit-button');

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
    window.location.href = `/editpost/${postID}`;
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
