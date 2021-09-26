const express = require("express");
const joiValidation = require("express-joi-validation")
const {
  joinUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");
const userValidationErrorHandler = require("../middlewares/userErrorHandler");
const {
  loginBodySchema,
  joinBodySchema
} = require("../validations/userValidations");

const router = express.Router();
const validator = joiValidation.createValidator({
  passError: true
}); // validaor가 제공하는 기본 에러처리 대신 커스텀한 예외처리 미들웨어를 사용하기위해 passError를 설정한다. 

/**
 * 회원가입 요청처리
 */
router.post("/join", validator.body(joinBodySchema), joinUser);

/**
 * 로그인 요청처리
 */
router.post("/login", validator.body(loginBodySchema),loginUser);

/**
 * 로그아웃 요청처리
 */
router.get("/logout", logoutUser);

/**
 * userController 에외 핸들러 
 */
router.use(userValidationErrorHandler);

module.exports = router;