const deleteAccounttModal = document.getElementById('delete-account-modal');
const modalOverlay = document.getElementById('modal-overlay');
const accountDeleteButton = document.querySelector('.leave-btn');
const cancelAccountDeleteButton = document.getElementById('cancelDeleteAccount');
const confirmAccountDeleteButton = document.getElementById('confirmDeleteAccount');

function openDeleteModal() {
    modalOverlay.style.display = 'block';
    deleteAccounttModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 스크롤 막기
}

function closeDeleteModal() {
    modalOverlay.style.display = 'none';
    deleteAccounttModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 스크롤 허용
}

// 삭제 버튼 클릭 시 모달 열기
accountDeleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('삭제 버튼 눌림');
    openDeleteModal();
});

// 취소 버튼 클릭 시 모달 닫기
cancelAccountDeleteButton.addEventListener('click', closeDeleteModal);

// 확인 버튼 클릭 시 [TODO] 실제 삭제 및 모달 닫기
confirmAccountDeleteButton.addEventListener('click', () => {
    console.log('확인버튼눌림?');
    // 실제 삭제 로직 추가
    closeDeleteModal();
});

//TODO: FETCH 유저 데이터
async function loadData() {
    try {
        // TODO: 세션 기반 유저 데이터 조회 필요
        const response = await fetch(`/data/users/user.json`); // 로컬 JSON 파일 경로
        const jsonData = await response.json();
        console.log(jsonData);
        renderUser(jsonData);
    } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
    } 
}

function renderUser(data){
    document.querySelector('.profile-edit-img').src = data.profile_image;
    document.querySelector('.email-info').textContent = data.email;
    document.querySelector('.input-form').value = data.nickname;
}

// 초기 데이터 로드
document.addEventListener('DOMContentLoaded', loadData);