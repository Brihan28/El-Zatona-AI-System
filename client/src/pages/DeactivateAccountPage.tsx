import { useState } from "react";
import axios from "axios";

import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  AlertTriangle,
  Trash2,
  FileText,
  BookOpen,
  ClipboardCheck,
  CalendarDays,
} from "lucide-react";

const DeactivateAccountPage = () => {
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const deleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account?\n\nThis action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await axios.delete(
        "http://localhost:5000/api/auth/delete-account",
        {
          headers,
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      alert("Your account has been deleted.");

      window.location.href = "/";
    } catch (err: any) {
      alert(
        err.response?.data?.msg ||
          "Failed to delete account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Deactivate Account"
      subtitle="Permanently remove your account"
    >
      <div className="max-w-3xl mx-auto">

        <Card className="border-red-300 p-8">

          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-500" />

            <div>
              <h2 className="text-2xl font-bold text-red-600">
                Danger Zone
              </h2>

              <p className="text-sm text-muted-foreground">
                Deleting your account is permanent.
              </p>
            </div>
          </div>

          <p className="mb-6">
            When you delete your account, the following data will be
            permanently removed:
          </p>

          <div className="space-y-4 mb-8">

            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Uploaded Lectures</span>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <span>AI Summaries</span>
            </div>

            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <span>Quiz Attempts & Results</span>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-primary" />
              <span>Study Plans & Progress</span>
            </div>

          </div>

          <div className="rounded-lg border border-red-300 bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-700">
              <strong>Warning:</strong> Once your account is deleted,
              there is no way to recover your data.
            </p>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={deleteAccount}
            disabled={loading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {loading ? "Deleting..." : "Delete My Account"}
          </Button>

        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DeactivateAccountPage;