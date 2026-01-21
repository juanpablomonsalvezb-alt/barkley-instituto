import { useState } from "react";
import { Search, Menu, User, BookOpen, GraduationCap, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import images
import csThumbnail from "@assets/generated_images/computer_science_course_thumbnail.png";
import artThumbnail from "@assets/generated_images/art_history_course_thumbnail.png";
import mathThumbnail from "@assets/generated_images/mathematics_course_thumbnail.png";
import heroBg from "@assets/generated_images/abstract_modern_blue_geometric_education_pattern.png";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const courses = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      school: "Harvard School of Engineering",
      image: csThumbnail,
      duration: "12 Weeks",
      level: "Introductory",
      category: "Computer Science"
    },
    {
      id: 2,
      title: "Masterpieces of World Art",
      school: "Harvard Faculty of Arts and Sciences",
      image: artThumbnail,
      duration: "8 Weeks",
      level: "Intermediate",
      category: "Humanities"
    },
    {
      id: 3,
      title: "Advanced Quantitative Methods",
      school: "Harvard Kennedy School",
      image: mathThumbnail,
      duration: "10 Weeks",
      level: "Advanced",
      category: "Data Science"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col font-sans text-[#1e1e1e]">
      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#a51c30] rounded-sm flex items-center justify-center">
                <GraduationCap className="text-white w-7 h-7" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-bold tracking-tight text-[#a51c30] uppercase">
                  Harvard
                </span>
                <span className="font-sans text-xs tracking-[0.3em] font-bold text-gray-500 uppercase">
                  Online
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-[11px] font-bold text-gray-600 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-[#a51c30] transition-colors">Courses</a>
              <a href="#" className="hover:text-[#a51c30] transition-colors">Programs</a>
              <a href="#" className="hover:text-[#a51c30] transition-colors">About</a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="SEARCH COURSES..." 
                className="pl-12 bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-[#a51c30] rounded-none text-[10px] tracking-widest font-bold h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" className="hidden sm:flex text-gray-600 hover:text-[#a51c30] uppercase tracking-[0.2em] text-[11px] font-bold">
              Log In
            </Button>
            <Button className="bg-[#a51c30] hover:bg-[#821626] text-white rounded-none uppercase tracking-[0.2em] text-[11px] font-bold px-8 h-12 transition-all">
              Register
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden bg-[#a51c30]">
          <div className="absolute inset-0 opacity-15 mix-blend-overlay">
            <img src={heroBg} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 leading-[1.1]">
                Advance Your <br />
                <span className="italic font-light opacity-90">Perspective</span>.
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed font-light max-w-2xl">
                Online courses and programs from Harvard University. 
                Experience a uniquely immersive way to learn.
              </p>
              <div className="flex flex-wrap gap-6">
                <Button size="lg" className="bg-white text-[#a51c30] hover:bg-gray-100 rounded-none px-10 py-8 text-xs font-bold uppercase tracking-[0.3em] transition-all">
                  Explore Courses
                </Button>
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-none px-10 py-8 text-xs font-bold uppercase tracking-[0.3em] transition-all">
                  Our Story
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Course Catalog */}
        <section className="py-32 container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <span className="text-[#a51c30] font-bold uppercase tracking-[0.4em] text-[10px] block">Catalog</span>
              <h2 className="text-5xl font-serif text-[#1e1e1e]">Featured Courses</h2>
            </div>
            <a href="#" className="flex items-center gap-3 text-[#a51c30] font-bold uppercase tracking-[0.3em] text-[11px] hover:underline group">
              View All Courses <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {courses.map((course) => (
              <Card key={course.id} className="group border-none shadow-none bg-transparent overflow-hidden flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden mb-8 shadow-sm">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                  />
                  <Badge className="absolute top-0 right-0 bg-[#a51c30] text-white font-bold uppercase tracking-[0.2em] px-4 py-2 text-[9px] rounded-none">
                    {course.category}
                  </Badge>
                </div>
                <CardContent className="p-0 flex-1 flex flex-col">
                  <div className="text-gray-400 uppercase tracking-[0.2em] text-[10px] font-bold mb-3">
                    {course.school}
                  </div>
                  <h3 className="text-2xl font-serif text-[#1e1e1e] mb-6 group-hover:text-[#a51c30] transition-colors cursor-pointer leading-tight">
                    {course.title}
                  </h3>
                  <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#a51c30]/60" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#a51c30]/60" />
                      {course.level}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white border-y border-gray-100 py-32">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              <div className="space-y-4">
                <div className="text-7xl font-serif text-[#a51c30] font-light">150+</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Countries Represented</div>
              </div>
              <div className="space-y-4">
                <div className="text-7xl font-serif text-[#a51c30] font-light">500k+</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Learners Worldwide</div>
              </div>
              <div className="space-y-4">
                <div className="text-7xl font-serif text-[#a51c30] font-light">200+</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Expert Instructors</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1e1e1e] py-24 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-white/10 pb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-[#a51c30] rounded-sm flex items-center justify-center">
                  <GraduationCap className="text-white w-7 h-7" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-serif text-xl font-bold tracking-tight uppercase">
                    Harvard
                  </span>
                  <span className="font-sans text-xs tracking-[0.3em] font-bold text-gray-500 uppercase">
                    Online
                  </span>
                </div>
              </div>
              <p className="text-gray-400 max-w-sm text-sm leading-relaxed mb-10 font-light">
                Harvard Online creates high-quality, engaging online learning experiences that help individuals and organizations achieve their goals.
              </p>
            </div>
            
            <div className="space-y-8">
              <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] text-white">Quick Links</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Course Catalog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Programs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Approach</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] text-white">Connect</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 flex flex-col md:flex-row justify-between gap-6 text-[9px] uppercase tracking-[0.3em] font-bold text-gray-500">
            <div>© 2026 Harvard University. All Rights Reserved.</div>
            <div className="flex flex-wrap gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}