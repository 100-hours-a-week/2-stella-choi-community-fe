const hostUrl = "http://localhost:8080/api/";
const serverVersion = "v1";
const finalUrl = `${hostUrl}${serverVersion}/users/login`;

const formElements = {
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    emailError: document.getElementById('emailError'),
    passwordError: document.getElementById('passwordError'),
    loginBtn: document.getElementById('loginBtn'),
};

const showError = (errorElement, message) => {
    errorElement.style.display = "block";
    errorElement.textContent = message;
};

const hideError = (errorElement) => {
    errorElement.style.display = "none";
    errorElement.textContent = "";
};

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return re.test(password);
};

const validateForm = () => {
    const { emailInput, passwordInput, emailError, passwordError } = formElements;
    let isValid = true;

    if(!emailInput.value){
        showError(emailError, "이메일을 입력해주세요");
        isValid = false;
    }
    else if (!validateEmail(emailInput.value)) {
        showError(emailError, "올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)");
        isValid = false;
    } else {
        hideError(emailError);
    }

    if(!passwordInput.value){
        showError(passwordError, "비밀번호를 입력해주세요");
        isValid = false;
    }
    else if (!validatePassword(passwordInput.value)) {
        showError(passwordError, "비밀번호는 8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.");
        isValid = false;
    } else {
        hideError(passwordError);
    }

    return isValid;
};

const handleResponse = async (response) => {
    const { emailError, passwordError } = formElements;
    const responseBody = await response.json();

    if (response.ok) {
        alert("로그인되었습니다.");
        window.location.href = "/board";
    } else {
        // 에러 메시지와 상태 코드에 따라 분기 처리
        switch (responseBody.message) {
            case "MISSING_FIELD":
                alert("필수 입력 필드가 비어 있습니다. 모든 필드를 채워주세요.");
                break;
            case "INVALID_EMAIL_FORMAT":
                alert("올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)");
                break;
            case "INVALID_PASSWORD":
                showError(passwordError, "아이디 또는 비밀번호를 확인해주세요.");
                break;
            case "NO_USER":
                showError(emailError, "아이디 또는 비밀번호를 확인해주세요.");
                break;
            case "INTERNAL_SERVER_ERROR":
                alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                break;
            default:
                alert("알 수 없는 오류가 발생했습니다.");
        }
    }
};

const handleInputChange = () => {
    const { emailInput, passwordInput, loginBtn } = formElements;
    const isValid = validateForm();

    if (isValid) {
        loginBtn.classList.add('active');
    } else {
        loginBtn.classList.remove('active');
    }
};

const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
        const { emailInput, passwordInput } = formElements;

        const loginData = {
            email: emailInput.value,
            password: passwordInput.value,
        };

        try {
            const response = await fetch(finalUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
                credentials: 'include',
            });

            await handleResponse(response);
        } catch (error) {
            console.error('서버와 통신 중 오류 발생:', error);
            alert('서버 연결 실패. 나중에 다시 시도해주세요.');
        }
    }
};

// Add event listeners
document.getElementById('loginForm').addEventListener('submit', handleSubmit);
formElements.emailInput.addEventListener('input', handleInputChange);
formElements.passwordInput.addEventListener('input', handleInputChange);
document.querySelector('.actions').addEventListener('click', () => {
    window.location.href = `/join`;
});
