function displayFileName() {
    const fileInput = document.getElementById('file');
    const fileNameDisplay = document.getElementById('file-name');
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name; // 선택된 파일의 이름 표시
    } else {
        fileNameDisplay.textContent = '선택된 파일 없음';
    }
}
