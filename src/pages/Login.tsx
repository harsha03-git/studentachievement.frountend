import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, ShieldCheck, GraduationCap, UserCheck } from "lucide-react";
import { useApp, Role } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import login3d from "@/assets/login-3d.png";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(100),
});

const Login = () => {
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const fe: typeof errors = {};
      parsed.error.issues.forEach((i) => { fe[i.path[0] as "email" | "password"] = i.message; });
      setErrors(fe);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await login(role, email, password);
      toast({ title: "Welcome back!", description: `Logged in as ${role}.` });
      navigate("/dashboard");
    } catch {
      toast({ title: "Login failed", description: "Invalid email or password.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-canvas flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl bg-card rounded-3xl shadow-lg overflow-hidden grid lg:grid-cols-2 animate-scale-in">
        {/* Left: Form */}
        <div className="p-8 md:p-14 flex flex-col justify-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary leading-tight">
            Hello Again!
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-sm">
            Let's discover how AchievePro can help you celebrate every milestone of your extracurricular journey.
          </p>

          {/* Role tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-muted mt-8 max-w-sm">
            {(["admin", "teacher", "student"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                  role === r
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r === "admin" ? <ShieldCheck className="h-4 w-4" /> : r === "teacher" ? <UserCheck className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                <span className="capitalize">{r}</span>
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-4 mt-6 max-w-sm">
            <div>
              <Input
                type="email"
                placeholder="Enter username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn("h-12 rounded-xl bg-muted border-transparent focus-visible:ring-primary/40", errors.email && "border-destructive")}
              />
              {errors.email && <p className="text-xs text-destructive mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn("h-12 rounded-xl bg-muted border-transparent pr-10 focus-visible:ring-primary/40", errors.password && "border-destructive")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1.5">{errors.password}</p>}
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm text-secondary hover:underline">Forgot your password?</a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold tracking-wider uppercase text-sm shadow-md hover:shadow-lg transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              No account yet? <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }} className="text-secondary font-semibold hover:underline">Register</a>
            </p>
          </form>
        </div>

        {/* Right: Illustration */}
        <div className="hidden lg:flex relative items-center justify-center p-12" style={{ background: "var(--gradient-illustration)" }}>
          {/* floating decorative blobs */}
          <div className="absolute top-10 left-10 h-24 w-24 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute bottom-16 right-12 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
          <img
            src={login3d}
            alt="Workspace illustration"
            width={600}
            height={600}
            className="relative w-full max-w-md h-auto animate-float drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
