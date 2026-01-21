import { useState } from "react";
import { Search, Menu, BookOpen, GraduationCap, Clock, ChevronRight, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Asset Imports
import csThumbnail from "@assets/generated_images/computer_science_course_thumbnail.png";
import artThumbnail from "@assets/generated_images/art_history_course_thumbnail.png";
import mathThumbnail from "@assets/generated_images/mathematics_course_thumbnail.png";
import heroBg from "@assets/generated_images/harvard_yard_entrance_with_banners.png";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const courseCategories = [
    "Technology & Innovation",
    "Leadership & Communication",
    "Health Care",
    "Arts & Humanities",
    "Business & Management"
  ];

  const featuredCourses = [
    {
      id: 1,
      title: "Building a Winning Mindset: Flexibility and Resiliency at Work",
      time: "2.5 hours",
      type: "Featured",
      image: csThumbnail,
      category: "Leadership"
    },
    {
      id: 2,
      title: "Tech Ethics: Critical Thinking in the Age of Apps, Algorithms, and AI",
      time: "2.5 hours",
      type: "Featured",
      image: mathThumbnail,
      category: "Technology"
    },
    {
      id: 3,
      title: "Cultivating Power for Positive Impact",
      time: "2.5 hours",
      type: "Featured",
      image: artThumbnail,
      category: "Business"
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#a51c30] selection:text-white">
      {/* Top Utility Bar */}
      <div className="bg-[#1e1e1e] text-[10px] text-white/60 py-2 hidden md:block">
        <div className="container mx-auto px-6 flex justify-end gap-6 font-bold tracking-widest uppercase">
          <a href="#" className="hover:text-white transition-colors">For Individuals</a>
          <a href="#" className="hover:text-white transition-colors">For Organizations</a>
          <a href="#" className="hover:text-white transition-colors">About Harvard Online</a>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#a51c30] flex items-center justify-center">
                <GraduationCap className="text-white w-9 h-9" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-black tracking-tight text-[#1e1e1e] uppercase leading-none">
                  Harvard
                </span>
                <span className="font-sans text-[11px] tracking-[0.4em] font-black text-[#a51c30] uppercase mt-1">
                  Online
                </span>
              </div>
            </div>
            
            <div className="hidden xl:flex items-center gap-10 text-[12px] font-black text-[#1e1e1e] uppercase tracking-[0.15em]">
              <a href="#" className="hover:text-[#a51c30] transition-colors border-b-2 border-transparent hover:border-[#a51c30] pb-1">Our Courses</a>
              <a href="#" className="hover:text-[#a51c30] transition-colors border-b-2 border-transparent hover:border-[#a51c30] pb-1">Programs</a>
              <a href="#" className="hover:text-[#a51c30] transition-colors border-b-2 border-transparent hover:border-[#a51c30] pb-1">Impact</a>
              <a href="#" className="hover:text-[#a51c30] transition-colors border-b-2 border-transparent hover:border-[#a51c30] pb-1">Faculty</a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 hover:bg-gray-50 transition-colors">
              <Search className="w-6 h-6 text-[#1e1e1e]" />
            </button>
            <Button className="bg-[#a51c30] hover:bg-[#821626] text-white rounded-none uppercase tracking-[0.2em] text-[12px] font-black px-10 h-14 transition-all shadow-md">
              Explore Courses
            </Button>
            <Button variant="ghost" size="icon" className="xl:hidden">
              <Menu className="w-8 h-8 text-[#1e1e1e]" />
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Real Harvard Online Hero */}
        <section className="relative h-[85vh] flex items-center overflow-hidden bg-[#1e1e1e]">
          <div className="absolute inset-0">
            <img src={heroBg} alt="" className="w-full h-full object-cover opacity-60 scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <div className="mb-8 flex items-center gap-4">
                <div className="h-[2px] w-12 bg-[#a51c30]" />
                <span className="text-white font-black uppercase tracking-[0.4em] text-xs">Learn, Lead, Transform</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif text-white mb-10 leading-[1.05] font-black italic">
                Advance your <br />
                <span className="not-italic text-[#a51c30]">perspective.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-14 leading-relaxed font-light max-w-2xl border-l-4 border-[#a51c30] pl-8">
                Building the competence, curiosity, and confidence of learners on our campuses and around the world.
              </p>
              <div className="flex flex-wrap gap-6">
                <Button size="lg" className="bg-[#a51c30] text-white hover:bg-[#821626] rounded-none px-12 py-9 text-[13px] font-black uppercase tracking-[0.3em] transition-all group">
                  Our Courses <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* New Course Slider Mimic */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-16">
              <div>
                <h2 className="text-4xl font-serif font-black text-[#1e1e1e] mb-4 italic">New Short Courses for Career Growth</h2>
                <p className="text-gray-500 font-medium tracking-wide">Developed by leading Harvard faculty.</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-gray-200 hover:border-[#a51c30] hover:text-[#a51c30]">
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-gray-200 hover:border-[#a51c30] hover:text-[#a51c30]">
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredCourses.map((course) => (
                <div key={course.id} className="group cursor-pointer">
                  <div className="relative aspect-[4/3] mb-8 overflow-hidden">
                    <img src={course.image} alt="" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute top-0 left-0 bg-[#a51c30] text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
                      {course.type}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#a51c30]">
                      <span>{course.time}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>Start Today</span>
                    </div>
                    <h3 className="text-2xl font-serif font-black leading-tight text-[#1e1e1e] group-hover:underline decoration-[#a51c30] underline-offset-8">
                      {course.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Course Finder Section */}
        <section className="bg-[#f4f4f4] py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto bg-white shadow-2xl p-12 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#a51c30]/5 rounded-bl-full" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                  <h2 className="text-5xl font-serif font-black mb-8 italic">Carefully crafted to <br /><span className="text-[#a51c30] not-italic">meet your goals.</span></h2>
                  <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                    Tell us what you want to learn, and we'll help you find the perfect course or program to advance your career.
                  </p>
                  <Button className="bg-[#1e1e1e] hover:bg-black text-white rounded-none px-10 py-7 text-[12px] font-black uppercase tracking-[0.3em]">
                    Help Me Choose
                  </Button>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a51c30]">I want to learn about</label>
                    <select className="w-full bg-gray-50 border-b-2 border-gray-200 p-4 font-bold text-[#1e1e1e] focus:outline-none focus:border-[#a51c30] appearance-none cursor-pointer">
                      <option>Any Topic</option>
                      {courseCategories.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a51c30]">I can commit to</label>
                    <select className="w-full bg-gray-50 border-b-2 border-gray-200 p-4 font-bold text-[#1e1e1e] focus:outline-none focus:border-[#a51c30] appearance-none cursor-pointer">
                      <option>Any Length</option>
                      <option>One Month or Less</option>
                      <option>Two Months</option>
                      <option>Three Months or More</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Stats */}
        <section className="bg-[#1e1e1e] py-32 border-t border-white/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24 text-center">
              <div className="space-y-6 group">
                <div className="text-8xl font-serif text-[#a51c30] font-black italic opacity-80 group-hover:opacity-100 transition-opacity">150+</div>
                <div className="h-1 w-12 bg-[#a51c30] mx-auto" />
                <div className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Countries Represented</div>
              </div>
              <div className="space-y-6 group">
                <div className="text-8xl font-serif text-[#a51c30] font-black italic opacity-80 group-hover:opacity-100 transition-opacity">500k+</div>
                <div className="h-1 w-12 bg-[#a51c30] mx-auto" />
                <div className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Learners Globally</div>
              </div>
              <div className="space-y-6 group">
                <div className="text-8xl font-serif text-[#a51c30] font-black italic opacity-80 group-hover:opacity-100 transition-opacity">200+</div>
                <div className="h-1 w-12 bg-[#a51c30] mx-auto" />
                <div className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Harvard Faculty</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Official Style Footer */}
      <footer className="bg-white border-t border-gray-100 py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-[#a51c30] flex items-center justify-center">
                  <GraduationCap className="text-white w-8 h-8" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-2xl font-black text-[#1e1e1e] uppercase">Harvard</span>
                  <span className="text-[10px] tracking-[0.4em] font-black text-[#a51c30] uppercase">Online</span>
                </div>
              </div>
              <p className="text-gray-500 text-lg leading-relaxed font-medium mb-10">
                Building the competence, curiosity, and confidence of learners everywhere.
              </p>
              <div className="flex gap-4">
                {['FB', 'TW', 'LI', 'IG'].map(s => (
                  <button key={s} className="w-12 h-12 border-2 border-gray-100 flex items-center justify-center text-[10px] font-black hover:border-[#a51c30] hover:text-[#a51c30] transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#a51c30]">Learn</h4>
                <ul className="space-y-4 text-sm font-bold text-[#1e1e1e]">
                  <li><a href="#" className="hover:text-[#a51c30] transition-colors">Course Catalog</a></li>
                  <li><a href="#" className="hover:text-[#a51c30] transition-colors">Programs</a></li>
                  <li><a href="#" className="hover:text-[#a51c30] transition-colors">Organization Solutions</a></li>
                </ul>
              </div>
              <div className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#a51c30]">About</h4>
                <ul className="space-y-4 text-sm font-bold text-[#1e1e1e]">
                  <li><a href="#" className="hover:text-[#a51c30] transition-colors">Our Impact</a></li>
                  <li><a href="#" className="hover:text-[#a51c30] transition-colors">Faculty</a></li>
                  <li><a href="#" className="hover:text-[#a51c30] transition-colors">Newsletter</a></li>
                </ul>
              </div>
              <div className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#a51c30]">Legal</h4>
                <ul className="space-y-4 text-sm font-bold text-[#1e1e1e]">
                  <li><a href="#" className="hover:text-[#a51c30] transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-[#a51c30] transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-[#a51c30] transition-colors">Accessibility</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-32 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              © 2026 President and Fellows of Harvard College
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Veritas</span>
               <div className="w-12 h-[2px] bg-gray-100" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}