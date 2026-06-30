import { useState, useEffect } from "react";
import axios from "axios";

import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CheckCircle2, XCircle, Send } from "lucide-react";

interface Question {
  question: string;
  options?: string[];
  answer: string;
  type: "mcq" | "tf" | "short";
}

const QuizPage = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [type, setType] = useState<"mcq" | "tf" | "short">("mcq");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  // 🔥 HISTORY
  const [attempts, setAttempts] = useState<any[]>([]);
  const [activeAttempt, setActiveAttempt] = useState<any>(null);

  // =========================
  // 📂 FETCH
  // =========================
useEffect(() => {
  fetchFiles();
  fetchAttempts();

  // ✅ LOAD SELECTED ATTEMPT
  const saved = localStorage.getItem("selectedAttempt");
  if (saved) {
    try {
      setActiveAttempt(JSON.parse(saved));
      localStorage.removeItem("selectedAttempt"); // optional
    } catch (e) {
      console.error("Invalid attempt data");
    }
  }
}, []);

  const fetchFiles = async () => {
    const res = await axios.get("http://localhost:5000/api/files", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setFiles(res.data);
  };

  const fetchAttempts = async () => {
    const res = await axios.get("http://localhost:5000/api/attempts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setAttempts(res.data);
  };

  // =========================
  // 🎯 GENERATE
  // =========================
const generateQuiz = async () => {
  if (!selectedFile) return alert("Select a file first");

  try {
    const res = await axios.post(
      `http://localhost:5000/api/quiz/${selectedFile}`,
      { type },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!res.data || !res.data.questions) {
      console.error("BAD RESPONSE:", res.data);
      return;
    }

    const fixedQuestions = res.data.questions.map((q: any) => ({
      ...q,
      type: res.data.type,
    }));

    setQuestions(fixedQuestions);
    setAnswers({});
    setSubmitted(false);
    setResult(null);

  } catch (err) {
    console.error("QUIZ ERROR:", err);
  }
};
  // =========================
  // 📝 SUBMIT (🔥 FIXED)
  // =========================
  const handleSubmit = async () => {
    const res = await axios.post(
      `http://localhost:5000/api/quiz/submit/${selectedFile}`,
      {
        answers: questions.map((_, i) => answers[i] || ""),
        questions, // 🔥 IMPORTANT
        type, // 🔥 IMPORTANT
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setResult(res.data);
    setSubmitted(true);

    fetchAttempts(); // refresh history
  };

  const setAnswer = (index: number, val: string) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [index]: val }));
    }
  };

  // =========================
  // 🔥 FULL SCREEN ATTEMPT
  // =========================
  if (activeAttempt) {
    return (
      <DashboardLayout title="Quiz Attempt" subtitle="Full Review">
        <Button onClick={() => setActiveAttempt(null)}>← Back</Button>

        {/* SCORE */}
        <Card className="p-6 text-center mt-4">
          <p className="text-2xl font-bold">
            {activeAttempt.score}/{activeAttempt.total}
          </p>
          <p>{activeAttempt.percentage.toFixed(0)}%</p>
        </Card>

        {/* QUESTIONS */}
        <div className="space-y-4 mt-4">
          {activeAttempt.questions.map((q: any, i: number) => {
            const userAnswer = activeAttempt.answers[i] || "";

            const isCorrect =
              userAnswer.toLowerCase().trim() ===
              q.answer.toLowerCase().trim();

            return (
              <Card key={i} className="p-5">
                <p className="font-medium mb-2">{q.question}</p>

                {/* OPTIONS */}
                {q.options?.length > 0 && (
                  <div className="text-sm space-y-1">
                    {q.options.map((opt: string) => (
                      <p key={opt}>• {opt}</p>
                    ))}
                  </div>
                )}

                {/* USER ANSWER */}
                <p className="mt-2 text-sm">
                  Your answer:{" "}
                  <span
                    className={
                      isCorrect ? "text-green-500" : "text-red-500"
                    }
                  >
                    {userAnswer || "No answer"}
                  </span>
                </p>

                {/* CORRECT */}
                <p className="text-xs text-muted-foreground">
                  Correct: {q.answer}
                </p>
              </Card>
            );
          })}
        </div>
      </DashboardLayout>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================
  return (
    <DashboardLayout
      title="Quiz"
      subtitle="Generate quizzes from your files"
    >
      <div className="space-y-6">

        {/* CREATE */}
        <Card className="p-6 space-y-4">
          <h3>Create Quiz</h3>

          <Select onValueChange={setSelectedFile}>
            <SelectTrigger>
              <SelectValue placeholder="Select file" />
            </SelectTrigger>
            <SelectContent>
              {files.map((f) => (
                <SelectItem key={f._id} value={f._id}>
                  {f.filename}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => setType(v as any)} defaultValue="mcq">
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mcq">MCQ</SelectItem>
              <SelectItem value="tf">True/False</SelectItem>
              <SelectItem value="short">Short</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={generateQuiz}>Generate Quiz</Button>
        </Card>

        {/* RESULT */}
        {submitted && result && (
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold">
              {result.correct}/{result.total}
            </p>
            <p>{result.percentage.toFixed(0)}%</p>
          </Card>
        )}

        {/* QUESTIONS */}
        {questions.map((q, i) => {
          const userAnswer = answers[i] || "";

          return (
            <Card key={i} className="p-6">
              <p className="mb-2">{q.question}</p>

              {q.type === "mcq" && (
                <RadioGroup
                  value={userAnswer}
                  onValueChange={(v) => setAnswer(i, v)}
                >
                  {q.options?.map((opt) => (
                    <div key={opt} className="flex gap-2">
                      <RadioGroupItem value={opt} id={opt} />
                      <Label>{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {q.type === "tf" && (
                <RadioGroup
                  value={userAnswer}
                  onValueChange={(v) => setAnswer(i, v)}
                >
                  {["True", "False"].map((opt) => (
                    <div key={opt} className="flex gap-2">
                      <RadioGroupItem value={opt} id={opt} />
                      <Label>{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {q.type === "short" && (
                <Input
                  value={userAnswer}
                  onChange={(e) => setAnswer(i, e.target.value)}
                />
              )}
            </Card>
          );
        })}

        {/* SUBMIT */}
        {questions.length > 0 && !submitted && (
          <Button onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Submit
          </Button>
        )}

        {/* HISTORY */}
        <Card className="p-6">
          <h3 className="mb-4">Your Attempts</h3>

          {attempts.map((a, i) => (
            <div
              key={i}
              onClick={() => setActiveAttempt(a)}
              className="p-3 mb-3 border rounded-lg cursor-pointer flex justify-between hover:bg-muted"
            >
              <div>
                <p>{a.file?.filename || "Quiz"}</p>
                <p className="text-xs">
                  {new Date(a.createdAt).toDateString()}
                </p>
              </div>

              <Badge>
                {a.score}/{a.total}
              </Badge>
            </div>
          ))}
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default QuizPage;