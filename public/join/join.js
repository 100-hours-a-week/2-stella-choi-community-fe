const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordAgainInput = document.getElementById("passwordAgain");
const nicknameInput = document.getElementById("nickname");
const joinBtn = document.getElementById("joinBtn");

const profileError = document.getElementById("profileError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const passwordAgainError = document.getElementById("passwordAgainError");
const nicknameError = document.getElementById("nicknameError");

const imageProfileAddContainer = document.getElementById('imageProfileAddContainer');
const profileImageInput = document.getElementById('profileImageInput');
const circle = document.getElementById('circle');

const showError = (errorElement, message) => {
    errorElement.style.display = "block";
    errorElement.textContent = message;
};

const hideError = (errorElement) => {
    errorElement.style.display = "none";
    errorElement.textContent = "";
};

const fetchData = async () => {
    const finalUrl = hostUrl + serverVersion + "/users";
    const formData = new FormData();
    formData.append("email", emailInput.value);
    formData.append("password", passwordInput.value);
    formData.append("password_check", passwordAgainInput.value);
    formData.append("nickname", nicknameInput.value);
    formData.append("category", "profile");
    formData.append("profile_image", profileImageInput.files[0]);

    try {
        const response = await fetch(finalUrl, {
            method: "POST",
            body: formData
        });

        await handleResponse(response);
    } catch (error) {
        console.error("Fetch Error:", error);
    }
};

const handleResponse = async (response) => {
    const responseBody = await response.json(); // JSON 응답 파싱

    if (response.ok) { // 성공 (HTTP 상태 코드 200-299)
        alert("회원가입이 성공적으로 완료되었습니다!");
        window.location.href = "/login"; // 로그인 페이지로 리다이렉트
    } else {
        // 에러 메시지와 상태 코드에 따라 분기 처리
        switch (responseBody.message) {
            case "NOT_SAME_PASSWORD":
                showError(passwordAgainError, "비밀번호가 일치하지 않습니다.");
                break;
            case "MISSING_FIELD":
                alert("필수 입력 필드가 비어 있습니다. 모든 필드를 채워주세요.");
                break;
            case "INVALID_FORMAT":
                alert("입력 형식이 올바르지 않습니다. 비밀번호, 이메일 또는 닉네임을 확인하세요.");
                break;
            case "DUPLICATE_EMAIL":
                showError(emailError, "이미 사용 중인 이메일입니다.");
                break;
            case "DUPLICATE_NICKNAME":
                showError(nicknameError, "이미 사용 중인 닉네임입니다.");
                break;
            case "INTERNAL_SERVER_ERROR":
                alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                break;
            default:
                alert("알 수 없는 오류가 발생했습니다.");
        }
    }
};

document.querySelector('.actions').addEventListener('click', () => {
    window.location.href = `/login`;
});

document.addEventListener('DOMContentLoaded', async () => {
    imageProfileAddContainer.addEventListener('click', () => {
        profileImageInput.click();
    });

    // 파일 선택 후 미리보기 이미지로 교체
    profileImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                hideError(profileError);
                // `circle` 내용을 업로드한 이미지로 대체
                circle.style.backgroundImage = `url(${e.target.result})`;
                circle.style.backgroundSize = 'cover';
                circle.style.backgroundPosition = 'center';
                circle.style.backgroundColor = 'transparent';
                circle.innerHTML = '';
            };
            reader.readAsDataURL(file);
        }
    });

    const validateEmail = (email) => {
        // 이메일 형식 정규식
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateField = (field) => {
        switch (field.id) {
            case "profileImageInput":
                if (!profileImageInput.value) {
                    showError(profileError, "프로필 사진을 추가해주세요.");
                    return false;
                } else {
                    hideError(profileError);
                    return true;
                }
            case "email":
                if (!field.value) {
                    showError(emailError, "이메일을 입력해주세요.");
                    return false;
                } else if (!validateEmail(field.value)) {
                    showError(emailError, "올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)");
                    return false;
                } else {
                    hideError(emailError);
                    return true;
                }
            case "password":
                if (!field.value) {
                    showError(passwordError, "비밀번호를 입력해주세요.");
                    return false;
                } else if (!validatePassword(field.value)) {
                    showError(passwordError, "비밀번호는 8자 이상이어야 하며, 대문자/소문자/숫자/특수문자를 포함해야 합니다.");
                    return false;
                } else {
                    hideError(passwordError);
                    return true;
                }
            case "passwordAgain":
                if (!field.value) {
                    showError(passwordAgainError, "비밀번호 확인을 입력해주세요.");
                    return false;
                } else if (field.value !== passwordInput.value) {
                    showError(passwordAgainError, "비밀번호가 일치하지 않습니다.");
                    return false;
                } else {
                    hideError(passwordAgainError);
                    return true;
                }
            case "nickname":
                if (!field.value) {
                    showError(nicknameError, "닉네임을 입력해주세요.");
                    return false;
                } else if (field.value.length > 10) {
                    showError(nicknameError, "닉네임은 최대 10자까지 가능합니다.");
                    return false;
                } else {
                    hideError(nicknameError);
                    return true;
                }
            default:
                return true;
        }
    };

    [profileImageInput, emailInput, passwordInput, passwordAgainInput, nicknameInput].forEach((input) => {
        input.addEventListener("blur", () => {
            validateField(input);
        });
    });

    joinBtn.addEventListener("click",  async (e) => {
        e.preventDefault(); // 폼 제출 방지
        let isValid = true;

        [profileImageInput, emailInput, passwordInput, passwordAgainInput, nicknameInput].forEach((input) => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            joinBtn.classList.add('active');
            await fetchData(); // 모든 입력이 유효할 경우만 서버 요청
            // window.location.href = `/login`; // 성공 시 로그인 페이지로 이동
        } else {
            joinBtn.classList.remove('active');
        }
    });
});