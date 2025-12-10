"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { ArrowRight, CheckCircle, Clock, Utensils, Heart, Calendar, Zap, Users, BarChart2 } from "lucide-react";

const features = [
  {
    name: 'Meal Planning',
    description: 'Create and customize your weekly meal plans with our intuitive interface.',
    icon: Calendar,
  },
  {
    name: 'Nutrition Tracking',
    description: 'Track macros, calories, and nutrients to meet your health goals.',
    icon: BarChart2,
  },
  {
    name: 'Recipe Library',
    description: 'Access hundreds of delicious, healthy recipes or add your own.',
    icon: Utensils,
  },
  {
    name: 'Grocery Lists',
    description: 'Automatically generate shopping lists from your meal plans.',
    icon: '📋',
  },
  {
    name: 'Meal Prep',
    description: 'Get step-by-step prep guides to save time in the kitchen.',
    icon: '🥗',
  },
  {
    name: 'Dietary Preferences',
    description: 'Customize for any diet: Keto, Vegan, Gluten-Free, and more.',
    icon: Heart,
  },
];

const testimonials = [
  {
    name: 'Sarah J.',
    role: 'Fitness Enthusiast',
    content: 'Meal Prepper Ultra has completely transformed my weekly routine. I save hours of planning and shopping!',
  },
  {
    name: 'Mike T.',
    role: 'Busy Professional',
    content: 'The nutrition tracking is so easy to use. I\'ve never been able to stick to my macros before!',
  },
  {
    name: 'The Johnson Family',
    role: 'Family of 4',
    content: 'Meal planning used to be a chore, now it\'s something we all enjoy doing together!',
  },
];

export default function Home() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-green-600 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Meal Prepping</span>
                  <span className="block text-green-200">Made Simple</span>
                </h1>
                <p className="mt-3 text-base text-green-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Plan, prep, and track your meals with ease. Save time, eat healthier, and reach your nutrition goals with our all-in-one meal planning solution.
                </p>
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-white">Get started in seconds</h3>
                    <p className="mt-1 text-sm text-green-100">No credit card required</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Link
                        href="/auth/register"
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Zap className="mr-2 h-5 w-5" />
                        Get Started for Free
                      </Link>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-green-400 border-opacity-50"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-green-600 text-green-100">Already have an account?</span>
                      </div>
                    </div>
                    
                    <div>
                      <Link
                        href="/auth/login"
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Sign In
                      </Link>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-center text-sm text-green-100">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </main>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1635&q=80"
              alt="Colorful and healthy meal prep containers with various foods"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for successful meal prep
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform is designed to make meal planning and prep as simple and effective as possible.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                          {typeof feature.icon === 'string' ? (
                            <span className="text-2xl">{feature.icon}</span>
                          ) : (
                            <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                          )}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.name}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to transform your meal prep?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-green-100">
            Join thousands of people who are eating better and saving time with Meal Prepper Ultra.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 sm:w-auto"
          >
Start for Free - No Credit Card Needed
          </Link>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
        <div className="relative max-w-xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by home cooks and health enthusiasts
            </h2>
          </div>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div className="flex items-center justify-center">
                        <div className="flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                          <Heart className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="mt-5 text-center">
                        <p className="text-base text-gray-600">"{testimonial.content}"</p>
                      </div>
                      <div className="mt-5">
                        <div className="font-medium text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-green-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <Link href="#" className="text-base text-gray-500 hover:text-gray-900">
                About
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link href="#" className="text-base text-gray-500 hover:text-gray-900">
                Blog
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link href="#" className="text-base text-gray-500 hover:text-gray-900">
                Pricing
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link href="#" className="text-base text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link href="#" className="text-base text-gray-500 hover:text-gray-900">
                Terms & Conditions
              </Link>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} Meal Prepper Ultra. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
