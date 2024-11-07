document.querySelector('.arrow-wrap').addEventListener('click', () => {
    window.location.href = `/board`;
});

const path = window.location.pathname;
const postid = path.split('/').pop(); 

async function fetchPostData(postid) {
    console.log(postid);
    try {
        const response = await fetch(`/data/post-${postid}.json`);
        const postData = await response.json();
        displayPost(postData);
    } catch (error) {
        console.error("Failed to fetch post data:", error);
    }
}

function displayPost(data){
    const postContent = document.querySelector('post-section');
    postContent.innerHTML = `
                <div class="post-info-part">
                    <p class="post-title">${data.title}</p>
                    <div class="post-author-info">
                        <div class="left-section">
                            <div class="author-profile">
                                <img src="${data.authorProfile}" alt="profile-user-img" class="profile-user-real-img">
                            </div>
                            <span class="author-name">${data.author}</span>
                            <span class="post-date">${data.date}</span>
                        </div>
                        <div class="info-update-part">
                            <button class="edit-button">
                                <span>수정</span>
                            </button>
                            <button class="delete-button">삭제</button>
                        </div>
                    </div>
                </div>
                <hr class="partition">
    
                <div class="post-content-info">
                    <div class="post-image-part">
                        <img src="${data.image}" class="post-image">
                    </div>
                    <div class="post-text">
                        <span class="text">
                            ${data.content}
                        </span>
                    </div>
                    <div class="post-stats">
                        <div class="stat">
                            <span class="stat-num">${data.like}</span>
                            <p class="stat-info">좋아요수</p>
                        </div>
                        <div class="stat">
                            <span class="stat-num">${data.view}</span>
                            <p class="stat-info">조회수</p>
                        </div>
                        <div class="stat">
                            <span class="stat-num">${data.comment}</span>
                            <p class="stat-info">댓글</p>
                        </div>
                    </div>
                </div>
    `
}

fetchPostData(postid);