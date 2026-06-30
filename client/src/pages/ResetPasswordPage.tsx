import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email,
          password,
        }
      );

      alert("Password reset successfully!");

      navigate("/login");

    } catch (err: any) {
      console.error(err.response?.data || err.message);

      alert(
        err.response?.data?.msg || "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Invalid password reset session.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-full max-w-sm space-y-4">

        <h2 className="text-2xl font-bold">
          Set New Password
        </h2>

        <p className="text-sm text-gray-500">
          Enter your new password.
        </p>

        <form
          onSubmit={handleReset}
          className="space-y-4"
        >

          <div>
            <Label>New Password</Label>

            <Input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <Button
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Reset Password"}
          </Button>

        </form>

      </div>

    </div>
  );
};

export default ResetPasswordPage;