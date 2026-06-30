import { useEffect, useState } from "react";
import axios from "axios";

import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { FileText, Trash2, Eye } from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [name, setName] = useState("");
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"lecture" | "plan" | "attempt">("plan");

  // =========================
  // FETCH
  // =========================
  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const [userRes, filesRes, plansRes, attemptsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/auth/me", { headers }),
        axios.get("http://localhost:5000/api/files", { headers }),
        axios.get("http://localhost:5000/api/study", { headers }),
        axios.get("http://localhost:5000/api/attempts", { headers }),
      ]);

      setUser(userRes.data);
      setName(userRes.data.name);
      setFiles(filesRes.data);
      setPlans(plansRes.data);
      setAttempts(attemptsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // VIEW FILE
  // =========================
  const handleView = async (id: string) => {
    const res = await fetch(`http://localhost:5000/api/files/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
    window.open(url);
  };

  // =========================
  // DELETE MODAL
  // =========================

const openDeleteModal = (
  id: string,
  type: "plan" | "lecture" | "attempt" = "plan"
) => {
  setSelectedId(id);
  setDeleteType(type);
  setShowModal(true);
};
const handleDelete = async () => {
  if (!selectedId) return;

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  try {
    if (deleteType === "lecture") {
      await axios.delete(
        `http://localhost:5000/api/files/${selectedId}`,
        { headers }
      );
      setFiles((prev) => prev.filter((f) => f._id !== selectedId));
    }

    if (deleteType === "plan") {
      await axios.delete(
        `http://localhost:5000/api/study/${selectedId}`,
        { headers }
      );
      setPlans((prev) => prev.filter((p) => p._id !== selectedId));
    }

    if (deleteType === "attempt") {
      await axios.delete(
        `http://localhost:5000/api/attempts/${selectedId}`,
        { headers }
      );
      setAttempts((prev) => prev.filter((a) => a._id !== selectedId));
    }

    setShowModal(false);
    setSelectedId(null);
  } catch (err) {
    console.error(err);
  }
};
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

const updateProfile = async () => {
  try {
    setLoading(true);

    const res = await axios.put(
      "http://localhost:5000/api/auth/profile",
      { name },
      { headers }
    );

    setUser(res.data.user);

    alert("Profile updated successfully!");
  } catch (err: any) {
    alert(err.response?.data?.msg || "Failed to update profile");
  } finally {
    setLoading(false);
  }
};

const changePassword = async () => {
  try {
    setLoading(true);

    await axios.put(
      "http://localhost:5000/api/auth/change-password",
      {
        currentPassword,
        newPassword,
      },
      { headers }
    );

    setCurrentPassword("");
    setNewPassword("");

    alert("Password changed successfully!");
  } catch (err: any) {
    alert(err.response?.data?.msg || "Failed to change password");
  } finally {
    setLoading(false);
  }
};
  if (!user) return <div>Loading...</div>;

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DashboardLayout title="Profile" subtitle="Manage your account">
      <div className="w-full space-y-6">

        {/* USER */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-white text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
  <Input
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Your name"
  />


  <Button
    onClick={updateProfile}
    disabled={loading}
    className="w-full"
  >
    Save Changes
  </Button>

  <hr />

  <Input
    type="password"
    placeholder="Current Password"
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
  />

  <Input
    type="password"
    placeholder="New Password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
  />

  <Button
    variant="secondary"
    onClick={changePassword}
    disabled={loading}
    className="w-full"
  >
    Change Password
  </Button>
</div>
        </Card>

        {/* FILES */}
        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Uploaded Lectures
          </h3>

          {files.map((f) => (
            <div key={f._id} className="flex justify-between p-3 bg-muted/50 rounded-lg">
              <p>{f.filename}</p>

              <div className="flex gap-2">
                <Button size="icon" onClick={() => handleView(f._id)}>
                  <Eye className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => openDeleteModal(f._id, "lecture")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </Card>

<Card className="p-6">
  <h3 className="mb-4">Quiz Attempts</h3>

  {attempts.map((a: any) => (
    <div
      key={a._id}
      className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
    >
      {/* CLICK AREA */}
      <div
        className="cursor-pointer flex-1"
        onClick={() => {
          localStorage.setItem("selectedAttempt", JSON.stringify(a));
          window.location.href = "/quiz";
        }}
      >
        <p>{a.file?.filename || "Quiz"}</p>
        <p className="text-xs">
          {new Date(a.createdAt).toDateString()}
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2">
        <Badge>
          {a.score}/{a.total}
        </Badge>

        {/* 🔥 DELETE BUTTON */}
        <Button
          size="icon"
          variant="destructive"
          onClick={() => openDeleteModal(a._id, "attempt")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ))}
</Card>


 {/* STUDY PLANS */}
<Card className="p-6">
  <h3 className="mb-4">Study Plans</h3>

  {plans.map((p: any, i: number) => (
    <div
      key={p._id}
      className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
    >
      <div
        className="cursor-pointer flex-1"
        onClick={() => {
          window.location.href = `/study-plan/${p._id}`; // ✅ FIXED
        }}
      >
        <p>Plan {i + 1}</p>
      </div>

      <div className="flex gap-2 items-center">
        <Badge>
          {p.progress.filter((d: any) => d.completed).length}/{p.plan.length}
        </Badge>

        <Button
          size="icon"
          variant="destructive"
          onClick={() => openDeleteModal(p._id, "plan")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ))}
</Card>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[300px] text-center">
              <h3 className="font-bold mb-2">Delete?</h3>
              <p className="text-sm mb-4">This action cannot be undone.</p>

              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>

                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;