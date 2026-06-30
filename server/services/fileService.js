const File = require("../models/File");

const createFileService = () => ({
  createFile: (data) => File.create(data),

  getUserFiles: (userId) =>
    File.find({ user: userId }).sort({ uploadedAt: -1 }),

  getFileById: (id) => File.findById(id),

  deleteFile: (id, userId) =>
    File.findOneAndDelete({ _id: id, user: userId }),
});

module.exports = createFileService;