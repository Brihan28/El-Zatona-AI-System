const express = require("express");

module.exports = (fileController, authMiddleware, upload) => {
  const router = express.Router();

  // 📤 Upload
  router.post(
    "/upload",
    authMiddleware,
    upload.single("file"),
    fileController.uploadFile
  );

  // 📂 Get all files
  router.get("/", authMiddleware, fileController.getUserFiles);

  // 📄 VIEW FILE (PDF)
  router.get("/:id", authMiddleware, fileController.getFileBinary);

  // 📄 DETAILS
  router.get("/:id/details", authMiddleware, fileController.getFileById);

  // 🗑 DELETE
  router.delete("/:id", authMiddleware, fileController.deleteFile);

  return router;
};