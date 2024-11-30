document.querySelector('.arrow-wrap').addEventListener('click', () => {
    window.location.href = `/board`;
});

document.querySelector('.edit-button').addEventListener('click', () => {
    window.location.href = `/editpost`;
});

// 데이터 로딩 및 출력

async function loadData() {
    try {
        const path = window.location.pathname;
        const postID = path.split('/')[2];
        console.log(postID);    
        const response = await fetch(`/data/boards/${postID}.json`); // 로컬 JSON 파일 경로
        const jsonData = await response.json();
        console.log(jsonData);
        renderPost(jsonData);
    } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
    } 
}

function renderPost(data) {
    document.querySelector('.post-title').textContent = data.title;
    document.querySelector('.author-name').textContent = data.user_name;
    document.querySelector('.profile-user-real-img').src = data.user_profile;
    document.querySelector('.post-date').textContent = data.date;
    document.querySelector('.post-text .text').textContent = data.content;
    document.querySelector('.post-image').src = data.image;
    document.querySelectorAll('.stat-num')[0].textContent = data.likes_count;
    document.querySelectorAll('.stat-num')[1].textContent = data.view_count;
    document.querySelectorAll('.stat-num')[2].textContent = data.comment_count;

    const commentSection = document.querySelector('.comment-part');
    commentSection.innerHTML = ''; 
    data.comments.forEach(comment => {
        const commentHTML = `
            <div class="comment-check-section">
                <div class="comment-info-part">
                <div class="comment-info">
                    <div class="profile-user-img">
                    <img src="${comment.comment_writer_profile}" alt="profile-user-img" class="profile-user-real-img">
                    </div>
                    <span class="comment-author">${comment.comment_writer}</span>
                    <span class="comment-date">2021-01-01 00:00:00</span>
                </div>
                <div class="comment-content">
                    <span class="comment-data">${comment.comment_data}</span>
                </div>
                </div>
                <div class="comment-controls">
                <button class="edit-button">수정</button>
                <button class="delete-button" id="comment-delete">삭제</button>
                </div>
            </div>`;
        commentSection.insertAdjacentHTML('beforeend', commentHTML);
    });
}

// 초기 데이터 로드
document.addEventListener('DOMContentLoaded', loadData);
