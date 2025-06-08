import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import { motion } from "framer-motion";

const imageVariants = {
  initial: { opacity: 0, x: -300 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -300 },
};

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 4) return toast.error("Password must be at least 4 characters");
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

 return (
  <div className="min-h-screen flex items-center justify-center w-full bg-base-200">
    <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-[10%] bg-base-100 rounded-xl shadow-[0_0_10px] shadow-primary/25 overflow-hidden">
      

      <form onSubmit={handleSubmit} className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col ">
        <h1 className="text-3xl font-bold text-center">Create an Account</h1>
        {/* Full Name */}
        <div className="form-control my-4">
          <label className="label">
            <span className="label-text font-medium">Full Name</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="size-5 text-base-content/40" />
            </div>
            <input
              type="text"
              className={`input input-bordered w-full pl-10`}
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-control my-4">
          <label className="label">
            <span className="label-text font-medium">Email</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="size-5 text-base-content/40" />
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

        {/* Password */}
        <div className="form-control my-4">
          <label className="label">
            <span className="label-text font-medium">Password</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="size-5 text-base-content/40" />
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
                <EyeOff className="size-5 text-base-content/40" />
              ) : (
                <Eye className="size-5 text-base-content/40" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full mt-10" disabled={isSigningUp}>
          {isSigningUp ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Loading...
            </>
          ) : (
            "Create Account"
          )}
        </button>

         <div className="text-center m-10">
          <p className="text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </form>

     
      <motion.div
        className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center"
        variants={imageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25 }}
      >
          <div className="max-w-md p-8 w-full">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto roun">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with teachers worldwide</h2>
              <p className="opacity-70">
                Practice , make friends, and improve your  skills together
              </p>
            </div>
          </div>
        </motion.div>
    </div>
  </div>
);
};
export default SignUpPage;