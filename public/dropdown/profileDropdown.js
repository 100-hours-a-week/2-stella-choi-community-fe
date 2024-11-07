function toggleProfileDropdown(event) {
    const dropdown = document.getElementById('profile-dropdown');
    const isVisible = dropdown.style.display === 'block';

    document.querySelectorAll('.profile-dropdown').forEach(drop => drop.style.display = 'none');

    // 현재 드롭다운 토글
    if (!isVisible) {
        dropdown.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const profileImages = document.querySelector('.profile-user-img');

    profileImages.addEventListener('click', toggleProfileDropdown);


    document.querySelectorAll('.profile-dropdown div').forEach(menuItem => {
        menuItem.addEventListener('click', function() {
            const url = menuItem.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
    });
});