document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginBtn = document.getElementById('loginBtn');

    let isValid = validateForm(emailInput, passwordInput, emailError, passwordError);

    if (isValid) {
        setTimeout(() => {
            window.location.href = "/board";
        }, 500);
    }
});


// 입력 필드에서 자동 유효성 검사
document.getElementById('email').addEventListener('input', function() {
    const emailInput = this;
    const emailError = document.getElementById('emailError');
    validateEmailInput(emailInput, emailError);

    const passwordInput = document.getElementById('password');
    let isValid = validateForm(emailInput, passwordInput, emailError, passwordError);

    // 유효성 검사 통과 시 색상 변경 및 페이지 이동
    if (isValid) {
        loginBtn.classList.add('active');
    }
});

document.getElementById('password').addEventListener('input', function() {
    const passwordInput = this;
    const passwordError = document.getElementById('passwordError');
    validatePasswordInput(passwordInput, passwordError);

    const emailInput = document.getElementById('email');
    let isValid = validateForm(emailInput, passwordInput, emailError, passwordError);

    // 유효성 검사 통과 시 색상 변경 및 페이지 이동
    if (isValid) {
        loginBtn.classList.add('active');
    }
});

function validateForm(emailInput, passwordInput, emailError, passwordError) {
    let isValid = true;

    // 이메일 유효성 검사
    if (!validateEmail(emailInput.value)) {
        emailError.innerText = "올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
        emailError.style.display = "block";
        isValid = false;
    } else {
        emailError.style.display = "none";
    }

    // 비밀번호 유효성 검사
    if (!validatePassword(passwordInput.value)) {
        passwordError.innerText = "비밀번호는 8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
        passwordError.style.display = "block";
        isValid = false;
    } else {
        passwordError.style.display = "none";
    }

    return isValid;
}

function validateEmailInput(emailInput, emailError) {
    if (!validateEmail(emailInput.value)) {
        emailError.innerText = "올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
        emailError.style.display = "block";
    } else {
        emailError.style.display = "none";
    }
}

function validatePasswordInput(passwordInput, passwordError) {
    if (!validatePassword(passwordInput.value)) {
        passwordError.innerText = "비밀번호는 8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
        passwordError.style.display = "block";
    } else {
        passwordError.style.display = "none";
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return re.test(password);
}

document.querySelector('.actions').addEventListener('click', () => {
    window.location.href = `/join`;
});