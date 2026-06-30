import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import VerifyOTP from "@/components/VerifyOTP";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError("");

    await axios.post(
      "http://localhost:5000/api/auth/forgot-password",
      { email }
    );

    setShowOTP(true);
  } catch (err: any) {
    setError(err.response?.data?.msg || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
if (showOTP) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <VerifyOTP
        email={email}
        endpoint="verify-otp"
        onSuccess={() => {
          navigate("/reset-password", {
            state: { email },
          });
        }}
      />
    </div>
  );
}
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4">

        <h2 className="text-2xl font-bold">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-500">
          Enter your email to receive a verification code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <Label>Email</Label>

            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <Button
            className="w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>

        </form>

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

      </div>
    </div>
  );
};

export default ForgotPasswordPage;