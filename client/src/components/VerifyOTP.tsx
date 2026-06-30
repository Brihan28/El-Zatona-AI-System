import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type VerifyOTPProps = {
  email: string;
  endpoint: string;
  onSuccess: (data?: any) => void;
};

const VerifyOTP = ({
  email,
  endpoint,
  onSuccess,
}: VerifyOTPProps) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:5000/api/auth/${endpoint}`,
        {
          email,
          otp,
        }
      );

      onSuccess(res.data);
    } catch (err: any) {
      alert(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <h2 className="text-2xl font-bold">
        Verify OTP
      </h2>

      <p className="text-gray-500">
        Enter the 6-digit code sent to <b>{email}</b>
      </p>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <Label>OTP Code</Label>

          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>
    </div>
  );
};

export default VerifyOTP;