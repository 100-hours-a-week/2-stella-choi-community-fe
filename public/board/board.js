document.querySelector('.create-post-btn').addEventListener('click', () => {
    window.location.href = `/makepost`;
});

let page = 1; // 시작 페이지

async function loadData() {
    try {
        const response = await fetch(`/data/board-page${page}.json`); // 페이지 번호에 따라 파일 요청
        if (!response.ok) {
            console.log("더 이상 불러올 데이터가 없습니다.");
            return;
        }
        const data = await response.json();
        renderData(data); // 데이터를 화면에 표시
        page++; // 다음 페이지 준비
    } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
    }
}

function renderData(data){
    const postList = document.querySelector('.post-list');
    data.forEach(post => {
        const formatNumber = num => num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;

        const postItem = document.createElement('div');
        postItem.classList.add('post-item');
        postItem.innerHTML = `
            <div class="post-header">
                <span class="post-title">${post.title.length > 26 ? post.title.substring(0, 26) : post.title}</span>
                <div class="info-part">
                    <div class="post-info">
                        <span class="like-info">좋아요 ${formatNumber(post.like)}</span>
                        <span class="comment-info">댓글 ${formatNumber(post.comment)}</span>
                        <span class="view-info">조회수 ${formatNumber(post.view)}</span>
                    </div>
                    <span class="post-date">${post.date}</span>
                </div> 
            </div>
            <hr class="border-line">
            <div class="writer-header">
                <img src="${post.profileImage}" alt="${post.writer}">
                <span class="writer-info">${post.writer}</span>
            </div>
        `;
        postList.appendChild(postItem);

        // 카드 클릭 시 상세 페이지로 이동 (예: 게시글 ID를 URL에 포함)
        postItem.addEventListener('click', () => {
            window.location.href = `/post`;
        });
    });
}

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadData();
    }
});

// 초기 데이터 로드
document.addEventListener('DOMContentLoaded', loadData);
