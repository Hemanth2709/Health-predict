import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Heart, Brain, Moon, Users, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Vital Scope
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Our mission is to empower individuals with personalized health
              insights through advanced data analysis and machine learning.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Approach
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-primary" />
                    Data-Driven Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We use advanced machine learning algorithms to analyze your
                    lifestyle data and provide personalized health predictions
                    based on scientific research.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Evidence-Based Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    All our health recommendations are based on peer-reviewed
                    scientific literature and established medical guidelines.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Personalized Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We recognize that everyone is unique. Our system provides
                    tailored recommendations based on your specific health
                    profile.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Health Areas We Focus On
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Heart className="h-10 w-10 text-red-500" />
                  </div>
                  <CardTitle className="text-lg mb-2">
                    Cardiovascular Health
                  </CardTitle>
                  <CardDescription>
                    Assessing heart health risks and providing strategies to
                    improve cardiovascular wellness
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Activity className="h-10 w-10 text-blue-500" />
                  </div>
                  <CardTitle className="text-lg mb-2">
                    Metabolic Health
                  </CardTitle>
                  <CardDescription>
                    Evaluating metabolic efficiency and offering guidance for
                    optimal energy management
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Moon className="h-10 w-10 text-indigo-500" />
                  </div>
                  <CardTitle className="text-lg mb-2">Sleep Quality</CardTitle>
                  <CardDescription>
                    Analyzing sleep patterns and recommending improvements for
                    restorative rest
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Brain className="h-10 w-10 text-purple-500" />
                  </div>
                  <CardTitle className="text-lg mb-2">
                    Mental Wellbeing
                  </CardTitle>
                  <CardDescription>
                    Identifying mental health risk factors and suggesting
                    strategies for emotional balance
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Experts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our team includes physicians, nutritionists, and health
                    researchers who ensure all recommendations are medically
                    sound and up-to-date with the latest research.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Data Scientists</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our data science team develops and refines the machine
                    learning models that power our health prediction algorithms.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Health Coaches</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our certified health coaches help translate predictions into
                    actionable lifestyle changes that are sustainable and
                    effective.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Start your personalized health journey today with our
              comprehensive health prediction tool.
            </p>
            <Button size="lg" asChild>
              <Link href="/predict">Get Your Vital Scopeion</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
