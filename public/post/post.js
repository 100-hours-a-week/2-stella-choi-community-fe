const deletePostModal = document.getElementById('delete-post-modal');
const modalOverlay = document.getElementById('modal-overlay');
const postDeleteButton = document.getElementById('post-delete');
const cancelPostDeleteButton = document.getElementById('cancelDeletePost');
const confirmPostDeleteButton = document.getElementById('confirmDeletePost');

const deleteCommentModal = document.getElementById('delete-comment-modal');
const commentDeleteButton = document.querySelectorAll('#comment-delete');
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

commentDeleteButton.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('댓글 삭제 버튼 눌림');
        openCommentModal();
    });
});

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