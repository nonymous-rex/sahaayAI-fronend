import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Phone, Lock, Leaf, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const COUNTRY_CODES = [
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japan" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+61", country: "Australia" },
  { code: "+55", country: "Brazil" },
  { code: "+27", country: "South Africa" },
];

export default function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    countryCode: "+91",
    phoneNumber: "",
    password: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signin`, {
        countryCode: formData.countryCode,
        phone_number: formData.phoneNumber,
        code: formData.password,
      });

      toast({
        title: "Welcome Back! 🌾",
        description: "Redirecting to your dashboard...",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error: any) {
      console.error("Signin error:", error);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.response?.data?.message || "Invalid credentials. Please try again.",
      });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: field === 'password' ? Number(value) : value }));
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-earth flex flex-col overflow-x-hidden">
      <header className="bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-700 px-6 pt-8 pb-10 safe-area-top rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate("/")}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Go back to home"
            >
              <Leaf className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold text-white drop-shadow-lg">
                Welcome Back
              </h1>
              <p className="text-sm text-white/90 font-medium">
                Sign in to continue
              </p>
            </div>
          </div>

          <div className="mt-8 animate-float">
            <div className="w-24 h-24 mx-auto bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
              <div className="icon-3d-large">
                <Leaf className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-8 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
          <div
            className={cn(
              "transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Label htmlFor="phone" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <div className="icon-3d">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              Phone Number
            </Label>
            <div className="flex gap-2 group">
              <Select value={formData.countryCode} onValueChange={(value) => handleChange("countryCode", value)}>
                <SelectTrigger className="h-16 w-32 rounded-2xl border-2 focus:border-primary transition-all duration-300 group-hover:shadow-md text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.code} {item.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="1234567890"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className="h-16 pl-12 rounded-2xl border-2 focus:border-primary transition-all duration-300 group-hover:shadow-md text-base"
                  required
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>

          <div
            className={cn(
              "transition-all duration-700 delay-400",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Label htmlFor="password" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <div className="icon-3d">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              Password
            </Label>
            <div className="relative group">
              <Input
                id="password"
                type={showPassword ? "text" : "number"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="h-16 pl-12 pr-12 rounded-2xl border-2 focus:border-primary transition-all duration-300 group-hover:shadow-md text-base"
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div
            className={cn(
              "transition-all duration-700 delay-500",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <button
              type="button"
              className="text-sm text-primary font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div
            className={cn(
              "transition-all duration-700 delay-600 pt-2",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Button
              type="submit"
              className="w-full h-16 rounded-2xl bg-gradient-nature text-white font-bold text-lg shadow-button hover:shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
              Sign In
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-center mt-6 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-primary font-semibold hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>

          <div
            className={cn(
              "transition-all duration-700 delay-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground font-medium">
                  Quick Access
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="h-14 rounded-2xl border-2 border-border bg-card hover:bg-accent transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium hover:shadow-md"
              >
                Voice Login
              </button>
              <button
                type="button"
                className="h-14 rounded-2xl border-2 border-border bg-card hover:bg-accent transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium hover:shadow-md"
              >
                Biometric
              </button>
            </div>
          </div>
        </form>
      </main>

      <style>{`
        .icon-3d {
          display: inline-flex;
          padding: 6px;
          border-radius: 8px;
          background: linear-gradient(135deg, hsl(188 85% 40%) 0%, hsl(192 75% 52%) 100%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
                      inset 0 -2px 4px rgba(0, 0, 0, 0.2),
                      inset 0 2px 4px rgba(255, 255, 255, 0.3);
          transform: translateZ(0);
          transition: transform 0.2s ease;
        }

        .icon-3d:hover {
          transform: translateY(-2px) scale(1.05);
        }

        .icon-3d svg {
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
          color: white !important;
        }

        .icon-3d-large {
          padding: 12px;
          border-radius: 16px;
          background: linear-gradient(135deg, hsl(188 85% 40%) 0%, hsl(192 75% 52%) 100%);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2),
                      inset 0 -4px 8px rgba(0, 0, 0, 0.25),
                      inset 0 4px 8px rgba(255, 255, 255, 0.3);
          transform: translateZ(0);
        }

        .icon-3d-large svg {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
      `}</style>
    </div>
  );
}
