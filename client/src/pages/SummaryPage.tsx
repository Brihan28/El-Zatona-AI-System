import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, FileText } from "lucide-react";

interface SummaryLocationState {
  extractedText?: string;
  title?: string;
  fileId?: string;
}

const SUMMARY_API_URL = "http://localhost:5000/api/summaries/generate";
const FILES_API_URL = "http://localhost:5000/api/files";

const SummaryPage = () => {
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lectureTitle, setLectureTitle] = useState("Lecture Notes");
  const [extractedText, setExtractedText] = useState("");

  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState("");

  const location = useLocation();
  const state = (location.state ?? {}) as SummaryLocationState;

  // =========================
  // 📂 FETCH FILES
  // =========================
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get(FILES_API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFiles(res.data);
      } catch (err) {
        console.error("Fetch files error", err);
      }
    };
    fetchFiles();
  }, []);

  // =========================
  // 📄 LOAD FILE (FIXED ✅)
  // =========================
  useEffect(() => {
    if (!selectedFile) return;

    const loadFile = async () => {
      try {
        const res = await axios.get(
          `${FILES_API_URL}/${selectedFile}/details`, // ✅ FIXED
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setExtractedText(res.data.extractedText || "");
        setLectureTitle(res.data.filename || "Lecture Notes");
      } catch (err) {
        console.error("Load file error", err);
        setError("Failed to load file");
      }
    };

    loadFile();
  }, [selectedFile]);

  // =========================
  // 🧠 FALLBACK
  // =========================
  useEffect(() => {
    if (state.extractedText?.trim()) {
      setExtractedText(state.extractedText);
      setLectureTitle(state.title || "Lecture Notes");
    }
  }, [state]);

  // =========================
  // 🚀 STREAMING SUMMARY
  // =========================
  const generateSummary = async () => {
    if (!extractedText.trim()) {
      setError("No extracted PDF text found.");
      return;
    }

    setSummary("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(SUMMARY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          text: extractedText,
          type: length,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let result = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        result += chunk;

        setSummary(result);
      }
    } catch (err) {
      console.error(err);
      setError("Streaming failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="AI Summary"
      subtitle="AI-generated lecture summaries"
    >
      <div className="w-full space-y-6">

        {/* TOP BAR */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">

            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>{lectureTitle}</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">

              <Select onValueChange={setSelectedFile}>
                <SelectTrigger className="w-[200px]">
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

              <div className="flex border rounded-lg overflow-hidden">
                {(["short", "medium", "long"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={`px-3 py-1.5 text-sm ${
                      length === l
                        ? "bg-primary text-white"
                        : "bg-muted"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <Button onClick={generateSummary} disabled={loading}>
                <RefreshCw
                  className={`mr-1 h-4 w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                {summary ? "Regenerate" : "Generate"}
              </Button>
            </div>
          </div>
        </Card>

        {/* RESULT */}
        <Card className="p-8">
          <div className="flex gap-2 mb-4">
            <Badge>AI</Badge>
            <Badge variant="outline">{length}</Badge>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {!!summary && (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {summary}
              {loading && <span className="animate-pulse">|</span>}
            </div>
          )}

          {!summary && !loading && (
            <p className="text-sm text-muted-foreground">
              Select a file and generate summary
            </p>
          )}

          {loading && !summary && (
            <p className="text-sm text-primary animate-pulse">
              AI is thinking...
            </p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SummaryPage;