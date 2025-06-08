import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { motion } from "framer-motion";

const imageVariants = {
  initial: { opacity: 0, x: 300 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 300 },
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
      <div className="min-h-screen flex items-center justify-center">
       <div className="border border-primary/25 shadow-[0_0_10px] shadow-primary/25 flex flex-col lg:flex-row w-full max-w-5xl  bg-base-100 rounded-xl  overflow-hidden mx-[10%]">
        {/* Left side */}
       <motion.div
        className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center"
        variants={imageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25 }}
      >
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/j.png" alt="Language connection illustration" className="w-full h-full rounded-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Welcome back</h2>
              <p className="opacity-70">
                Please sign in to your account to continue
              </p>
            </div>
          </div>
        </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-10 border-hidden p-6 rounded-lg  bg-base-100 mx-14 ">
            <h1 className="text-2xl font-semibold text-center">Welcome back</h1>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>

             <div className="text-center m-10">
              <p className="text-base-content/60">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="link link-primary">
                  Create account
                </Link>
              </p>
            </div>
          </form>

         
        </div>
      </div>
  );
};
export default LoginPage;