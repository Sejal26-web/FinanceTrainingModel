import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import bgImage from "../assets/logo.png";
import { FiShield, FiTrendingUp, FiClock, FiBarChart2, FiArrowRight, FiChevronDown, FiZap } from "react-icons/fi";

const features = [
  {
    icon: FiShield,
    title: "Dual-Model Analysis",
    desc: "KNN & Random Forest models evaluate your application simultaneously for maximum accuracy.",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: FiTrendingUp,
    title: "94%+ AUC Score",
    desc: "Our Random Forest achieves 94% ROC-AUC with hyperparameter-tuned models on 5000+ samples.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: FiClock,
    title: "Instant Results",
    desc: "Get your loan approval prediction in seconds with detailed risk assessment and confidence scores.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: FiBarChart2,
    title: "Deep Analytics",
    desc: "View confidence scores, model comparison charts, feature importance, and risk flag breakdowns.",
    gradient: "from-amber-500 to-orange-500",
  },
];

const faqData = [
  {
    q: "How does ML model predict my loan approval?",
    a: "Our system uses two machine learning models \u2014 K-Nearest Neighbors (KNN) and Random Forest \u2014 trained on thousands of loan applications. They analyze 18 features including income, credit history, loan amount, EMI burden ratio, and more to predict whether a loan would be approved. Both models run simultaneously and their predictions are compared for reliability.",
  },
  {
    q: "What factors affect my loan eligibility the most?",
    a: "Credit history is the single strongest factor. After that, income-to-loan ratio, EMI burden (monthly payment vs income), employment status, and whether you have a co-applicant all play significant roles. Our system also checks for risk flags like excessive recent applications, high debt-to-income ratio, or bad credit combined with large loan amounts.",
  },
  {
    q: "Is my data safe? Does this affect my credit score?",
    a: "Your data is encrypted and never shared with third parties. This is a prediction tool \u2014 we do not perform hard credit inquiries. Checking your eligibility here has zero impact on your actual credit score. You can check as many times as you like without any risk.",
  },
  {
    q: "What is the risk assessment system?",
    a: "Beyond ML predictions, we run 9 automated risk checks \u2014 including application frequency limits, consecutive rejection cooldown, debt-to-income ratio, minimum income threshold, and more. If risk flags accumulate past a threshold, the application is auto-flagged for review. This helps prevent fraudulent or irresponsible lending patterns.",
  },
  {
    q: "How accurate are the predictions?",
    a: "Our Random Forest model achieves 87.9% accuracy and 94.1% ROC-AUC, while KNN achieves 85.5% accuracy and 91.9% AUC. These models are trained on realistic distributions with stratified cross-validation and hyperparameter tuning. However, predictions are informational \u2014 actual bank decisions may factor in additional criteria.",
  },
  {
    q: "What types of loans are supported?",
    a: "We support predictions for Home Loans, Personal Loans, Education Loans, Vehicle Loans, Business Loans, Gold Loans, and Agriculture Loans. The core eligibility model is the same, but you can select your specific loan type when applying for more tailored risk assessment.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Background Image */}
<div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
  <img
    src={bgImage}
    alt="bg"
    className="w-[500px] opacity-100"
  />
</div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
       
       

        {/* Animated accent lines */}
        <div className="absolute top-1/3 left-0 right-0 pointer-events-none">
          <div className="hero-line h-px bg-gradient-to-r from-transparent via-cyan-500/60 dark:via-cyan-500/40 to-transparent mb-20" />
          <div className="hero-line h-px bg-gradient-to-r from-transparent via-purple-500/50 dark:via-purple-500/30 to-transparent mb-16" />
          <div className="hero-line h-px bg-gradient-to-r from-transparent via-blue-500/40 dark:via-blue-500/20 to-transparent" />
        </div>

      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center" data-aos="fade-up">
            {/* Empty space instead of badge */}
<div className="mb-8 h-[40px]"></div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="hero-shimmer-text"></span>
              <br />
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              </span>
            </h1>

            {/* Decorative pulse rings behind text */}
            <div className="relative inline-block">
              <p className="text-lg lg:text-xl t-text-muted max-w-2xl mx-auto mb-10 relative z-10">
                Predict your loan approval in seconds
                with KNN and RF              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <button
                  onClick={() => navigate("/apply")}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white text-lg shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  Apply for Loan
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/register")}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white text-lg shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    Get Started
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="group inline-flex items-center gap-3 px-8 py-4 glass-card rounded-xl font-semibold t-text text-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-cyan-500/30"
                  >
                    Sign In
                    <FiArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6" data-aos="fade-up" data-aos-delay="200">
            {[
              { value: "87.9%", label: "RF Accuracy", delay: 0 },
              { value: "94.1%", label: "ROC-AUC", delay: 100 },
              { value: "< 3s", label: "Prediction Time", delay: 200 },
              { value: "18", label: "Features Analyzed", delay: 300 },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-6 text-center rounded-xl group hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300" />
                <div className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent hero-stat-enter" style={{ animationDelay: `${stat.delay}ms` }}>
                    {stat.value}
                  </div>
                  <div className="t-text-muted text-sm mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold t-text mb-4">
              Why Choose LoanWise?
            </h2>
            <p className="t-text-muted text-lg max-w-xl mx-auto">
              Built with state-of-the-art machine learning for reliable, explainable predictions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="glass-card p-6 rounded-xl group hover:-translate-y-1 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="text-white text-xl" />
                </div>
                <h3 className="t-text font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="t-text-muted text-sm leading-relaxed">{feature.desc}</p>
              </div>
              
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold t-text mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Sign up and complete your profile with personal details.", gradient: "from-cyan-500 to-teal-500" },
              { step: "02", title: "Submit Application", desc: "Fill out the loan form and upload supporting documents.", gradient: "from-blue-500 to-indigo-500" },
              { step: "03", title: "View Results", desc: "Get instant AI predictions with risk assessment and model comparison.", gradient: "from-purple-500 to-pink-500" },
            ].map((item, i) => (
              <div
                key={item.step}
                className="relative text-center group"
                data-aos="fade-up"
                data-aos-delay={i * 150}
              >
                <div className={`text-6xl font-bold bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent opacity-30 group-hover:opacity-50 transition-opacity mb-4`}>
                  {item.step}
                </div>
                <h3 className="t-text font-semibold text-xl mb-2">{item.title}</h3>
                <p className="t-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center" data-aos="fade-up">
          <div className="relative glass-card p-12 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold t-text mb-4">Ready to Check Your Eligibility?</h2>
              <p className="t-text-muted mb-8">
                Join thousands of users who trust our system to predict their loan approval chances.
              </p>
              <button
                onClick={() => navigate(user ? "/apply" : "/register")}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white text-lg shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                {user ? "Apply Now" : "Get Started Free"}
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold t-text mb-4">
              Frequently Asked Questions
            </h2>
            <p className="t-text-muted text-lg">
            </p>
          </div>

          <div className="space-y-3" data-aos="fade-up" data-aos-delay="100">
            {faqData.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="t-text font-medium pr-4">{question}</span>
        <FiChevronDown
          className={`t-text-muted flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          size={18}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-6 pb-5 t-text-secondary text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}
