document.querySelector('.create-post-btn').addEventListener('click', () => {
    window.location.href = `/makepost`;
});

let offset = 0;
const limit = 10;
let isLoading = false;
let hasMoreData = true; // 데이터가 더 있을 때 true로 유지

async function loadData() {
    if (isLoading || !hasMoreData) return; // 데이터를 더 가져올 필요가 없으면 실행 안 함
    isLoading = true;
    console.log(offset, limit);

    const getBoardUrl = `${hostUrl}${serverVersion}/boards?offset=${offset}&limit=${limit}`;
    try {
        const response = await fetch(getBoardUrl, {
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

        if (data.length === 0) {
            console.log("더 이상 불러올 데이터가 없습니다.");
            hasMoreData = false; // 더 이상 데이터 없음
            return false;
        }

        await renderData(data);
        offset += limit;
    } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
    } finally {
        isLoading = false;
    }
}

const formatTime = async (stringDate) => {
    const date = new Date(stringDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}

async function renderData(data) {
    const postList = document.querySelector('.post-list');

    const postElements = await Promise.all(
        data.map(async (post) => {
            const formatNumber = num => num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
            const formattedTime = await formatTime(post.posted_time);

            const profileImage = staticUrl + post.user_profile;
            const postItem = document.createElement('div');
            postItem.classList.add('post-item');
            postItem.innerHTML = `
                <div class="post-header">
                    <span class="post-title">${post.title.length > 26 ? post.title.substring(0, 26) + '...' : post.title}</span>
                    <div class="info-part">
                        <div class="post-info">
                            <span class="like-info">좋아요 ${formatNumber(post.likes_count)}</span>
                            <span class="comment-info">댓글 ${formatNumber(post.comment_count)}</span>
                            <span class="view-info">조회수 ${formatNumber(post.view_count)}</span>
                        </div>
                        <span class="post-date">${formattedTime}</span>
                    </div> 
                </div>
                <hr class="border-line">
                <div class="writer-header">
                    <img src="${profileImage}" alt="${post.user_name}" loading="lazy" class="profile-user-img">
                    <span class="writer-info">${post.user_name}</span>
                </div>
            `;
            postItem.addEventListener('click', () => {
                window.location.href = `/post/${post.post_id}`;
            });
            return postItem;
        })
    );

    postElements.forEach(postItem => postList.appendChild(postItem));
}

const handleError = async (response) => {
    const responseBody = await response.json();

    switch (responseBody.message) {
        case "MISSING_FIELD":
            console.log("offset, limit 정보를 입력해주세요.");
            break;
        case "INVALID_FORMAT":
            console.log("offset, limit은 숫자로 입력해야 합니다.");
            break;
        case "INVALID_PASSWORD":
            alert("인증되지 않은 사용자입니다. 다시 로그인해주세요.");
            break;
        case "INTERNAL_SERVER_ERROR":
            alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            break;
        default:
            alert("알 수 없는 오류가 발생했습니다.");
    }
};

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

const renderProfile = async (data) => {
    const profileImage = document.querySelector('.profile-user-real-img');
    profileImage.src = data;
}

window.addEventListener("scroll", async() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        await loadData();
    }
});

// 초기 데이터 로드
document.addEventListener('DOMContentLoaded', async () => {
    loadData();
    loadProfile();
    }
);
