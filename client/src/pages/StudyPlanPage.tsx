import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { CheckCircle2, Trash2 } from "lucide-react";
const API = "http://localhost:5000";

const StudyPlanPage = () => {
  const { id } = useParams(); // ✅ important

  const [files, setFiles] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(2);
const [showModal, setShowModal] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ OPEN PLAN DIRECTLY FROM URL
  useEffect(() => {
    if (!id || plans.length === 0) return;

    const found = plans.find((p) => p._id === id);
    if (found) setActivePlan(found);
  }, [id, plans]);

  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const filesRes = await axios.get(`${API}/api/files`, { headers });
      const plansRes = await axios.get(`${API}/api/study`, { headers });

      setFiles(filesRes.data || []);
      setPlans(plansRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const generatePlan = async () => {
    if (!selectedFile) return alert("Select file first");
    if (!examDate) return alert("Select exam date");

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/api/study/${selectedFile}`,
        { examDate, hoursPerDay },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPlans((prev) => [res.data, ...prev]);
      setActivePlan(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (planId: string, index: number) => {
    try {
      const res = await axios.patch(
        `${API}/api/study/${planId}/${index}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPlans((prev) =>
        prev.map((p) => (p._id === planId ? res.data : p))
      );

      setActivePlan(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const openDeleteModal = (id: string) => {
  setSelectedId(id);
  setShowModal(true);
};

const handleDelete = async () => {
  if (!selectedId) return;

  try {
    await axios.delete(`${API}/api/study/${selectedId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setPlans((prev) => prev.filter((p) => p._id !== selectedId));

    if (activePlan?._id === selectedId) {
      setActivePlan(null);
    }

    setShowModal(false);
    setSelectedId(null);
  } catch (err) {
    console.error(err);
  }
};

  // ✅ ACTIVE PLAN VIEW
  if (activePlan) {
    const progress =
      (activePlan.progress.filter((d: any) => d.completed).length /
        activePlan.plan.length) *
      100;

    return (
      <DashboardLayout title="Study Plan" subtitle="Your active plan">
        <Button onClick={() => setActivePlan(null)}>← Back</Button><div className="flex justify-between items-center">
  <Button onClick={() => setActivePlan(null)}>
    ← Back
  </Button>

  <Button
    variant="destructive"
    onClick={() => openDeleteModal(activePlan._id)}
  >
    <Trash2 className="mr-2 h-4 w-4" />
    Delete Plan
  </Button>
</div>

        <Card className="p-6 mt-4">
          <Progress value={progress} />
          <p>{progress.toFixed(0)}%</p>
        </Card>

        <div className="space-y-4 mt-4">
          {activePlan.plan.map((day: any, i: number) => (
            <Card key={i} className="p-4">
              <div className="flex justify-between">
                <span>{day.day}</span>

                {!activePlan.progress[i].completed ? (
                  <Button onClick={() => markComplete(activePlan._id, i)}>
                    Done
                  </Button>
                ) : (
                  <CheckCircle2 className="text-green-500" />
                )}
              </div>

              <ul className="mt-2 text-sm">
                {day.tasks.map((t: string, k: number) => (
                  <li key={k}>• {t}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  // ✅ MAIN PAGE
  return (
    <DashboardLayout title="Study Plans" subtitle="All your plans">
      <div className="space-y-6">

        <Card className="p-6 space-y-4">
          <h3>Create Study Plan</h3>

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

          <Input type="date" onChange={(e) => setExamDate(e.target.value)} />
          <Input placeholder="Hours per day" type="number" onChange={(e) => setHoursPerDay(Number(e.target.value))} />

          <Button onClick={generatePlan}>
            {loading ? "Generating..." : "Generate Plan"}
          </Button>
        </Card>

        <Card className="p-6">
          <h3>Your Study Plans</h3>

          {plans.map((plan, i) => {
            const progress =
              (plan.progress.filter((d: any) => d.completed).length /
                plan.plan.length) *
              100;

            return (
              <div
  key={plan._id}
  className="p-3 mt-3 border rounded flex justify-between items-center"
>
  <div
    className="cursor-pointer flex-1"
    onClick={() => setActivePlan(plan)}
  >
    <p>Plan {i + 1}</p>
    <p className="text-xs text-muted-foreground">
      {progress.toFixed(0)}% completed
    </p>
  </div>

  <Button
    variant="destructive"
    size="icon"
    onClick={() => openDeleteModal(plan._id)}
  >
    <Trash2 className="h-4 w-4" />
  </Button>
</div>
            );
          })}
        </Card>

      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-[300px] text-center">
      <h3 className="font-bold mb-2">
        Delete Study Plan?
      </h3>

      <p className="text-sm mb-4">
        This action cannot be undone.
      </p>

      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </Button>

        <Button
          variant="destructive"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
)}
    </DashboardLayout>
  );
};

export default StudyPlanPage;