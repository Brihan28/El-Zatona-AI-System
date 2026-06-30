import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 NEW STATES (added)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // ✅ STORE TOKEN
      localStorage.setItem("token", res.data.token);

      // 🔥 STORE ROLE
      localStorage.setItem("role", res.data.user.role);

      // ✅ REDIRECT BASED ON ROLE
      if (res.data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }

    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">

          <div className="inline-flex items-center justify-center p-1 rounded-xl bg-muted border border-border shadow-sm">
            <img src="/LOGO.png" alt="Logo" className="h-10 w-10 object-contain" />
          </div>

          <h1 className="font-heading text-4xl font-bold mb-4">
            Welcome back!
          </h1>

          <p className="text-primary-foreground/80 text-lg">
            Continue your learning journey with summaries, quizzes, and smart study tools.
          </p>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <img src="/LOGO.png" alt="Logo" className="h-10" />
          </div>

          <h2 className="font-heading text-2xl font-bold text-foreground mb-1 text-center">
            Log in
          </h2>

          <p className="text-muted-foreground mb-4 text-center">
            Enter your credentials to continue
          </p>

          {/* 🔥 ERROR MESSAGE */}
          {error && (
            <p className="text-sm text-red-500 text-center mb-4">
              {error}
            </p>
          )}

          {/* FORM */}
          <form className="space-y-4" onSubmit={handleLogin}>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* 🔥 LOADING BUTTON */}
            <Button className="w-full" size="lg" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="text-sm text-right mt-2">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </p>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>

          <p className="text-center mt-4">
            <Link to="/" className="text-xs text-muted-foreground hover:underline">
              ← Back to Home
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;