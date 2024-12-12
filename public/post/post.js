const hostUrl = "http://localhost:8080/api/";
const staticUrl = "http://localhost:8080/";
const serverVersion = "v1";

const path = window.location.pathname;
const postID = path.split('/')[2];
let loginUserId;
let isLiked;

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

        document.querySelectorAll('#comment-edit').forEach(button => {
            button.addEventListener('click', (e)=>{
                e.preventDefault();
                e.stopPropagation();
                const commentSection = button.closest('.comment-check-section');
                const commentId = commentSection.dataset.commentId;
                console.log('댓글 수정 버튼 눌림', commentSection.dataset.commentId);
                const commentContent = commentSection.querySelector('.comment-data').textContent;

                isEditing = true;
                editingCommentId = commentId;

                commentInput.value = commentContent;
                buttonText.textContent='댓글 수정';
            })
        })

        const commentDeleteButton = document.querySelectorAll('#comment-delete');
        commentDeleteButton.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const commentSection = button.closest('.comment-check-section');
                const commentId = commentSection.dataset.commentId;
                console.log('댓글 삭제 버튼 눌림', commentId);
                openCommentModal(commentId);
            });
        });

        await checkLike(postID);
    } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
    } 
}

const commentInput = document.querySelector('.comment-textarea');
const commentSubmitButton = document.querySelector('.submit-comment');
const buttonText = document.querySelector('.comment-text');

let isEditing = false;
let editingCommentId = null;

function renderPost(data) {
    const profileImage = staticUrl + data.user_profile;
    const postImage = data.post_image ? staticUrl + data.post_image : null;
    document.querySelector('.post-title').textContent = data.title;
    document.querySelector('.author-name').textContent = data.user_name;
    document.getElementById('writer-img').src = profileImage;
    document.querySelector('.post-date').textContent = data.date;
    document.querySelector('.post-text .text').textContent = data.content;

    if(loginUserId !== data.user_id){
        const postEditElement = document.querySelector('.edit-button');
        const postDeleteElement = document.querySelector('.delete-button');
        postEditElement.style.display = 'none';
        postDeleteElement.style.display = 'none';
    }

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

    data.comments.forEach(comment => {
        const commentHTML = `
            <div class="comment-check-section" data-comment-id="${comment.comment_id}">
                <div class="comment-info-part">
                <div class="comment-info">
                    <div class="profile-user-img">
                    <img src="${staticUrl + comment.comment_writer_profile}" alt="profile-user-img" class="profile-user-real-img">
                    </div>
                    <span class="comment-author">${comment.comment_writer}</span>
                    <span class="comment-date">${comment.comment_posted_time}</span>
                </div>
                <div class="comment-content">
                    <span class="comment-data">${comment.comment_data}</span>
                </div>
                </div>
                <div class="comment-controls ${comment.comment_writer_id === loginUserId ? '' : 'hidden'}">
                    <button class="edit-button" id="comment-edit">수정</button>
                    <button class="delete-button" id="comment-delete">삭제</button>
                </div>
            </div>`;
        commentSection.insertAdjacentHTML('beforeend', commentHTML);

    });
}

commentSubmitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const newCommentContent = commentInput.value;
    console.log(isEditing);
    if(isEditing){
        const commentToEdit = document.querySelector(`.comment-check-section[data-comment-id="${editingCommentId}"]`);
        commentToEdit.querySelector('.comment-data').textContent = newCommentContent;

        await editComment(editingCommentId);
        isEditing = false;
        editingCommentId = null;
    }
    else{
        createComment();
        console.log("댓글 등록:", newCommentContent);
    }
})

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
        loginUserId = data.user_id;
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
        await loadProfile();
        await loadData();
        const likeButton = document.getElementById("like-button");
        likeButton.addEventListener("click", () => handleLike(postID));
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

cancelCommentDeleteButton.addEventListener('click', closeCommentModal);
confirmCommentDeleteButton.addEventListener('click', async () => {
    if (deleteCommentModal.dataset.commentId) {
        await deleteComment(deleteCommentModal.dataset.commentId);
        closeCommentModal();
    }
});

async function openCommentModal(commentId) {
    deleteCommentModal.dataset.commentId = commentId;
    modalOverlay.style.display = 'block';
    deleteCommentModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCommentModal() {
    modalOverlay.style.display = 'none';
    deleteCommentModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 스크롤 허용
}


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

async function createComment() {
    const commentContent = commentInput.value.trim();

    if (!commentContent) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    const createCommentUrl = `${hostUrl}${serverVersion}/comments`;

    try {
        const response = await fetch(createCommentUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: commentContent,
                board_id: postID,
            })
        });

        const responseData = await response.json();

        if (response.ok) {
            commentInput.value = ''; // 입력 필드 초기화
            buttonText.textContent = '댓글 등록'; // 버튼 텍스트 초기화

            await loadData();
        } else {
            // 에러 처리
            handleError(responseData.message);
        }
    } catch (error) {
        console.error('댓글 작성 중 오류 발생:', error);
        alert('댓글 작성 중 오류가 발생했습니다.');
    }
}



async function editComment(commentId) {
    console.log(commentId);
    const commentContent = commentInput.value.trim();
    console.log(commentContent);
    if (!commentContent) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    const editCommentUrl = `${hostUrl}${serverVersion}/comments/${commentId}`;

    try {
        const response = await fetch(editCommentUrl, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: commentContent,
            })
        });

        const responseData = await response.json();
        console.log(responseData);
        if (response.ok) {
            commentInput.value = ''; // 입력 필드 초기화
            buttonText.textContent = '댓글 등록'; // 버튼 텍스트 초기화

            await loadData();
        } else {
            // 에러 처리
            handleError(responseData.message);
        }
    } catch (error) {
        console.error('댓글 수정 중 오류 발생:', error);
        alert('댓글 수정 중 오류가 발생했습니다.');
    }
}

async function deleteComment(commentId) {
    console.log(commentId);

    const deleteCommentUrl = `${hostUrl}${serverVersion}/comments/${commentId}`;

    try {
        const response = await fetch(deleteCommentUrl, {
            method: 'DELETE',
            credentials: 'include',
        });

        const responseData = await response.json();
        console.log(responseData);
        if (response.ok) {
            await loadData();
        } else {
            // 에러 처리
            handleError(responseData.message);
        }
    } catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error);
        alert('댓글 삭제 중 오류가 발생했습니다.');
    }
}


async function handleLike(postId) {
    const likeButton = document.getElementById("like-button");
    const likeCountElement = document.getElementById("like-count");

    const likePostUrl = `${hostUrl}${serverVersion}/likes`
    const likeDeleteUrl = `${hostUrl}${serverVersion}/likes/${postId}`;
    console.log(isLiked);
    const method = isLiked ? "DELETE" : "POST"; // 좋아요 취소: DELETE, 좋아요 추가: POST
    const url = isLiked ? likeDeleteUrl : likePostUrl;

    console.log(postId);
    try {
        const response = await fetch(url, {
            method: method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                board_id: postId,
            })
        });

        const responseData = await response.json();
        console.log(responseData);
        if (response.ok) {
            await loadData();
        } else {
            handleError(responseData.message);
        }
    } catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error);
        alert('댓글 삭제 중 오류가 발생했습니다.');
    }
}

async function checkLike(postId) {
    const likeButton = document.getElementById("like-button");
    const getLikeUrl = `${hostUrl}${serverVersion}/likes/${postId}`;

    const response = await fetch(getLikeUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    const responseData = await response.json();
    console.log(responseData);
    if(response.ok) {
        if(responseData.data.isLiked){
            isLiked = true;
            likeButton.style.background = '#ACA0EB';
        } else{
            isLiked = false;
            likeButton.style.background = '#D9D9D9';
        }
    }
}

function handleError(message) {
    switch (message) {
        case 'MISSING_FIELD':
            alert('필수 입력 항목이 누락되었습니다.');
            break;
        case 'INVALID_FORMAT':
            alert('ID는 숫자여야 합니다');
            break;
        case 'INVALID_TITLE':
            alert('제목 조건에 맞지 않습니다.');
            break;
        case 'MISSING_SESSION':
            alert('세션 정보가 없습니다.');
            break;
        case 'ACCESS_DENIED':
            alert('수정 및 삭제 권한이 없습니다.');
            break;
        case 'UNAUTHORIZED':
            alert('권한이 없습니다.');
            break;
        case 'NOT_FOUND_USER':
            alert('해당 사용자를 찾을 수 없습니다.');
            break;
        default:
            alert('서버 오류가 발생했습니다.');
    }
}