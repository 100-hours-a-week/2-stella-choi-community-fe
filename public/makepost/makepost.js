const hostUrl = "http://localhost:8080/api/";
const staticUrl = "http://localhost:8080/";
const serverVersion = "v1";

function displayFileName() {
    const fileInput = document.getElementById('file');
    const fileNameDisplay = document.getElementById('file-name');
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name; // 선택된 파일의 이름 표시
    } else {
        fileNameDisplay.textContent = '선택된 파일 없음';
    }
}

document.querySelector('.arrow-wrap').addEventListener('click', () => {
    window.location.href = `/board`;
});

document.querySelector('.submit-part .submit').addEventListener('click', async () => {
    // 필드 데이터 가져오기
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];

    // 유효성 검사
    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }
    if (title.length > 26) {
        alert('제목은 최대 26글자까지 가능합니다.');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append("category", "posts");
    formData.append("post_image", file);

    const getPostUrl = `${hostUrl}${serverVersion}/boards`;
    // POST 요청 보내기
    try {
        const response = await fetch(getPostUrl, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        const responseData = await response.json();

        if (response.status === 201) {
            const postID = responseData.data.post_id;
            console.log(responseData.data.post_id);
            alert('게시글이 성공적으로 작성되었습니다!');
            window.location.href = `/post/${postID}`;
        } else {
            handleError(responseData.message); // 에러 처리 함수
        }
    } catch (err) {
        alert('게시글 작성 중 오류가 발생했습니다.');
        console.error(err);
    }
});

// API 에러 메시지 처리 함수
function handleError(message) {
    switch (message) {
        case 'MISSING_FIELD':
            alert('필수 입력 항목이 누락되었습니다.');
            break;
        case 'INVALID_TITLE':
            alert('제목 조건에 맞지 않습니다.');
            break;
        case 'MISSING_SESSION':
            alert('세션 정보가 없습니다.');
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


document.addEventListener('DOMContentLoaded', async () => {
        displayFileName();
        loadProfile();
    }
);