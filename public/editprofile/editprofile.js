const deleteAccountModal = document.getElementById('delete-account-modal');
const modalOverlay = document.getElementById('modal-overlay');
const accountDeleteButton = document.querySelector('.leave-btn');
const cancelAccountDeleteButton = document.getElementById('cancelDeleteAccount');
const confirmAccountDeleteButton = document.getElementById('confirmDeleteAccount');
const editButton = document.querySelector('.edit-btn');
const profileImgInput = document.getElementById('profileImgInput');
const profileEditImg = document.getElementById('profileEditImg');
const changeProfileBtn = document.getElementById('changeProfileBtn');

function openDeleteModal() {
    modalOverlay.style.display = 'block';
    deleteAccountModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 스크롤 막기
}

function closeDeleteModal() {
    modalOverlay.style.display = 'none';
    deleteAccountModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 스크롤 허용
}

function showToast(message) {
    const toastContainer = document.getElementById('toast-container');

    const toastMessage = document.createElement('div');
    toastMessage.classList.add('toast-message');
    toastMessage.textContent = message;

    toastContainer.appendChild(toastMessage);

    // 20초 후 메시지 제거
    setTimeout(() => {
        toastMessage.remove();
    }, 5000);
}

editButton.addEventListener('click', () => {
    showToast('수정완료');
});

// 삭제 버튼 클릭 시 모달 열기
accountDeleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('삭제 버튼 눌림');
    openDeleteModal();
});

// 취소 버튼 클릭 시 모달 닫기
cancelAccountDeleteButton.addEventListener('click', closeDeleteModal);

confirmAccountDeleteButton.addEventListener('click', () => {
    // TODO: 회원탈퇴 로직
    closeDeleteModal();
    window.location.href = `/login`;
});

changeProfileBtn.addEventListener('click', () => {
    profileImgInput.click();
});

profileImgInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // 선택한 파일
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profileEditImg.src = e.target.result; // 이미지 미리 보기 업데이트
        };
        reader.readAsDataURL(file);
        console.log(file);
    }
});

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