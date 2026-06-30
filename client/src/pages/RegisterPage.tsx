import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Chrome } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // ✅ STATE
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
const handleGoogleRegister = () => {
  window.location.href = "http://localhost:5000/api/auth/google";
};
  // ✅ SUBMIT
  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: `${first} ${last}`,
          email,
          password,
        }
      );

      // ✅ SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      console.log("Registered:", res.data);

      // ✅ REDIRECT
      navigate("/dashboard");

    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* LEFT */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <div className="inline-flex items-center justify-center p-1 rounded-xl bg-muted border border-border shadow-sm">
            <img src="/LOGO.png" alt="Logo" className="h-10 w-10 object-contain" />
          </div>

          <h1 className="font-heading text-4xl font-bold mb-4">
            Start learning smarter
          </h1>

          <p className="text-primary-foreground/80 text-lg">
            Create your free account and transform your study routine with AI.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          {/* MOBILE LOGO */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <img src="/LOGO.png" alt="Logo" className="h-10" />
          </div>

          <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
            Create account
          </h2>

          <p className="text-muted-foreground mb-4">
            Get started in less than a minute
          </p>

          {/* ❗ ERROR MESSAGE */}
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
<Button
  type="button"
  variant="outline"
  className="w-full mb-4"
  onClick={handleGoogleRegister}
>
  <Chrome className="mr-2 h-4 w-4" />
  Continue with Google
</Button>

<div className="relative mb-4">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t" />
  </div>

  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-background px-2 text-muted-foreground">
      Or continue with email
    </span>
  </div>
</div>
          {/* FORM */}
          <form className="space-y-4" onSubmit={handleRegister}>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="first">First name</Label>
                <Input
                  id="first"
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  placeholder="John"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last">Last name</Label>
                <Input
                  id="last"
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <Button className="w-full" size="lg">
              Create account
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Log in
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

export default RegisterPage;