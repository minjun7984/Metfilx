# Metfilx
node.js

**파일업로드**

url: /file/{fileType} * fileType은 'IMAGE', 'VIDEO'만 올 수 있다. path - variable

method: POST

desc: 파일 업로드시 url의 path param부분에 이미지 업로드시 'IMAGE', 비디오 업로드시 'VIDEO'를 기입한다.  이미지를 업로드 한 경우에는 MIMETYPE 'jpg', 'png'인 경우만 허용하며 비디오를 업로드한 경우 MIMETYPE이 'mp4', 'avi', 'mov', 'ogg', 'flv', 'mkv'만 허용한다. 파일의 업로드 경로는 이미지는 'uploads/images', 비디오는 'uploads/videos'에 업로드한다. 업로드 이후 file db에 파일정보를 삽입한다.

file DB에 최초로 file_status를 '002'로 설정한다. 
params
- uploadFile(multipart-file, not null)
- 
response (with HTTP STATUS)

- 200, { result: "success", fileNo: (db에 등록된 파일번호) }
- 400, { result: "fail", errorMsg: (에러메세지)}
- [415](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415)


-2021/05/15

multer을 이용한 파일업로드 시스템 구현 multer에서 제공하는 stoarage와 filefilter을 이용해 확장자에 따른 저장 위치와
저장이 불가능한 파일을 분리함 

부족한 점
1. DB에넣는 작업 실패함
2. DB에 들어가지는 않는데 upload폴더에는 파일이 들어가는 현상 발생

어려웠던 점

1.postman으로 파일을 보냈을 때 MulterError: Unexpected field 에러가 계속 뜨는 현상 발생 upload.single() 부분을 upload.any()로 변경하니 
파일이 제대로 업로드가 되기 시작함

//2021-05/21/
DB에 넣기 성공 single()이 아니라 any()을 사용해줬기 때문에 req.files[]형태의 배열로 받아줘야했음

AJAX 요청부분을 작성했는데 작동하지 않음 수정예정..

오늘의 교훈 console을 찍어 에러를 찾자...컴퓨터는 거짓말을 안한다..
