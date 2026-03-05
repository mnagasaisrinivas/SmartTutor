
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, Target, Users, ArrowRight, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SmartTutor</h1>
          </div>
          <div className="space-x-3">
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your Personal AI-Powered
            <span className="text-blue-600"> Learning Assistant</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Master any subject with personalized explanations, practice problems, and quizzes. 
            SmartTutor adapts to your learning style and helps you achieve academic success.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <Link to="/register">
                Start Learning Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive learning tools powered by advanced AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>AI Q&A</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Ask any question and get clear, step-by-step explanations tailored to your level
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Practice Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate custom practice problems to reinforce your understanding of any topic
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Smart Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Take adaptive quizzes that test your knowledge and identify areas for improvement
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Study Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate comprehensive study notes and save your progress for future reference
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-lg mx-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How SmartTutor Works
          </h2>
          <p className="text-lg text-gray-600">
            Simple steps to accelerate your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose Your Subject</h3>
            <p className="text-gray-600">
              Select from Math, Science, History, or any other subject you want to master
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Ask & Learn</h3>
            <p className="text-gray-600">
              Ask questions, generate practice problems, or create quizzes tailored to your needs
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Save your work, review past questions, and monitor your learning progress
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students who are already learning smarter with SmartTutor
          </p>
          <Button size="lg" className="text-lg px-8 py-3" asChild>
            <Link to="/register">
              Start Your Free Account <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-6 w-6" />
            <span className="text-xl font-bold">SmartTutor</span>
          </div>
          <p className="text-gray-400">
            Empowering students with AI-powered learning tools
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
