import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, ShieldCheck, GraduationCap, UserCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { useApp, Role } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import login3d from "@/assets/login-3d.png";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name (at least 2 characters)"),
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ROLES: { value: Role; label: string; icon: typeof ShieldCheck; color: string }[] = [
  { value: "admin",   label: "Admin",   icon: ShieldCheck,   color: "from-violet-500 to-purple-600" },
  { value: "teacher", label: "Teacher", icon: UserCheck,     color: "from-blue-500 to-indigo-600" },
  { value: "student", label: "Student", icon: GraduationCap, color: "from-emerald-500 to-teal-600" },
];

const Register = () => {
  const [role, setRole]                 = useState<Role>("student");
  const [name, setName]                 = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [course, setCourse]             = useState("");
  const [year, setYear]                 = useState("");
  const [department, setDepartment]     = useState("");
  const [showPw, setShowPw]             = useState(false);
  const [showCPw, setShowCPw]           = useState(false);
  const [errors, setErrors]             = useState<Record<string, string>>({});
  const [loading, setLoading]           = useState(false);
  const [emailExists, setEmailExists]   = useState(false);

  const { registerUser } = useApp();
  const navigate = useNavigate();

  // Password strength
  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4
    : 3;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-amber-400", "bg-blue-500", "bg-emerald-500"];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailExists(false);

    const parsed = schema.safeParse({ name, email, password, confirmPassword });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { fe[i.path[0] as string] = i.message; });
      setErrors(fe);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      // Build extra fields based on role
      const extraFields = role === "student"
        ? { course, year }
        : role === "teacher"
        ? { department }
        : {};

      await registerUser(role, name.trim(), email.trim(), password, extraFields);
      toast({
        title: "🎉 Account created!",
        description: `Welcome to AchievePro, ${name.trim()}! You're now logged in.`,
      });
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already exists")) {
        setEmailExists(true);
        setErrors({ email: "This email is already registered." });
      } else {
        toast({ title: "Registration failed", description: msg, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-canvas flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl bg-card rounded-3xl shadow-lg overflow-hidden grid lg:grid-cols-2 animate-scale-in">

        {/* ── Left: Form ──────────────────────────────────────────── */}
        <div className="p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-screen">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight">
            Create an Account
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Join AchievePro to track, manage, and celebrate extracurricular achievements.
          </p>

          {/* Role tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-muted mt-6 max-w-sm">
            {ROLES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => { setRole(value); setErrors({}); setEmailExists(false); }}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all",
                  role === value
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-3 mt-5 max-w-sm" noValidate>

            {/* Name */}
            <div>
              <Input
                id="reg-name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn("h-11 rounded-xl bg-muted border-transparent focus-visible:ring-primary/40", errors.name && "border-destructive ring-1 ring-destructive")}
              />
              {errors.name && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <Input
                id="reg-email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailExists(false); setErrors(prev => ({ ...prev, email: "" })); }}
                className={cn("h-11 rounded-xl bg-muted border-transparent focus-visible:ring-primary/40", errors.email && "border-destructive ring-1 ring-destructive")}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{errors.email}
                </p>
              )}
              {/* Email already exists — show login prompt */}
              {emailExists && (
                <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                  <div>
                    This email is already registered.{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="font-semibold underline underline-offset-2 hover:text-amber-900"
                    >
                      Sign in instead →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Role-specific fields */}
            {role === "student" && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Course (e.g. B.Tech CS)"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="h-11 rounded-xl bg-muted border-transparent focus-visible:ring-primary/40"
                />
                <Input
                  placeholder="Year (e.g. 2nd Year)"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="h-11 rounded-xl bg-muted border-transparent focus-visible:ring-primary/40"
                />
              </div>
            )}
            {role === "teacher" && (
              <Input
                placeholder="Department (e.g. Computer Science)"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="h-11 rounded-xl bg-muted border-transparent focus-visible:ring-primary/40"
              />
            )}

            {/* Password */}
            <div>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPw ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn("h-11 rounded-xl bg-muted border-transparent pr-10 focus-visible:ring-primary/40", errors.password && "border-destructive ring-1 ring-destructive")}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-300", i <= strength ? strengthColor[strength] : "bg-muted-foreground/20")} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Strength: <span className="font-medium">{strengthLabel[strength]}</span></p>
                </div>
              )}
              {errors.password && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <Input
                  id="reg-confirm-password"
                  type={showCPw ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn("h-11 rounded-xl bg-muted border-transparent pr-10 focus-visible:ring-primary/40",
                    errors.confirmPassword && "border-destructive ring-1 ring-destructive",
                    !errors.confirmPassword && confirmPassword && confirmPassword === password && "border-emerald-400 ring-1 ring-emerald-400"
                  )}
                />
                <button type="button" onClick={() => setShowCPw(!showCPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle confirm password">
                  {showCPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {!errors.confirmPassword && confirmPassword && confirmPassword === password && (
                  <CheckCircle2 className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                )}
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              id="register-btn"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wider uppercase text-sm shadow-md hover:shadow-lg transition-all mt-1"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating Account...
                </span>
              ) : "Create Account"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <button type="button" onClick={() => navigate("/")} className="text-primary font-semibold hover:underline">
                Sign In
              </button>
            </p>
          </form>
        </div>

        {/* ── Right: Illustration ──────────────────────────────────── */}
        <div className="hidden lg:flex relative items-center justify-center p-12" style={{ background: "var(--gradient-illustration)" }}>
          <div className="absolute top-10 left-10 h-24 w-24 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute bottom-16 right-12 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
          <img src={login3d} alt="Workspace illustration" width={600} height={600}
            className="relative w-full max-w-md h-auto animate-float drop-shadow-2xl" />
        </div>
      </div>
    </div>
  );
};

export default Register;
