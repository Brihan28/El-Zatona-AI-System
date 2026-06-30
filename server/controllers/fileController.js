const createFileController = (fileService, pdfParser) => ({
  // =========================
  // 📤 UPLOAD
  // =========================
  uploadFile: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ error: "Only PDF files allowed" });
      }

      const data = await pdfParser(req.file.buffer);

      if (!data.text || !data.text.trim()) {
        return res.status(400).json({ error: "No text found in PDF" });
      }

      const saved = await fileService.createFile({
        user: req.user, // ✅ STRING
        filename: req.file.originalname,
        fileData: req.file.buffer,
        contentType: req.file.mimetype,
        extractedText: data.text.trim(),
      });

      res.json(saved);
    } catch (err) {
      console.error("UPLOAD ERROR:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // =========================
  // 📂 GET USER FILES
  // =========================
  getUserFiles: async (req, res) => {
    try {
      const files = await fileService.getUserFiles(req.user); // ✅ STRING
      res.json(files);
    } catch (err) {
      console.error("GET FILES ERROR:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // =========================
  // 📄 GET FILE DETAILS
  // =========================
  getFileById: async (req, res) => {
    try {
      const file = await fileService.getFileById(req.params.id);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      res.json({
        _id: file._id,
        filename: file.filename,
        extractedText: file.extractedText,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // =========================
  // 📄 VIEW PDF (🔥 FIX)
  // =========================
  getFileBinary: async (req, res) => {
    try {
      const file = await fileService.getFileById(req.params.id);

      if (!file) {
        return res.status(404).send("Not found");
      }

      res.set("Content-Type", file.contentType);
      res.send(file.fileData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // =========================
  // 🗑 DELETE
  // =========================
  deleteFile: async (req, res) => {
    try {
      await fileService.deleteFile(req.params.id, req.user);
      res.json({ message: "File deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
});

module.exports = createFileController;