const express = require("express");
const {
    getHomePage
    , getLoginPage
    , getJoinPage
  } = require("../controllers/globalController")

const router = express.Router();

/**
 * 홈화면 요청처리
 */
 router.get("/", getHomePage);

/**
 * 로그인 페이지 요청처리
 */
 router.get("/login", getLoginPage);

/**
 * 회원가입 패이지 요청처리
 */
 router.get("/join", getJoinPage);

module.exports = router;