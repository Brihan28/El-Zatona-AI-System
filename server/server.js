require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const connectDB = require("./config/db");

// =======================
// IMPORTS
// =======================
const createFileController = require("./controllers/fileController");
const createFileService = require("./services/fileService");

const createQuizController = require("./controllers/quizController");
const createStudyController = require("./controllers/studyplanController");
const createSummaryController = require("./controllers/summaryController");

const createAIService = require("./services/aiService");
const createQuizService = require("./services/quizService");
const createStudyService = require("./services/studyPlanner");
const createAttemptService = require("./services/attemptService"); 
const createQuizRoutes = require("./routes/quizRoutes");
const createStudyRoutes = require("./routes/studyPlanRoutes");
const createSummaryRoutes = require("./routes/summaryRoutes");
const createFileRoutes = require("./routes/fileRoutes");
const passport = require("passport");
const session = require("express-session");
require("./config/passport");

// normal routes
const authRoutes = require("./routes/auth");
const attemptRoutes = require("./routes/attemptRoutes");
const adminRoutes = require("./routes/AdminRoutes");

// middleware
const authMiddleware = require("./middleware/auth");
const upload = require("./middleware/upload");

const pdfParse = require("pdf-parse");

const app = express();

// =======================
// DB
// =======================
connectDB();

// =======================
// MIDDLEWARE
// =======================
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// =======================
// 🔥 DEPENDENCY INJECTION
// =======================

// base
const axiosInstance = axios.create();

// services
const aiService = createAIService(axiosInstance, {
  apiKey: process.env.OPENROUTER_API_KEY,
  baseUrl: "https://openrouter.ai/api/v1/chat/completions",
});

const quizService = createQuizService(aiService);
const studyService = createStudyService(aiService);
const fileService = createFileService();
const attemptService = createAttemptService(); 
const File = require("./models/File"); 


// controllers
const quizController = createQuizController(
  quizService,
  attemptService,
  fileService 
);

const studyController = createStudyController(studyService);
const summaryController = createSummaryController(aiService);
const fileController = createFileController(fileService, pdfParse);

// routes
const quizRoutes = createQuizRoutes(quizController, authMiddleware);
const studyRoutes = createStudyRoutes(studyController, authMiddleware);
const summaryRoutes = createSummaryRoutes(summaryController);

const fileRoutes = createFileRoutes(
  fileController,
  authMiddleware,
  upload
);

// =======================
// ROUTES
// =======================
app.use("/api/admin", adminRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/summaries", summaryRoutes);

// =======================
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// =======================
const PORT = 5000;
app.listen(PORT, () => console.log("Server running"));