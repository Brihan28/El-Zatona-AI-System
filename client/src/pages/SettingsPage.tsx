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
const [name, setName] = useState("");

const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");

const [loading, setLoading] = useState(false);

  // =========================
  // FETCH
  // =========================
  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

const userRes = await axios.get(
  "http://localhost:5000/api/auth/me",
  { headers }
);

setUser(userRes.data);
setName(userRes.data.name);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


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
const deleteAccount = async () => {
  const confirmDelete = window.confirm(
    "Are you sure? This will permanently delete your account and all your data."
  );

  if (!confirmDelete) return;

  try {
    await axios.delete("http://localhost:5000/api/auth/delete-account", {
      headers,
    });

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    alert("Account deleted successfully.");

    window.location.href = "/";
  } catch (err: any) {
    alert(err.response?.data?.msg || "Failed to delete account.");
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
    <div className="max-w-3xl mx-auto space-y-6">

      {/* PROFILE HEADER */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-white text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
          </div>
        </div>
      </Card>

      {/* ACCOUNT INFO */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-5">
          Account Information
        </h3>

        <div className="space-y-4">

          <div className="flex justify-between border-b pb-3">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium capitalize">{user.role}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Member Since</span>
            <span className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>

        </div>
      </Card>

      {/* EDIT PROFILE */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-5">
          Edit Profile
        </h3>

        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />

          <Button
            className="w-full"
            onClick={updateProfile}
            disabled={loading}
          >
            Save Changes
          </Button>
        </div>
      </Card>

      {/* CHANGE PASSWORD */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-5">
          Change Password
        </h3>

        <div className="space-y-4">
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
            className="w-full"
            onClick={changePassword}
            disabled={loading}
          >
            Change Password
          </Button>
        </div>
      </Card>

    </div>
  </DashboardLayout>
);
};

export default ProfilePage;