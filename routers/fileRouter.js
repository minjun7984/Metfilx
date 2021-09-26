const express = require("express");
const multer = require('multer');
const router = express.Router();
const pool = require('../config/poolConfig');


const storage = multer.diskStorage({
	destination : function(req, file, cb) {
		if(
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
		file.mimetype == "image/jpg" || file.mimetype == "image/png" ||
		file.mimetype == "video/mp4" ||  file.mimetype == "video/avi" || file.mimetype == "video/mov" ||
		file.mimetype == "video/ogg" ||  file.mimetype == "video/flv" || file.mimetype == "video/mkv" 
	){
		cb(null, true);
	} else {
		cb(null, false);
		console.log("지원되지 않는 파일형식입니다.");
	};
};

var upload = multer({ storage : storage, fileFilter : fileFilter });

router.post('/', upload.any('fileUpload'), async(req, res) =>{
	console.log(req.files);
	let ext = req.files[0].mimetype.split('/')[1];
	let url = req.files[0].path;
	let type = req.files[0].mimetype;
	let status = '002';
	console.log(ext);
	console.log(url);
	console.log(type);
	console.log(status);
	const uploadQuery = "INSERT INTO file(file_ext,file_url,file_type,file_status) VALUES(?,?,?,?)";
	try{
		const [result] =await pool.query(uploadQuery,[
			ext,
			url,
			type,
			status
		]);
		res.status(200).json({result: "success"});
	} catch(error){
        console.error(error);
		res.status(503).json({ result : "fail", errorMsg: "서비스를 현재 이용할 수 없습니다." });
	}
});

module.exports = router;

