import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Lock,
  Phone,
  Globe,
  Accessibility,
  MessageSquare,
  Leaf,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";
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

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "pt", name: "Portuguese" },
  { code: "ar", name: "Arabic" },
  { code: "bn", name: "Bengali" },
];

const DISABILITY_TYPES = [
  "Visual Impairment",
  "Hearing Impairment",
  "Speech Disability",
  "Other",
];

const ANSWER_PREFERENCES = [
  { value: "voice", label: "Voice Only" },
  { value: "chat", label: "Text Only" },
  { value: "both", label: "Voice + Text" },
];

export default function SignUp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    countryCode: "+91",
    phoneNumber: "",
    languagePreference: "en",
    hasDisability: "no",
    disabilityType: "",
    answerPreference: "voice",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
        username: formData.username,
        email: formData.email,
        code: formData.password,
        // language_preference: formData.languagePreference,
        phone_number: formData.phoneNumber,
        disability_is: formData.hasDisability === "yes",
        disability_type: formData.disabilityType,
        answer_preference: formData.answerPreference,
      });

      toast({
        title: "Account Created! 🎉",
        description: "Welcome to Farm Assistant. Redirecting to sign in...",
      });

      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: field === 'password' ? Number(value) : value }));
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-earth flex flex-col overflow-x-hidden">
      <header className="bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-700 px-6 pt-8 pb-6 safe-area-top rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10" />

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Go back to home"
          >
            <Leaf className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-white drop-shadow-lg">
              Create Account
            </h1>
            <p className="text-sm text-white/90 font-medium">
              Join our farming community
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
          <div
            className={cn(
              "transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Label htmlFor="username" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <div className="icon-3d">
                <User className="w-4 h-4 text-primary" />
              </div>
              Username
            </Label>
            <div className="relative group">
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="h-14 pl-12 rounded-2xl border-2 focus:border-primary transition-all duration-300 group-hover:shadow-md"
                required
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          <div
            className={cn(
              "transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Label htmlFor="email" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <div className="icon-3d">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              Email Address
            </Label>
            <div className="relative group">
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="h-14 pl-12 rounded-2xl border-2 focus:border-primary transition-all duration-300 group-hover:shadow-md"
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          <div
            className={cn(
              "transition-all duration-700 delay-300",
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
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="h-14 pl-12 pr-12 rounded-2xl border-2 focus:border-primary transition-all duration-300 group-hover:shadow-md"
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
              "transition-all duration-700 delay-400",
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
                <SelectTrigger className="h-14 w-28 rounded-2xl border-2 focus:border-primary transition-all duration-300 group-hover:shadow-md">
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
                  className="h-14 pl-12 rounded-2xl border-2 focus:border-primary transition-all duration-300 group-hover:shadow-md"
                  required
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>

          <div
            className={cn(
              "transition-all duration-700 delay-500",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Label htmlFor="language" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <div className="icon-3d">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              Language Preference
            </Label>
            <Select value={formData.languagePreference} onValueChange={(value) => handleChange("languagePreference", value)}>
              <SelectTrigger id="language" className="h-14 rounded-2xl border-2 focus:border-primary transition-all duration-300 hover:shadow-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            className={cn(
              "transition-all duration-700 delay-600",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Label htmlFor="hasDisability" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <div className="icon-3d">
                <Accessibility className="w-4 h-4 text-primary" />
              </div>
              Do you have any disability?
            </Label>
            <Select value={formData.hasDisability} onValueChange={(value) => handleChange("hasDisability", value)}>
              <SelectTrigger id="hasDisability" className="h-14 rounded-2xl border-2 focus:border-primary transition-all duration-300 hover:shadow-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.hasDisability === "yes" && (
            <div
              className={cn(
                "transition-all duration-700 delay-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <Label htmlFor="disabilityType" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <div className="icon-3d">
                  <Accessibility className="w-4 h-4 text-primary" />
                </div>
                Disability Type
              </Label>
              <Select value={formData.disabilityType} onValueChange={(value) => handleChange("disabilityType", value)}>
                <SelectTrigger id="disabilityType" className="h-14 rounded-2xl border-2 focus:border-primary transition-all duration-300 hover:shadow-md">
                  <SelectValue placeholder="Select disability type" />
                </SelectTrigger>
                <SelectContent>
                  {DISABILITY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div
            className={cn(
              "transition-all duration-700 delay-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Label htmlFor="answerPreference" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <div className="icon-3d">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              Answer Preference
            </Label>
            <Select value={formData.answerPreference} onValueChange={(value) => handleChange("answerPreference", value)}>
              <SelectTrigger id="answerPreference" className="h-14 rounded-2xl border-2 focus:border-primary transition-all duration-300 hover:shadow-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ANSWER_PREFERENCES.map((pref) => (
                  <SelectItem key={pref.value} value={pref.value}>
                    {pref.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            className={cn(
              "transition-all duration-700 delay-800 pt-4",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Button
              type="submit"
              className="w-full h-16 rounded-2xl bg-gradient-nature text-white font-bold text-lg shadow-button hover:shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
              Create Account
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-center mt-4 text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
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
      `}</style>
    </div>
  );
}
