const deleteAccountModal = document.getElementById('delete-account-modal');
const modalOverlay = document.getElementById('modal-overlay');
const accountDeleteButton = document.querySelector('.leave-btn');
const cancelAccountDeleteButton = document.getElementById('cancelDeleteAccount');
const confirmAccountDeleteButton = document.getElementById('confirmDeleteAccount');
const editButton = document.querySelector('.edit-btn');
const profileImgInput = document.getElementById('profileImgInput');
const profileEditImg = document.getElementById('profileEditImg');
const changeProfileBtn = document.getElementById('changeProfileBtn');
const nicknameInput = document.querySelector('.input-form'); // 닉네임 입력 필드

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


editButton.addEventListener('click', async () => {
    await patchProfile();
});

// 삭제 버튼 클릭 시 모달 열기
accountDeleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('삭제 버튼 눌림');
    openDeleteModal();
});

// 취소 버튼 클릭 시 모달 닫기
cancelAccountDeleteButton.addEventListener('click', closeDeleteModal);

confirmAccountDeleteButton.addEventListener('click', async () => {
    closeDeleteModal();
    await deleteUser();
});

changeProfileBtn.addEventListener('click', () => {
    profileImgInput.click();
});

profileImgInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // 선택한 파일
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profileEditImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
        console.log(file);
    }
});

async function loadData() {
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
        const profileImage = staticUrl + data.profile_image;
        renderProfile(profileImage);
        renderUser(data);
    } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
    } 
}

function renderUser(data){
    const profileImage = staticUrl + data.profile_image;
    document.querySelector('.profile-edit-img').src = profileImage;
    document.querySelector('.email-info').textContent = data.email;
    document.querySelector('.input-form').value = data.nickname;
}

async function renderProfile(data){
    const profileImage = document.querySelector('.profile-user-real-img');
    profileImage.src = data;
}

function validateNickname() {
    const errorMessage = document.getElementById('nicknameError'); // 에러 메시지 영역
    const submitButton = document.querySelector('.edit-btn'); // 제출 버튼

    const nickname = nicknameInput.value.trim();

    // 닉네임 유효성 검사
    if (nickname.length <= 10) {
        errorMessage.textContent = ''; // 에러 메시지 제거
        submitButton.disabled = false; // 버튼 활성화
        submitButton.classList.add('active'); // 활성화 스타일 추가
    } else {
        errorMessage.style.display = 'block';
        errorMessage.textContent = '닉네임은 최대 10자 까지 작성 가능합니다.'; // 에러 메시지 표시
        submitButton.disabled = true; // 버튼 비활성화
        submitButton.classList.remove('active'); // 활성화 스타일 제거
    }
}

function setupNicknameValidation() {
    const nicknameInput = document.querySelector('.input-form');

    nicknameInput.addEventListener('input', validateNickname);
}

async function patchProfile() {
    const patchProfileUrl = `${hostUrl}${serverVersion}/users`;
    const nicknameInput = document.querySelector('.input-form');
    const profileImageInput = document.getElementById('profileImgInput');
    console.log(profileImageInput.files[0]);
    const formData = new FormData();
    formData.append('category', "profile");
    if (nicknameInput.value.trim()) {
        formData.append('nickname', nicknameInput.value.trim());
    }
    if (profileImageInput) {
        formData.append('profile_image', profileImageInput.files[0]);
    }

    console.log(Array.from(formData.entries()));
    try {
        const response = await fetch(patchProfileUrl, {
            method: 'PATCH',
            credentials: 'include',
            body: formData,
        });

        const responseData = await response.json();

        if (response.ok) {
            showToast('수정완료');
            loadData(); // 데이터 재로드
        } else {
            handleError(response.status, responseData.message);
        }
    } catch (error) {
        console.error("회원 정보 수정 중 오류 발생:", error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
}


async function deleteUser(){
    const deleteUserUrl = `${hostUrl}${serverVersion}/users`;
    try{
        const response = await fetch(deleteUserUrl, {
            method: 'DELETE',
            credentials: 'include',
        });

        const responseData = await response.json();
        console.log(responseData);
        if (response.ok){
            window.location.href = `/login`;
        } else{
            handleError(responseData.message);
        }
    } catch (error) {
        console.error('회원 탈퇴 중 오류 발생:', error);
        alert('회원 탈퇴 중 오류가 발생했습니다.');
    }
}

function handleError(status, message) {
    const errorMessage = document.getElementById('nicknameError'); // 에러 메시지 영역

    switch (message) {
        case 'MISSING_FIELD':
            errorMessage.textContent = '필수 입력 필드가 누락되었습니다.';
            break;
        case 'INVALID_NICKNAME':
            errorMessage.textContent = '닉네임 요구사항을 지켜주세요.';
            break;
        case 'DUPLICATE_NICKNAME':
            errorMessage.textContent = '중복된 닉네임입니다.';
            break;
        case 'MISSING_SESSION':
            alert('세션이 만료되었습니다. 다시 로그인하세요.');
            break;
        case 'UNAUTHORIZED':
            alert('권한이 없습니다.');
            break;
        case 'NOT_FOUND_USER':
            alert('사용자를 찾을 수 없습니다.');
            break;
        case 'INTERNAL_SERVER_ERROR':
        default:
            alret('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
            break;
    }
    errorMessage.style.display = 'block';
}


// 초기 데이터 로드
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupNicknameValidation();
    nicknameInput.addEventListener('blur', validateNickname);
});