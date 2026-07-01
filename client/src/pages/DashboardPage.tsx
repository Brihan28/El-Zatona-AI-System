import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  FileText,
  BookOpen,
  ClipboardCheck,
  CalendarDays,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardPage = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]); // 🔥 NEW

  useEffect(() => {
    fetchData();
  }, []);
const fetchData = async () => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [filesRes, plansRes, attemptsRes] = await Promise.all([
      axios.get("http://localhost:5000/api/files", { headers }),
      axios.get("http://localhost:5000/api/study", { headers }),
      axios.get("http://localhost:5000/api/attempts", { headers }),
    ]);

    setFiles(Array.isArray(filesRes.data) ? filesRes.data : []);
    setPlans(Array.isArray(plansRes.data) ? plansRes.data : []);
    setAttempts(Array.isArray(attemptsRes.data) ? attemptsRes.data : []);
  } catch (err: any) {
    console.error("DASHBOARD ERROR:", err.response?.data || err.message);
  }
  };

  // 👁 VIEW FILE
  const handleView = async (id: string) => {
  try {
    console.log("Opening", id);

    const res = await fetch(`http://localhost:5000/api/files/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log(res.status);

    if (!res.ok) {
      throw new Error("Failed to fetch file");
    }

    const blob = await res.blob();

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  } catch (err) {
    console.error(err);
  }
};

  const handleDeletePlan = async (id: string) => {
  try {
    await axios.delete(`http://localhost:5000/api/study/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setPlans((prev) => prev.filter((p) => p._id !== id));
  } catch (err) {
    console.error(err);
  }
};

const handleDeleteAttempt = async (id: string) => {
  try {
    await axios.delete(`http://localhost:5000/api/attempts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setAttempts((prev) => prev.filter((a) => a._id !== id));
  } catch (err) {
    console.error(err);
  }
};

const openAttempt = (attempt: any) => {
  localStorage.setItem("selectedAttempt", JSON.stringify(attempt));
  window.location.href = "/quiz";
};

const openPlan = (planId: string) => {
  window.location.href = `/study-plan/${planId}`;
};

  // =========================
  // 📊 STATS (🔥 FIXED)
  // =========================
  const totalLectures = files.length;

  const totalQuizzes = attempts.length; // ✅ FROM attempts

  const weakTopics = attempts.flatMap(
    (a: any) => a.weakTopics || []
  );

  const uniqueWeakTopics = [...new Set(weakTopics)];

  const stats = [
    { label: "Lectures Uploaded", value: totalLectures },
    { label: "Quizzes Completed", value: totalQuizzes },
    { label: "Weak Topics", value: uniqueWeakTopics.length },
    { label: "Study Plans", value: plans.length },
  ];

  // 📚 FILES
  const recentLectures = files
    .slice()
    .reverse()
    .slice(0, 5)
    .map((f) => ({
      id: f._id,
      name: f.filename || "Unnamed file",
    }));

  // ⚠️ WEAK TOPICS UI
  const weakTopicsUI = uniqueWeakTopics.slice(0, 5).map((t) => ({
    topic: t,
    confidence: Math.floor(Math.random() * 40) + 40,
  }));

  return (
    <DashboardLayout title="Dashboard" subtitle="Overview">
      <div className="space-y-6 max-w-6xl">

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="p-5">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 📚 FILES */}
<Card className="p-6">
  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
    <BookOpen className="h-5 w-5" />
    Uploaded Files
  </h3>

 {files.map((f) => (
  <div
    key={f._id}
    onClick={() => handleView(f._id)}
    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition"
  >
    <FileText className="h-5 w-5 text-primary" />
    <span>{f.filename}</span>
  </div>
))}
</Card>

          {/* ⚠️ WEAK TOPICS */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Weak Topics
            </h3>

            <div className="space-y-4">
              {weakTopicsUI.map((t, i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <p>{t.topic}</p>
                    <span>{t.confidence}%</span>
                  </div>
                  <Progress value={t.confidence} />
                </div>
              ))}
            </div>
          </Card>

        </div>

<Card className="p-6">
  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
    <ClipboardCheck className="h-5 w-5" />
    Quiz Attempts
  </h3>

  <div className="space-y-3">
    {attempts.map((a) => (
      <div
        key={a._id}
        className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
      >
        <div
          className="cursor-pointer flex-1"
          onClick={() => openAttempt(a)}
        >
          <p>{a.file?.filename || "Quiz"}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(a.createdAt).toDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge>
            {a.score}/{a.total}
          </Badge>

          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDeleteAttempt(a._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ))}
  </div>
</Card>
<Card className="p-6">
  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
    <CalendarDays className="h-5 w-5" />
    Study Plans
  </h3>

  <div className="space-y-3">
    {plans.map((plan, i) => (
      <div
        key={plan._id}
        className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
      >
        <div
          className="cursor-pointer flex-1"
          onClick={() => openPlan(plan._id)}
        >
          <p>Plan {i + 1}</p>

          <p className="text-xs text-muted-foreground">
            {plan.progress.filter((d: any) => d.completed).length}/
            {plan.plan.length} completed
          </p>
        </div>

        <Button
          variant="destructive"
          size="icon"
          onClick={() => handleDeletePlan(plan._id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
</Card>

      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;