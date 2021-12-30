const router = require('express').Router();
const catchAsync = require('../Utils/catchAsync');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fileService = require('../Services/file.service');
const sendMail = require('../UtilServices/sendEmail');
const emailTemplate = require('../UtilServices/EmailTemplate');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null, uniqueName);
    }
});

let upload = multer({
    storage,
    limits: { fileSize: 1048576 }
}).single('myfile')

router.post('/', catchAsync(async (req, res) => {
    upload(req, res, async (error) => {
        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }
        if (error) {
            return res.status(500).json(error);
        }
        const savedFile = await fileService.saveFile({ fileName: req.file.filename, uuid: uuidv4(), path: req.file.path, size: req.file.size });
        return res.json({ file: `${process.env.ApplicationURL}/files/${savedFile.uuid}` })
    })
}));
router.get('/:uuid', catchAsync(async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const file = await fileService.findFileWithUuid(uuid);
        if (!file) {
            return res.render('download', { error: 'Something went wrong' });
        }
        res.render('download', {
            uuid: file.uuid,
            fileName: file.fileName,
            size: file.size,
            download: `${process.env.ApplicationURL}/download/files/${file.uuid}`
        })
    }
    catch (error) {
        return res.render('download', { error: 'Something went wrong' });
    }

}));
router.get('/files/:uuid', catchAsync(async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const file = await fileService.findFileWithUuid(uuid);
        if (!file) {
            return res.render('download', { error: 'Something went wrong' });
        }
        const filePath = path.join(__dirname, '..', file.path);
        res.download(filePath);
    }
    catch (error) {
        return res.render('download', { error: 'Something went wrong' });
    }
}));

router.post('/sendEmail', catchAsync(async (req, res) => {
    const { uuid, emailFrom, emailTo } = req.body;
    try {
        if (!uuid || !emailFrom || !emailTo) {
            return res.status(422).json({ "error": "All fields are required" })
        }
        const file = await fileService.findFileWithUuid(uuid);
        if (file.sender) {
            return res.status(422).json({ "error": "Email was already sent" })
        }
        await fileService.updateFile({ uuid: file.uuid, emailFrom, emailTo });

        sendMail({
            emailFrom: emailFrom, emailTo: emailTo, subject: "File sharing", text: `${emailFrom} shared a file with you`,
            html: emailTemplate({ emailFrom, downloadLink: `${process.env.ApplicationURL}/download/files/${file.uuid}` })
        })
        return res.status(200).json("Email sent successfully");
    }
    catch (error) {
        return res.render('download', { error: 'Something went wrong' });
    }
}));
module.exports = router;