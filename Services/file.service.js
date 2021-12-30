const mongoose = require('mongoose');
const File = require('../models/file.model');

const saveFile = async (params) => {
    return await File.create(params);
};
const findFileWithUuid = async (uuid) => {
    return await File.findOne({ uuid: uuid });
}
const updateFile = async ({ uuid, emailFrom, emailTo }) => {
    return await File.findOneAndUpdate({ uuid: uuid }, { sender: emailFrom, receiver: emailTo });
}
module.exports = {
    saveFile,
    findFileWithUuid,
    updateFile,
}

