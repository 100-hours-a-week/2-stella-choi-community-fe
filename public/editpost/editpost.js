const path = window.location.pathname;
const postID = path.split('/')[2];

function displayFileName() {
    const fileInput = document.getElementById('file');
    const fileNameDisplay = document.getElementById('file-name');
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name; // 선택된 파일의 이름 표시
    } else {
        fileNameDisplay.textContent = '선택된 파일 없음';
    }
}

document.querySelector('.submit-part').addEventListener('click', () => {
    window.location.href = `/post/${postID}`;
});

async function loadData() {
    try {
        const response = await fetch(`/data/boards/${postID}.json`); // 로컬 JSON 파일 경로
        const jsonData = await response.json();
        console.log(jsonData);
        renderPost(jsonData);
    } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
    } 
}

function renderPost(data){
    document.querySelector('.input-form').value = data.title;
    document.querySelector('.text-form').textContent = data.content;
    const imageName = data.image.split('/').pop();
    document.getElementById('file-name').textContent = imageName;
}

document.addEventListener('DOMContentLoaded', loadData);