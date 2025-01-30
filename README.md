## 서비스 개요

> 프로야구 팬들을 위한 커뮤니티 MOA 입니다. <br> 1년 144경기의 즐거움을 공유하고 수집할 수 있는 공간입니다!
> 

## Guide

### Requirements

- NodeJS
- NPM

### Installation

```bash
git clone https://github.com/100-hours-a-week/2-stella-choi-community-fe.git
cd 2-stella-choi-community-fe.git
```

### Run

1. Backend 서버 먼저 띄우기
    - https://github.com/100-hours-a-week/2-stella-choi-community-be 참고
2. 순서대로 명령어 실행

```bash
npm install
npm start
```

## Technical Stack

**Environment**

<img src="https://img.shields.io/badge/-WebStorm-%23000000?style=for-the-badge&logo=WebStorm&logoColor=white"> <img src="https://img.shields.io/badge/-Github-%23000000?style=for-the-badge&logo=Github&logoColor=white">

**Config**

<img src="https://img.shields.io/badge/-npm-23CB3837?style=for-the-badge&logo=npm&logoColor=white">

**Development**

<img src="https://img.shields.io/badge/-Node.js-%235FA04E?style=for-the-badge&logo=Node.js&logoColor=black"> <img src="https://img.shields.io/badge/-JavaScript-%23F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black"> <img src="https://img.shields.io/badge/-html5-%E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/-css-663399?style=for-the-badge&logo=css&logoColor=white">

**Deploy**

<img src="https://img.shields.io/badge/-githubactions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white"> <img src="https://img.shields.io/badge/-docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">

## Architecture

```jsx
 📦community-fe
 ┣ 📂public
 ┃ ┣ 📂board
 ┃ ┃ ┣ 📜board.css
 ┃ ┃ ┣ 📜board.html
 ┃ ┃ ┗ 📜board.js
 ┃ ┣ 📂data
 ┃ ┃ ┣ 📜board-page1.json
 ┃ ┃ ┣ 📜board-page2.json
 ┃ ┃ ┗ 📜board-page3.json
 ┃ ┣ 📂dropdown
 ┃ ┃ ┣ 📜profileDropdown.css
 ┃ ┃ ┗ 📜profileDropdown.js
 ┃ ┣ 📂editpassword
 ┃ ┃ ┣ 📜editpassword.css
 ┃ ┃ ┗ 📜editpassword.html
 ┃ ┣ 📂editpost
 ┃ ┃ ┣ 📜editpost.css
 ┃ ┃ ┣ 📜editpost.html
 ┃ ┃ ┗ 📜editpost.js
 ┃ ┣ 📂editprofile
 ┃ ┃ ┣ 📜editprofile.css
 ┃ ┃ ┣ 📜editprofile.html
 ┃ ┃ ┗ 📜editprofile.js
 ┃ ┣ 📂images
 ┃ ┃ ┣ 📜example.jpg
 ┃ ┃ ┣ 📜profile.png
 ┃ ┃ ┗ 📜userprofile.png
 ┃ ┣ 📂join
 ┃ ┃ ┣ 📜join.css
 ┃ ┃ ┣ 📜join.html
 ┃ ┃ ┗ 📜join.js
 ┃ ┣ 📂login
 ┃ ┃ ┣ 📜login.css
 ┃ ┃ ┣ 📜login.html
 ┃ ┃ ┗ 📜login.js
 ┃ ┣ 📂makepost
 ┃ ┃ ┣ 📜makepost.css
 ┃ ┃ ┣ 📜makepost.html
 ┃ ┃ ┗ 📜makepost.js
 ┃ ┗ 📂post
 ┃ ┃ ┣ 📜post.css
 ┃ ┃ ┣ 📜post.html
 ┃ ┃ ┗ 📜post.js
 ┣ 📂routes
 ┃ ┗ 📜mainRoutes.js
 ┣ 📜.gitignore
 ┣ 📜README.md
 ┣ 📜index.js
 ┣ 📜package-lock.json
 ┗ 📜package.json

```

## Layout & Feature
- 로그인 화면

![image](https://github.com/user-attachments/assets/3a5b9f85-00f3-4b27-a4f1-0dada8ef70a7)
- 회원가입 화면

![image](https://github.com/user-attachments/assets/6e4a6fec-86f0-4f1d-aa2c-1fd0e6171277)
- 게시판 화면

![image](https://github.com/user-attachments/assets/0680001f-7980-452c-9eb7-7681b90a8df9)
- 게시판 화면

![image](https://github.com/user-attachments/assets/80b2f12a-56a4-4bfa-825b-93bfed4d39ab)
- 게시글 작성 화면

![image](https://github.com/user-attachments/assets/18e9c91f-b342-4de2-94d0-7dc383987c76)
- 게시글 수정 화면

![image](https://github.com/user-attachments/assets/e23dff1d-3f63-4a18-8f4f-e48632edb63d)
- 게시글 상세 화면(댓글, 좋아요, 조회수 확인 가능)

![image](https://github.com/user-attachments/assets/53bc31bd-9b37-4721-862f-86a8ec8e8970)
- 댓글 및 게시글 삭제시 뜨는 모달창

![image](https://github.com/user-attachments/assets/f42b5462-efff-43a4-99f8-b113d2600b00)
- 좋아요 클릭시 화면

![image](https://github.com/user-attachments/assets/e2652ded-6134-4c94-8809-d452588c88cf)
- 회원정보 수정 화면

![image](https://github.com/user-attachments/assets/442d04bb-b5ec-4dc8-99ed-108914808625)
- 비밀번호 수정 화면

![image](https://github.com/user-attachments/assets/cf6ad1cf-f406-4857-9c41-fbed82934295)
