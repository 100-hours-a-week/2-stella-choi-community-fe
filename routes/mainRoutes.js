// routes/mainRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login/login.html'));
});

router.get('/board', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/board/board.html'));
});

router.get('/join', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/join/join.html'));
});

router.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/post/post.html'));
});

router.get('/makepost', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/makepost/makepost.html'));
});

router.get('/editpost', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/editpost/editpost.html'));
});

router.get('/editprofile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/editprofile/editprofile.html'));
});

router.get('/editpassword', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/editpassword/editpassword.html'));
});


module.exports = router;
