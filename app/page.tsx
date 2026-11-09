
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  Menu,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description:
      "Get personalized course recommendations and intelligent insights based on your academic progress.",
    color: "#A78BFA",
  },
  {
    icon: BookOpen,
    title: "Course Management",
    description:
      "Access courses, learning materials, assignments, quizzes, and resources in one place.",
    color: "#38BDF8",
  },
  {
    icon: LayoutDashboard,
    title: "Academic Dashboard",
    description:
      "Organize your academic journey with dashboards, grade tracking, and progress monitoring.",
    color: "#34D399",
  },
  {
    icon: Target,
    title: "Track Your Progress",
    description:
      "Monitor your performance, identify areas for improvement, and work toward your goals.",
    color: "#FBBF24",
  },
];

const benefits = [
  "Personalized course recommendations",
  "Centralized learning materials",
  "Assignments and online quizzes",
  "Academic progress monitoring",
  "Grade and GPA tracking",
  "Role-based dashboards",
];

const stats = [
  { icon: Users, value: "1,500+", label: "Students" },
  { icon: BookOpen, value: "80+", label: "Courses" },
  { icon: GraduationCap, value: "4", label: "Departments" },
  { icon: TrendingUp, value: "AI", label: "Powered Learning" },
];

const testimonials = [
  {
    name: "Aisha Rahman",
    role: "Computer Science Student",
    text: "EduHub makes it easier to organize my courses and understand my academic progress.",
    avatar: "AR",
  },
  {
    name: "Marcus Chen",
    role: "Engineering Student",
    text: "Having assignments, learning materials, and grades together saves me time.",
    avatar: "MC",
  },
  {
    name: "Sofia Martinez",
    role: "University Student",
    text: "The dashboard gives me a clear view of my courses and learning goals.",
    avatar: "SM",
  },
];

function AnimatedCounter({ target }: { target: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const number = Number(target.replace(/\D/g, ""));
    if (!number) {
      setDisplay(target);
      return;
    }

    let timer: ReturnType<typeof setInterval> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.disconnect();
        let current = 0;
        const step = Math.max(1, Math.ceil(number / 60));

        timer = setInterval(() => {
          current = Math.min(current + step, number);
          setDisplay(target.replace(/\d+/, String(current)));

          if (current >= number && timer) {
            clearInterval(timer);
          }
        }, 20);
      },
      { threshold: 0.25 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [target]);

  return <span ref={ref}>{display}</span>;
}

function HeroCard({
  icon,
  title,
  description,
  color,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 text-left backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]">
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <h3 className="font-bold text-white">{title}</h3>
      <p className="mt-1 text-sm text-[#7A95AE]">{description}</p>
    </div>
  );
}

function InfoBadge({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-[#B8C7D8] transition hover:border-[#D5AE48]/30">
      <span className="text-[#D5AE48]">{icon}</span>
      {text}
    </div>
  );
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050F1A] text-white">
      <style>{`
        html { scroll-behavior: smooth; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(213,174,72,.25); }
          50% { box-shadow: 0 0 0 8px rgba(213,174,72,0); }
        }

        .fade-up { animation: fade-up .7s ease-out both; }
        .delay-1 { animation-delay: .12s; }
        .delay-2 { animation-delay: .24s; }
        .delay-3 { animation-delay: .36s; }
        .delay-4 { animation-delay: .48s; }
        .float-card { animation: float 6s ease-in-out infinite; }

        .text-shimmer {
          background: linear-gradient(90deg, #D5AE48, #F5D87A, #E0BE61, #F5D87A, #D5AE48);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 4s linear infinite;
        }

        .pulse-gold { animation: pulse-gold 2.5s ease-in-out infinite; }

        .hero-btn {
          background: linear-gradient(135deg, #D5AE48, #E8C84A);
          box-shadow: 0 8px 28px rgba(213,174,72,.22);
          transition: all .25s ease;
        }

        .hero-btn:hover {
          background: linear-gradient(135deg, #E0BE61, #F5D87A);
          box-shadow: 0 12px 36px rgba(213,174,72,.35);
          transform: translateY(-2px);
        }

        .secondary-btn {
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.04);
          transition: all .25s ease;
        }

        .secondary-btn:hover {
          border-color: rgba(213,174,72,.45);
          background: rgba(255,255,255,.08);
          transform: translateY(-2px);
        }

        .feature-card { transition: all .3s ease; }
        .feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(213,174,72,.3);
          background: rgba(255,255,255,.06);
        }

        .testimonial-card { transition: all .3s ease; }
        .testimonial-card:hover {
          transform: translateY(-5px);
          border-color: rgba(213,174,72,.3);
        }

        .nav-solid {
          background: rgba(5,15,26,.95);
          box-shadow: 0 4px 30px rgba(0,0,0,.3);
          backdrop-filter: blur(16px);
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(213,174,72,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(213,174,72,.7) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-[#D5AE48]/[0.07] blur-[100px]" />
        <div className="absolute -right-48 top-[20%] h-[600px] w-[600px] rounded-full bg-[#0E3A6B]/50 blur-[100px]" />
        <div className="absolute bottom-0 left-[25%] h-[450px] w-[450px] rounded-full bg-[#D5AE48]/[0.04] blur-[100px]" />
      </div>

      {/* Navigation */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "nav-solid" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D5AE48] text-[#07192B] shadow-lg shadow-[#D5AE48]/20 transition group-hover:scale-105">
              <GraduationCap size={23} />
            </div>
            <div>
              <p className="text-xl font-black tracking-tight">
                Edu<span className="text-[#D5AE48]">Hub</span>
              </p>
              <p className="hidden text-[9px] font-semibold uppercase tracking-[.25em] text-[#B8C7D8]/70 sm:block">
                Smart Learning
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {[
              ["#features", "Features"],
              ["#ai-section", "AI Learning"],
              ["#about", "About"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-lg px-4 py-2 text-sm text-[#B8C7D8] transition hover:bg-white/[0.06] hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden px-3 py-2 text-sm font-semibold text-[#B8C7D8] transition hover:text-white sm:block"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="hero-btn rounded-xl px-4 py-2.5 text-sm font-bold text-[#07192B] sm:px-5"
            >
              Get Started
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#B8C7D8] transition hover:bg-white/10 md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/[0.08] bg-[#050F1A]/95 px-5 py-4 backdrop-blur-xl md:hidden">
            {[
              ["#features", "Features"],
              ["#ai-section", "AI Learning"],
              ["#about", "About"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm text-[#B8C7D8] transition hover:bg-white/5 hover:text-white"
              >
                {label}
              </a>
            ))}

            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-3 block rounded-xl border border-white/10 py-3 text-center text-sm font-semibold"
            >
              Sign In
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative z-10 flex min-h-screen scroll-mt-20 items-center px-5 pb-16 pt-28 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-12">
            <div className="text-center lg:text-left">
              <div className="pulse-gold fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-[#D5AE48]/30 bg-[#D5AE48]/10 px-4 py-2 text-xs font-semibold text-[#E0BE61]">
                <Sparkles size={14} />
                AI-Enhanced Learning Platform
              </div>

              <h1 className="fade-up delay-1 text-5xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl xl:text-[82px]">
                Learn smarter.
                <br />
                <span className="text-shimmer">Grow faster.</span>
              </h1>

              <p className="fade-up delay-2 mx-auto mt-7 max-w-xl text-base leading-8 text-[#8CA4BC] sm:text-lg lg:mx-0">
                EduHub brings courses, assignments, grades, and AI-powered
                learning recommendations together in one intelligent academic
                platform.
              </p>

              <div className="fade-up delay-3 mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  href="/register"
                  className="hero-btn inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 font-bold text-[#07192B]"
                >
                  Start Learning
                  <ArrowRight size={19} />
                </Link>

                <a
                  href="#features"
                  className="secondary-btn inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 font-semibold text-white"
                >
                  <PlayCircle size={19} className="text-[#D5AE48]" />
                  Explore Features
                </a>
              </div>

              <div className="fade-up delay-4 mt-7 flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs text-[#7A95AE] lg:justify-start">
                {[
                  "Student-focused",
                  "AI-powered insights",
                  "Academic tracking",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#D5AE48]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="fade-up delay-3 relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-5 rounded-[2rem] bg-[#D5AE48]/[0.07] blur-3xl" />

              <div className="float-card relative rounded-3xl border border-white/10 bg-[#0B2034]/95 p-5 shadow-2xl shadow-black/30 sm:p-7">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D5AE48]/15 text-[#D5AE48]">
                      <LayoutDashboard size={22} />
                    </div>
                    <div>
                      <h2 className="font-bold">Learning Overview</h2>
                      <p className="mt-1 text-xs text-[#7A95AE]">
                        Your academic journey
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold text-emerald-300">
                    Demo
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                    <BookOpen size={19} className="text-sky-400" />
                    <p className="mt-4 text-2xl font-black">06</p>
                    <p className="mt-1 text-xs text-[#7A95AE]">Enrolled Courses</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                    <BarChart3 size={19} className="text-emerald-400" />
                    <p className="mt-4 text-2xl font-black">72%</p>
                    <p className="mt-1 text-xs text-[#7A95AE]">Learning Progress</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Course Progress</p>
                      <p className="mt-1 text-xs text-[#7A95AE]">
                        Introduction to AI
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#D5AE48]">
                      82%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-[#D5AE48] to-[#F5D87A]" />
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#A78BFA]/20 bg-[#A78BFA]/[0.06] p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-[#A78BFA]/15 p-2 text-[#C4B5FD]">
                      <Brain size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">AI Learning Insight</p>
                      <p className="mt-1 text-xs leading-6 text-[#8CA4BC]">
                        Discover learning recommendations tailored to your
                        course progress and academic interests.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-[#7A95AE]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  A preview of the EduHub experience
                </div>
              </div>

              <div className="absolute -right-3 top-12 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#102A43] p-4 shadow-xl sm:flex">
                <div className="rounded-xl bg-[#D5AE48]/15 p-2 text-[#D5AE48]">
                  <Sparkles size={19} />
                </div>
                <div>
                  <p className="text-xs font-bold">Smart Learning</p>
                  <p className="mt-1 text-[10px] text-[#7A95AE]">
                    Learn at your pace
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
            <HeroCard
              icon={<Brain size={21} />}
              title="AI Learning"
              description="Personalized learning insights"
              color="#A78BFA"
            />
            <HeroCard
              icon={<BookOpen size={21} />}
              title="Smart Courses"
              description="Learning resources in one place"
              color="#38BDF8"
            />
            <HeroCard
              icon={<BarChart3 size={21} />}
              title="Progress Analytics"
              description="Track academic development"
              color="#34D399"
            />
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="relative z-10 border-y border-white/[0.08]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="flex flex-col items-center border-white/[0.06] px-4 py-9 text-center transition hover:bg-white/[0.025] md:border-r md:last:border-r-0"
              >
                <Icon size={22} className="mb-3 text-[#D5AE48]" />
                <p className="text-3xl font-black sm:text-4xl">
                  <AnimatedCounter target={stat.value} />
                </p>
                <p className="mt-2 text-xs text-[#7A95AE] sm:text-sm">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 scroll-mt-24 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D5AE48]/20 bg-[#D5AE48]/[0.07] px-4 py-2 text-xs font-semibold text-[#D5AE48]">
              <Sparkles size={14} />
              Everything in One Place
            </span>

            <h2 className="mt-5 text-3xl font-black sm:text-4xl lg:text-5xl">
              Powerful tools for{" "}
              <span className="text-shimmer">better learning</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#7A95AE] sm:text-base">
              The tools you need to manage your courses, understand your
              performance, and stay organized throughout your academic journey.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="feature-card rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"
                >
                  <div
                    className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${feature.color}18`,
                      color: feature.color,
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#7A95AE]">
                    {feature.description}
                  </p>

                  <a
                    href="#about"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D5AE48] transition hover:gap-3"
                  >
                    Learn more <ChevronRight size={16} />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Learning */}
      <section
        id="ai-section"
        className="relative z-10 scroll-mt-24 px-5 py-20 sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-5 rounded-3xl bg-violet-500/[0.06] blur-3xl" />

            <div className="relative rounded-3xl border border-white/[0.08] bg-[#0B2034] p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-5">
                <div className="rounded-xl bg-violet-400/15 p-3 text-violet-300">
                  <Brain size={25} />
                </div>
                <div>
                  <p className="font-bold">AI Recommendation Center</p>
                  <p className="mt-1 text-xs text-[#7A95AE]">
                    Example recommendations
                  </p>
                </div>
              </div>

              {[
                {
                  code: "CS401",
                  title: "Artificial Intelligence",
                  match: "94%",
                  color: "#A78BFA",
                },
                {
                  code: "CS402",
                  title: "Machine Learning",
                  match: "89%",
                  color: "#38BDF8",
                },
                {
                  code: "CS403",
                  title: "Advanced Database",
                  match: "82%",
                  color: "#34D399",
                },
              ].map((course) => (
                <div
                  key={course.code}
                  className="mt-4 flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                    style={{
                      backgroundColor: `${course.color}18`,
                      color: course.color,
                    }}
                  >
                    {course.code.slice(0, 2)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{course.title}</p>
                    <p className="mt-1 text-xs text-[#7A95AE]">
                      {course.code}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className="text-lg font-black"
                      style={{ color: course.color }}
                    >
                      {course.match}
                    </p>
                    <p className="text-[10px] text-[#7A95AE]">Match</p>
                  </div>
                </div>
              ))}

              <p className="mt-5 text-xs leading-6 text-[#7A95AE]">
                Illustrative interface preview. Actual recommendations depend
                on the AI features connected to your application.
              </p>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-4 py-2 text-xs font-semibold text-violet-300">
              <Sparkles size={14} />
              Intelligent Education
            </span>

            <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Your learning journey,
              <br />
              <span className="text-shimmer">made more personal.</span>
            </h2>

            <p className="mt-6 text-sm leading-7 text-[#7A95AE] sm:text-base">
              EduHub is designed to support personalized learning through
              academic insights, course recommendations, and progress
              monitoring—all in one platform.
            </p>

            <div className="mt-7 space-y-4">
              {[
                "Discover courses that match your academic interests",
                "Monitor progress across your enrolled courses",
                "Identify learning goals and areas to improve",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-[#D5AE48]"
                  />
                  <p className="text-sm leading-6 text-[#B8C7D8]">{item}</p>
                </div>
              ))}
            </div>

            <Link
              href="/register"
              className="hero-btn mt-9 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold text-[#07192B]"
            >
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-[#B8C7D8]">
              <Star size={14} className="text-[#D5AE48]" />
              Learning Experience
            </span>

            <h2 className="mt-5 text-3xl font-black sm:text-4xl">
              Designed around{" "}
              <span className="text-shimmer">students</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#7A95AE]">
              A unified academic experience designed to make learning easier
              to organize and follow.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="testimonial-card rounded-2xl border border-white/[0.08] bg-[#0E2A47]/50 p-6"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={14}
                      className="fill-[#D5AE48] text-[#D5AE48]"
                    />
                  ))}
                </div>

                <p className="text-sm leading-7 text-[#8CA4BC]">
                  “{item.text}”
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#D5AE48] to-[#F5D87A] text-xs font-black text-[#07192B]">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="mt-1 text-xs text-[#7A95AE]">{item.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="relative z-10 scroll-mt-24 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-[#B8C7D8]">
              <GraduationCap size={15} />
              Built for Modern Education
            </span>

            <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              One platform for your
              <br />
              <span className="text-shimmer">academic journey.</span>
            </h2>

            <p className="mt-6 text-sm leading-7 text-[#7A95AE] sm:text-base">
              From accessing learning materials to tracking academic results,
              EduHub brings important learning tools together in a clear,
              organized experience for students and academic teams.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <InfoBadge
                icon={<ShieldCheck size={16} />}
                text="Role-Based Access"
              />
              <InfoBadge
                icon={<Clock3 size={16} />}
                text="Organized Learning"
              />
              <InfoBadge
                icon={<Zap size={16} />}
                text="Easy Access"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:border-[#D5AE48]/25 hover:bg-white/[0.04]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D5AE48]/10 text-[#D5AE48]">
                  <CheckCircle2 size={17} />
                </div>
                <span className="text-sm text-[#B8C7D8]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 px-5 pb-24 sm:px-8 lg:px-10 lg:pb-28">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[#D5AE48]/20 bg-gradient-to-br from-[#0E2A47] via-[#071929] to-[#0A2240] px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#D5AE48]/10 blur-[90px]" />

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D5AE48] text-[#07192B] shadow-lg shadow-[#D5AE48]/20">
              <GraduationCap size={31} />
            </div>

            <h2 className="mt-7 text-3xl font-black sm:text-4xl lg:text-5xl">
              Ready to start your
              <br />
              <span className="text-shimmer">learning journey?</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#8CA4BC] sm:text-base">
              Explore courses, follow your progress, and discover the tools
              EduHub offers for your academic journey.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="hero-btn inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 font-bold text-[#07192B]"
              >
                Create Account <ArrowRight size={19} />
              </Link>

              <Link
                href="/login"
                className="secondary-btn inline-flex items-center justify-center rounded-xl px-7 py-4 font-semibold"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D5AE48] text-[#07192B]">
              <GraduationCap size={21} />
            </div>
            <div>
              <p className="font-black">
                Edu<span className="text-[#D5AE48]">Hub</span>
              </p>
              <p className="mt-1 text-[10px] text-[#7A95AE]">
                AI-Enhanced Learning Management
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-xs text-[#7A95AE]">
            <Link href="/login" className="transition hover:text-white">
              Login
            </Link>
            <Link href="/register" className="transition hover:text-white">
              Register
            </Link>
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <span>© 2026 EduHub. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
