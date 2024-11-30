document.querySelector('.create-post-btn').addEventListener('click', () => {
    alert('게시물 작성 버튼이 클릭되었습니다.');
});

let offset = 0;
const limit = 10;
let isLoading = false;
let allData = [];

async function loadData() {
    if(isLoading) return;
    isLoading = true;

    try {
        if (allData.length === 0) {
            const response = await fetch('/data/boards/boards.json'); // 로컬 JSON 파일 경로
            if (!response.ok) {
                console.error("JSON 파일을 불러올 수 없습니다.");
                isLoading = false;
                return;
            }
            allData = await response.json();
        }

        const paginatedData = allData.slice(offset, offset + limit);
        if (paginatedData.length === 0) {
            console.log("더 이상 불러올 데이터가 없습니다.");
            isLoading = false;
            return;
        }

        renderData(paginatedData);
        offset += limit;
    } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
    } finally{
        isLoading = false;
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
                        <span class="like-info">좋아요 ${formatNumber(post.likes_count)}</span>
                        <span class="comment-info">댓글 ${formatNumber(post.comment_count)}</span>
                        <span class="view-info">조회수 ${formatNumber(post.view_count)}</span>
                    </div>
                    <span class="post-date">${post.posted_time}</span>
                </div> 
            </div>
            <hr class="border-line">
            <div class="writer-header">
                <img src="${post.user_profile}" alt="${post.user_name}">
                <span class="writer-info">${post.user_name}</span>
            </div>
        `;
        postList.appendChild(postItem);

        // 카드 클릭 시 상세 페이지로 이동 (예: 게시글 ID를 URL에 포함)
        postItem.addEventListener('click', () => {
            window.location.href = `/post/${post.post_id}`;
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
// document.addEventListener('DOMContentLoaded', () => {
//     fetch('/data/board.json')
//         .then(response => response.json())
//         .then(data => {
//             const postList = document.querySelector('.post-list');
//             data.forEach(post => {
//                 const formatNumber = num => num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;

//                 const postItem = document.createElement('div');
//                 postItem.classList.add('post-item');
//                 postItem.innerHTML = `
//                     <div class="post-header">
//                         <span class="post-title">${post.title.length > 26 ? post.title.substring(0, 26) + '...' : post.title}</span>
//                         <div class="info-part">
//                             <div class="post-info">
//                                 <span class="like-info">좋아요 ${formatNumber(post.like)}</span>
//                                 <span class="comment-info">댓글 ${formatNumber(post.comment)}</span>
//                                 <span class="view-info">조회수 ${formatNumber(post.view)}</span>
//                             </div>
//                             <span class="post-date">${post.date}</span>
//                         </div> 
//                     </div>
//                     <hr class="border-line">
//                     <div class="writer-header">
//                         <img src="${post.profileImage}" alt="${post.writer}">
//                         <span class="writer-info">${post.writer}</span>
//                     </div>
//                 `;
//                 postList.appendChild(postItem);

//                 // 카드 클릭 시 상세 페이지로 이동 (예: 게시글 ID를 URL에 포함)
//                 postItem.addEventListener('click', () => {
//                     window.location.href = `/post/${post.id}`;
//                 });
//             });
//         })
//         .catch(error => console.error('Error loading JSON data:', error));
// });
