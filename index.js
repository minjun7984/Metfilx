const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require('fs');
const expressSession = require('cookie-parser');
const multer = require('multer')
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'jung6710',
    database : 'metflix'
});

connection.connect(() => {
    console.log("DB Connected");
});

const app = express();
const PORT = 7000;

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(
	session({
	secret : "adsfsd@!2asdfa@#adaf",
	resave :false,
	saveUninitialized : false,
	})
);
//회원가입 페이지 요청
app.get("/join", (req, res) => {
	res.render("join");
});

//로그인 후 페이지 요청
app.get("/", (req, res) => {
	const { user } = req.session;
	res.render("home", { user });
});


//로그인 페이지 요청
app.get("/login",(_, res) => {
	res.render("login");
})
//로그아웃
app.get("/logout", (req, res) => {
	delete req.session.user;
	res.redirect("/")
})
//유저 회원가입
app.post("/user", (req, res) => {
	const { id, password, nickname } = req.body;

	// 유효성 검증
	if (
		!id ||
		!password ||
		!nickname ||
		id.trim().length <= 0 ||
		password.trim().length <= 0 ||
		nickname.trim().length <= 0
	) {
		return res.render("join", {
			flashMessage: "회원정보를 정확히 입력해주세요.",
		});
	}

    connection.query(
		"INSERT INTO user(user_id, user_password, user_nickname) VALUES(?, ?, ?)",
		[id, password, nickname],
		(err) => {
			if (err) {
				console.error(err);
				if (err.code === "ER_DUP_ENTRY") {
					return res.render("join", {
						flashMessage : "이미 가입된 아이디가 있습니다.",
					});
				}
				return res.render("join", {
					flashMessage : "회원가입에 실패했습니다.",
				});
			}
			return res.redirect("/login");
		}
	);
});

app.post("/user/login", (req, res) =>{
	const { id, password } = req.body;
	if(
		!id ||
		!password ||
		id.trim().length <= 0 ||
		password.trim().length <= 0 
	) {
		return res.render("login", {
			flashMessage : "로그인 정보를 정확히 입력하세요",
		});
	}

	connection.query(
		"SELECT user_id, user_password, user_nickname FROM user WHERE user_id = ?",
		[id],
		(err, rows) => {
			const user = rows[0];
			if(err) {
				console.error(err);
				return res.render("login",{
					flashMessage : "현재 이용이 불가능합니다."
				});
			}
			if(user.user_password!== password){
				return res.render("login",{
					flashMessage: "로그인에 실패했습니다 비밀번호와 아이디를 다시 입력해주세요.",
				});
			}
			req.session.user = user;
			res.redirect("/")
		}
	);
});

const storage = multer.diskStorage({
	destination : function(req, file, cb) {
		if(
			file.mimetype == "image/jpeg" || 
			file.mimetype == "image/jpg" || 
			file.mimetype == "image/png"
			){
			console.log("이미지 파일입니다");
			cb(null,'upload/image');
		} else if(
			file.mimetype == "video/mp4" ||
			file.mimetype == "video/avi" ||
			file.mimetype == "video/mov" ||
			file.mimetype == "video/ogg" ||
			file.mimetype == "video/flv" ||
			file.mimetype == "video/mkv" 
			){
			console.log("video 파일입니다");
			cb(null,'upload/video');
		}
	},
	filename : function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname)
	}
});

const fileFilter = (req, file, cb) => {
	if(
		file.mimetype == "image/jpeg"||  file.mimetype == "image/jpg" || file.mimetype == "image/png" ||
		file.mimetype == "video/mp4" ||  file.mimetype == "video/avi" || file.mimetype == "video/mov" ||
		file.mimetype == "video/ogg" ||  file.mimetype == "video/flv" || file.mimetype == "video/mkv" 
	){
		cb(null, true);
	} else {
		cb(null, false);
	}
}

var upload = multer({ storage : storage, fileFilter : fileFilter });

app.post('/file/', upload.any('fileupload'), (req, res) =>{
	let ext = req.file.originalname;
	let url = req.file.path;
	let type = req.file.mimetype;
	let status = '002';
	connection.query(
		"INSERT INTO file(file_ext,file_url,file_type,file_status) VALUES(?,?,?,?)",
		[ext,url,type,status],
		(err) => {
			if(err) {
				res.status(400).json({ result : "fail"});			
			} else {
				res.status(200).json({ result : "success"});
			}
		}
)});



		

app.listen(PORT,() => {
    console.log(`Server Listen : http://localhost:${PORT}`);
});