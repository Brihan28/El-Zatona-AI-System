import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ✅ from URL

  const [password, setPassword] = useState("");

  const handleReset = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        password,
      });
      

      alert("Password reset successful");

      // 👉 redirect to login
      window.location.href = "/";

    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4">

        <h2 className="text-2xl font-bold">Set New Password</h2>

        <form onSubmit={handleReset} className="space-y-4">

          {/* ❌ REMOVED token input */}

          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full">
            Reset Password
          </Button>

        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;