var express = require("express");
const fs = require('fs');
const router = express.Router();
const path = require('path');


const multer  = require('multer');

const filePath = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, filePath)
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

const CheckDir = (req, res, next) => {
    try {
        fs.readdirSync(filePath);
    } catch (error) {
        console.log("폴더가 없으므로 생성합니다.");
        fs.mkdirSync(filePath);
    }
    next();
}

const upload = multer({ storage: storage });

router.get('/' , (req, res) => {
    res.end(`<!DOCTYPE html>
    <html>
      <body>
        <form action="/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="file" />
          <input type="submit" value="Upload" />
        </form>
      </body>
    </html>`)
});

router.post('/', CheckDir, upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file);
});

router.get('/delete/:filename', (req, res) => {
    const deletepath = path.join(filePath, req.params.filename);
    // Delete the file
    fs.unlink(deletepath, function(err){
        if(err){
            // Handle error, file not found etc.
            res.status(500).send("An error occurred while deleting the file.");
            console.log(err);
        } else {
            res.send(`${req.params.filename} was deleted.`);
        }
    });
});

router.get('/filelist', (req, res) => {
    
    fs.readdir(filePath, (err, files) => {
        if (err) {
            return res.status(500).send('An error occurred while retrieving files');
        }
        res.json(files);
    });
});

router.get('/download/:filename', (req, res) => {
    const downloadpath = path.join(filePath, req.params.filename);
    // Send the file for download
    res.download(downloadpath, req.params.filename, function(err){
        if (err){
            // Handle error, file not found etc.
            res.status(404).send("File not found.");
        }
    });
});


module.exports = router;