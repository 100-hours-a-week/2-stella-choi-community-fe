function toggleProfileDropdown(event) {
    const dropdown = document.getElementById('profile-dropdown');
    const isVisible = dropdown.style.display === 'block';

    document.querySelectorAll('.profile-dropdown').forEach(drop => drop.style.display = 'none');

    // 현재 드롭다운 토글
    if (!isVisible) {
        dropdown.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const profileImages = document.querySelector('.profile-user-img');

    // 프로필 드롭다운 토글
    profileImages.addEventListener('click', toggleProfileDropdown);

    const getLogoutUrl = `${hostUrl}${serverVersion}/users/logout`;
    // 메뉴 항목 클릭 이벤트
    document.querySelectorAll('.profile-dropdown div').forEach(menuItem => {
        menuItem.addEventListener('click', async function() {
            const url = menuItem.getAttribute('data-url');

            // 로그아웃 처리
            if (menuItem.classList.contains('logout')) {
                try {
                    const response = await fetch(getLogoutUrl, {
                        method: 'POST',
                        credentials: 'include',
                    });

                    const responseData = await response.json();
                    if(responseData.success) {
                        window.location.href = '/login';
                    }
                } catch (err) {
                    alert('로그아웃 중 오류가 발생했습니다.');
                    console.error(err);
                }
            } else if (url) {
                // URL이 있으면 해당 페이지로 이동
                window.location.href = url;
            }
        });
    });
});
