import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, BarChart3, FileText, Zap, Target, ArrowRight } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Lecture to Summary",
    description: "Upload your lectures and instantly get clear, AI-generated summaries.",
  },
  {
    icon: Brain,
    title: "Smart Quizzes",
    description: "Generate quizzes automatically to test your understanding.",
  },
  {
    icon: Target,
    title: "Study Plans",
    description: "Get personalized study plans based on your weak areas.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Track your learning progress and improve over time.",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description: "Quickly identify weak topics and focus on what matters.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">

      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-20 px-4">

          <Link to="/" className="flex items-center gap-3">
            <img src="/LOGO.png" className="h-12 w-12 object-contain" />
            <span className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              EL-Zatona
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center">
        <div className="max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Zap className="h-3.5 w-3.5" />
            EL-Zatona AI System
          </div>

          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Master your studies with AI
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload your lectures and instantly get summaries, quizzes, and smart study plans powered by AI.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild className="text-base px-8">
              <Link to="/register">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild className="text-base px-8">
              <Link to="/login">Log in</Link>
            </Button>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful AI tools designed to make studying easier and smarter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>

              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {f.title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary rounded-2xl p-10 md:p-16 text-center">

          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to start smarter studying?
          </h2>

          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Join EL-Zatona and transform the way you study.
          </p>

          <Button size="lg" variant="secondary" asChild className="text-base px-8">
            <Link to="/register">
              Get Started <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 EL-Zatona. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;