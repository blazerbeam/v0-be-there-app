"use client";

import { useState } from "react";
import { Heart, Calendar, MessageCircle, Bell, ChevronRight, Menu, X } from "lucide-react";

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
              <span className="text-xl font-semibold text-gray-900">Be There</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-rose-500 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-rose-500 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-rose-500 transition-colors">Pricing</a>
              <button className="bg-rose-500 text-white px-5 py-2 rounded-full hover:bg-rose-600 transition-colors">
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-rose-100">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-600 hover:text-rose-500">Features</a>
              <a href="#how-it-works" className="block text-gray-600 hover:text-rose-500">How it Works</a>
              <a href="#pricing" className="block text-gray-600 hover:text-rose-500">Pricing</a>
              <button className="w-full bg-rose-500 text-white px-5 py-2 rounded-full hover:bg-rose-600">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            <span className="block">Be there in ways that fit</span>
            <span className="block">your busy life.</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Strengthen your relationships with thoughtful, timely gestures. 
            Be There helps you stay connected with the people who matter most.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-rose-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
              Start Free Trial
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-rose-200 text-rose-600 px-8 py-4 rounded-full text-lg font-medium hover:border-rose-300 hover:bg-rose-50 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Simple ways to show you care
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Small gestures that make a big difference
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-rose-500" />}
              title="Never Miss a Moment"
              description="Get gentle reminders for birthdays, anniversaries, and special occasions that matter to your loved ones."
            />
            <FeatureCard
              icon={<MessageCircle className="w-8 h-8 text-rose-500" />}
              title="Thoughtful Messages"
              description="Access curated message templates or create personalized notes that resonate with your relationships."
            />
            <FeatureCard
              icon={<Bell className="w-8 h-8 text-rose-500" />}
              title="Smart Suggestions"
              description="Receive intelligent recommendations for when and how to reach out based on your relationship patterns."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-rose-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How Be There Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Three simple steps to stronger relationships
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Add Your People"
              description="Import contacts or add the important people in your life. Tell us about your relationship with them."
            />
            <StepCard
              number="2"
              title="Set Your Rhythm"
              description="Choose how often you'd like to connect. We'll help you maintain consistent, meaningful touchpoints."
            />
            <StepCard
              number="3"
              title="Be Present"
              description="Act on our suggestions, send thoughtful messages, and watch your relationships flourish."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-rose-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to be more present?
          </h2>
          <p className="mt-4 text-xl text-rose-100">
            Join thousands of people building stronger relationships, one thoughtful moment at a time.
          </p>
          <button className="mt-8 bg-white text-rose-500 px-8 py-4 rounded-full text-lg font-medium hover:bg-rose-50 transition-colors">
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <span className="text-lg font-semibold text-white">Be There</span>
            </div>
            <div className="flex gap-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            &copy; 2026 Be There. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-rose-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-500 text-white rounded-full text-xl font-bold mb-6">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
