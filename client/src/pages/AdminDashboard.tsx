import { useEffect, useState } from "react";
import axios from "axios";

import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

const AdminDashboardPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  // =========================
  // 📥 FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // ➕ CREATE USER
  // =========================
  const handleCreateUser = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/users",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchUsers();
      setNewUser({ name: "", email: "", password: "", role: "user" });
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // ✏️ UPDATE USER
  // =========================
  const handleUpdateUser = async (id: string) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;

    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${id}`,
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // 🗑 DELETE USER
  // =========================
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Manage users in the system"
    >
      <div className="w-full space-y-6">

        {/* USERS COUNT */}
        <Card className="p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-5 w-5 text-primary" />
            <p className="text-lg font-semibold">Total Users</p>
          </div>
          <p className="text-3xl font-bold">{users.length}</p>
        </Card>

        {/* CREATE USER */}
        <Card className="p-6 space-y-3">
          <h3 className="font-semibold">Create User</h3>

          <Input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, name: e.target.value })
            }
          />

          <Input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
          />

          <Input
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />

          <Button onClick={handleCreateUser}>
            Create User
          </Button>
        </Card>

        {/* USERS LIST */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">All Users</h3>

          <div className="space-y-3">
            {users.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No users found
              </p>
            )}

            {users.map((u) => {
              const initials = u.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {initials || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {/* ✏️ UPDATE BUTTON */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateUser(u._id)}
                    >
                      Edit
                    </Button>

                    {/* 🗑 DELETE BUTTON */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(u._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;