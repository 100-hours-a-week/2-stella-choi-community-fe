const passwordInput = document.getElementById('password');
const passwordCheckInput = document.getElementById('passwordcheck');
const passwordError = document.getElementById('passwordError');
const passwordCheckError = document.getElementById('passwordcheckError');
const editBtn = document.getElementById('editBtn');


const showError = (errorElement, message) => {
    errorElement.style.display = "block";
    errorElement.textContent = message;
};

const hideError = (errorElement) => {
    errorElement.style.display = "none";
    errorElement.textContent = "";
};

editBtn.addEventListener('click', async (e) => {
    await editPassword();
})

document.addEventListener('DOMContentLoaded', () => {
    passwordInput.addEventListener('blur', validatePasswordMatch);
    passwordCheckInput.addEventListener('blur', validatePasswordMatch);

    loadProfile();
});

function showToast(message) {
    const toastContainer = document.getElementById('toast-container');

    const existingMessage = Array.from(toastContainer.children).find(
        (child) => child.textContent === message
    );

    if (existingMessage) {
        return;
    }

    const toastMessage = document.createElement('div');
    toastMessage.classList.add('toast-message');
    toastMessage.textContent = message;

    toastContainer.appendChild(toastMessage);

    // 20초 후 메시지 제거
    setTimeout(() => {
        toastMessage.remove();
    }, 2000);
}

const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return re.test(password);
};

const validatePasswordMatch = () => {
    const password = passwordInput.value.trim();
    const passwordCheck = passwordCheckInput.value.trim();

    if (!password && !passwordCheck) {
        showError(passwordError, "비밀번호를 입력해주세요");
        showError(passwordCheckError, "비밀번호 확인을 입력해주세요");
        editBtn.classList.remove('active');
        return false;
    }

    if (!password) {
        showError(passwordError, "비밀번호를 입력해주세요");
        hideError(passwordCheckError);
        editBtn.classList.remove('active');
        return false;
    } else if (!validatePassword(password)) {
        showError(passwordError, "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.");
        hideError(passwordCheckError);
        editBtn.classList.remove('active');
        return false;
    } else {
        hideError(passwordError);
    }

    if (!passwordCheck) {
        showError(passwordCheckError, "비밀번호를 한번 더 입력해주세요");
        editBtn.classList.remove('active');
        return false;
    } else if (password !== passwordCheck) {
        showError(passwordError, "비밀번호 확인과 다릅니다.")
        showError(passwordCheckError, "비밀번호와 다릅니다");
        editBtn.classList.remove('active');
        return false;
    } else {
        hideError(passwordCheckError);
    }

    editBtn.classList.add('active');
    return true;
};

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
        console.log(responseData);
        const { data } = responseData;
        console.log(data);
        const profileImage = staticUrl + data.profile_image;
        await renderProfile(profileImage);
    } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
    }
}

function handleError(status, message) {
    switch (message) {
        case 'MISSING_PASSWORD':
            passwordError.textContent = '비밀번호를 입력하세요.';
            break;
        case 'NOT_SAME_PASSWORD':
            passwordError.textContent = '비밀번호와 비밀번호 확인이 다릅니다.';
            break;
        case 'SAME_BEFORE_PASSWORD':
            passwordError.textContent = '이미 사용한 비밀번호입니다.';
            break;
        case 'INVALID_FORMAT':
            alert('비밀번호 조건을 지켜야 합니다.')
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

    passwordError.style.display = 'block';
}
async function renderProfile(data){
    const profileImage = document.querySelector('.profile-user-real-img');
    profileImage.src = data;
}

async function editPassword(){
    const editPasswordUrl = `${hostUrl}${serverVersion}/users/password`;
    const password = document.getElementById('password').value.trim();
    const passwordcheck = document.getElementById('passwordcheck').value.trim();

    const passwordData = {
        password: password,
        password_check: passwordcheck
    };

    if(validatePasswordMatch()){
        try {
            const response = await fetch(editPasswordUrl, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordData)
            });

            const responseData = await response.json();
            console.log(responseData);

            if (response.ok) {
                showToast('수정완료');
            } else {
                handleError(response.status, responseData.message);
            }
        } catch (error) {
            console.error("비밀번호 수정 중 오류 발생:", error);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
    }
}


