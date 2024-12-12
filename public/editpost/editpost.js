const hostUrl = "http://localhost:8080/api/";
const staticUrl = "http://localhost:8080/";
const serverVersion = "v1";


const path = window.location.pathname;
const postID = path.split('/')[2];
let existingImageFile = null;

function displayFileName() {
    const fileInput = document.getElementById('file');
    const fileNameDisplay = document.getElementById('file-name');
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name; // 선택된 파일의 이름 표시
    } else {
        fileNameDisplay.textContent = '선택된 파일 없음';
    }
}

// API 에러 메시지 처리 함수
function handleError(message) {
    switch (message) {
        case 'MISSING_FIELD':
            alert('필수 입력 항목이 누락되었습니다.');
            break;
        case 'INVALID_FORMAT':
            alert('게시판 ID는 숫자여야 합니다');
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

        existingImageFile = await urlToFile(staticUrl + data.post_image, 'existing_image.jpg');

        await renderPost(data);
    } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
    } 
}

function renderPost(data){
    document.querySelector('.input-form').value = data.title;
    document.querySelector('.text-form').textContent = data.content;
    const imageName = data.post_image.split('/').pop();
    document.getElementById('file-name').textContent = imageName;
}

async function urlToFile(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
}

document.querySelector('.submit-part .submit').addEventListener('click', async () => {
    // 필드 데이터 가져오기
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const fileInput = document.getElementById('file');

    // 유효성 검사
    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }
    if (title.length > 26) {
        alert('제목은 최대 26글자까지 가능합니다.');
        return;
    }

    const fileToUpload = fileInput.files[0] || existingImageFile;


    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append("category", "posts");
    formData.append("post_image", fileToUpload);

    const putPostUrl = `${hostUrl}${serverVersion}/boards/${postID}`;

    try {
        const response = await fetch(putPostUrl, {
            method: 'PUT',
            credentials: 'include',
            body: formData
        });

        const responseData = await response.json();

        if (response.status === 200) {
            alert('게시글이 성공적으로 수정되었습니다!');
            window.location.href = `/post/${postID}`;
        } else {
            handleError(responseData.message); // 에러 처리 함수
        }
    } catch (err) {
        alert('게시글 작성 중 오류가 발생했습니다.');
        console.error(err);
    }
});


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
        loadData();
        loadProfile();
    }
);