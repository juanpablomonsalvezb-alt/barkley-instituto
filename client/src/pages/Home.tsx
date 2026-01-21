import { useState, useEffect } from "react";
import { Search, Menu, GraduationCap, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Asset Imports
import csThumbnail from "@assets/generated_images/computer_science_course_thumbnail.png";
import artThumbnail from "@assets/generated_images/art_history_course_thumbnail.png";
import mathThumbnail from "@assets/generated_images/mathematics_course_thumbnail.png";
import heroBg from "@assets/generated_images/harvard_yard_entrance_with_banners.png";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredCourses = [
    {
      id: 1,
      title: "Building a Winning Mindset: Flexibility and Resiliency at Work",
      time: "2.5 hours • Start today",
      image: csThumbnail,
      category: "Featured"
    },
    {
      id: 2,
      title: "Tech Ethics: Critical Thinking in the Age of Apps, Algorithms, and AI",
      time: "2.5 hours • Start today",
      image: mathThumbnail,
      category: "Featured"
    },
    {
      id: 3,
      title: "Cultivating Power for Positive Impact",
      time: "2.5 hours • Start today",
      image: artThumbnail,
      category: "Featured"
    }
  ];

  const catalogCourses = [
    {
      id: 4,
      title: "Data Science for Business",
      time: "4–5 hours per week • Starting Mar 25, 2026",
      image: csThumbnail,
      tags: ["Featured", "Certificate"]
    },
    {
      id: 5,
      title: "Strategy Execution for Public Leadership",
      time: "4–5 hours per week • Starting Apr 1, 2026",
      image: mathThumbnail,
      tags: ["Featured", "Certificate"]
    },
    {
      id: 6,
      title: "Health Care Strategy",
      time: "4-6 hours per week • Starting Apr 15, 2026",
      image: artThumbnail,
      tags: ["Featured", "Certificate"]
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1e1e1e]">
      {/* Top Banner (Utility) */}
      <div className="bg-[#1e1e1e] text-[11px] text-white/80 py-2.5 font-bold tracking-widest uppercase border-b border-white/5">
        <div className="container-harvard flex justify-end gap-8">
          <a href="#" className="hover:text-[#a51c30] transition-colors">For Individuals</a>
          <a href="#" className="hover:text-[#a51c30] transition-colors">For Organizations</a>
        </div>
      </div>

      {/* Main Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md h-20' : 'bg-white h-24'}`}>
        <nav className="container-harvard h-full flex items-center justify-between">
          <div className="flex items-center gap-14 h-full">
            <a href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-[#a51c30] flex items-center justify-center shrink-0">
                <GraduationCap className="text-white w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[26px] font-black tracking-tight text-[#1e1e1e] uppercase leading-none">Harvard</span>
                <span className="text-[11px] tracking-[0.45em] font-black text-[#a51c30] uppercase mt-0.5">Online</span>
              </div>
            </a>
            
            <div className="hidden lg:flex items-center gap-10 text-[13px] font-black text-[#1e1e1e] uppercase tracking-[0.15em] h-full">
              {['Our Courses', 'Programs', 'Impact', 'Faculty'].map((item) => (
                <a key={item} href="#" className="hover:text-[#a51c30] transition-colors relative group h-full flex items-center">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#a51c30] transition-all group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button className="hidden sm:flex items-center gap-2 text-[12px] font-black uppercase tracking-widest hover:text-[#a51c30] transition-colors">
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
            <Button className="bg-[#a51c30] hover:bg-[#821626] text-white rounded-none uppercase tracking-[0.25em] text-[12px] font-black px-10 h-14 transition-all">
              Our Courses
            </Button>
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden">
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[700px] flex items-center overflow-hidden bg-black">
          <div className="absolute inset-0">
            <img src={heroBg} alt="" className="w-full h-full object-cover opacity-60 grayscale-[30%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
          </div>
          
          <div className="container-harvard relative z-10 pt-20">
            <div className="max-w-2xl">
              <h1 className="text-7xl md:text-[100px] font-serif text-white mb-10 leading-[0.95] font-black">
                Learn, lead, <br />
                <span className="italic font-light">transform</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed font-medium max-w-xl">
                Building the competence, curiosity, and confidence of learners on our campuses and around the world.
              </p>
              <Button size="lg" className="bg-[#a51c30] text-white hover:bg-[#821626] rounded-none px-14 py-9 text-[14px] font-black uppercase tracking-[0.3em] transition-all group">
                Our Courses <ChevronRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-24 bg-white border-b border-gray-100">
          <div className="container-harvard">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-6">
              <h2 className="text-[42px] font-serif font-black text-[#1e1e1e] leading-tight italic">New Short Courses for Career Growth</h2>
              <div className="h-1 bg-[#a51c30] w-24" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {featuredCourses.map((course) => (
                <div key={course.id} className="group flex flex-col">
                  <div className="relative aspect-[16/10] mb-8 overflow-hidden bg-gray-100">
                    <img src={course.image} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-[#a51c30] text-white rounded-none px-4 py-1.5 text-[10px] font-black tracking-widest uppercase">Featured</Badge>
                    </div>
                  </div>
                  <div className="space-y-4 px-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#a51c30]">{course.time}</p>
                    <h3 className="text-2xl font-serif font-black leading-tight text-[#1e1e1e] group-hover:underline decoration-[#a51c30] underline-offset-8 transition-all">
                      {course.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="py-32 bg-[#f9f9f9]">
          <div className="container-harvard grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 space-y-10">
              <h2 className="text-5xl md:text-6xl font-serif font-black text-[#1e1e1e] leading-[1.1] italic">Carefully crafted to <br /><span className="text-[#a51c30] not-italic">meet your goals.</span></h2>
              <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-md">
                Learn with a wide variety of courses designed to fit your schedule and professional needs.
              </p>
              <a href="#" className="inline-flex items-center gap-4 text-[#a51c30] font-black uppercase tracking-[0.3em] text-xs hover:gap-6 transition-all">
                See All Courses <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
              {catalogCourses.map((course) => (
                <div key={course.id} className="bg-white p-2 group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                   <div className="relative aspect-[16/10] overflow-hidden">
                     <img src={course.image} alt="" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" />
                     <div className="absolute top-0 right-0 flex flex-col">
                        {course.tags.map(tag => (
                          <span key={tag} className="bg-[#1e1e1e] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 mb-[1px]">{tag}</span>
                        ))}
                     </div>
                   </div>
                   <div className="p-8 space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{course.time}</p>
                     <h4 className="text-xl font-serif font-black text-[#1e1e1e] group-hover:text-[#a51c30] transition-colors">{course.title}</h4>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-40 bg-[#1e1e1e] relative overflow-hidden">
          <div className="container-harvard grid grid-cols-1 md:grid-cols-3 gap-32 relative z-10">
            {[
              { num: "150+", label: "Countries Represented" },
              { num: "500k+", label: "Learners Worldwide" },
              { num: "200+", label: "Harvard Faculty" }
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-8 group">
                <div className="text-[120px] font-serif font-black text-[#a51c30] leading-none opacity-90 group-hover:opacity-100 transition-opacity italic">{stat.num}</div>
                <div className="h-1.5 w-16 bg-[#a51c30] mx-auto scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <p className="text-[12px] font-black uppercase tracking-[0.5em] text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-100 pt-32 pb-20">
        <div className="container-harvard">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-32">
            <div className="lg:col-span-5 space-y-12">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#a51c30] flex items-center justify-center">
                  <GraduationCap className="text-white w-9 h-9" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-[28px] font-black text-[#1e1e1e] uppercase leading-none">Harvard</span>
                  <span className="text-[11px] tracking-[0.45em] font-black text-[#a51c30] uppercase mt-1">Online</span>
                </div>
              </div>
              <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-sm italic">
                "Learning, leading, transforming — building the competence and confidence of global learners."
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-16">
              {[
                { title: "Learn", links: ["Course Catalog", "Programs", "Solutions"] },
                { title: "About", links: ["Our Impact", "Faculty", "Newsletter"] },
                { title: "Legal", links: ["Privacy", "Terms", "Accessibility"] }
              ].map(col => (
                <div key={col.title} className="space-y-8">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#a51c30]">{col.title}</h4>
                  <ul className="space-y-5">
                    {col.links.map(link => (
                      <li key={link}>
                        <a href="#" className="text-sm font-bold text-[#1e1e1e] hover:text-[#a51c30] transition-colors uppercase tracking-widest">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
              © 2026 President and Fellows of Harvard College
            </p>
            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
              <span>Veritas</span>
              <div className="w-16 h-[1px] bg-gray-200" />
              <span>Cambridge, MA</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#1e1e1e] text-white p-8 flex flex-col animate-in fade-in slide-in-from-right duration-300">
          <div className="flex justify-end mb-12">
            <button onClick={() => setMobileMenuOpen(false)}><X className="w-10 h-10" /></button>
          </div>
          <div className="space-y-8">
            {['Our Courses', 'Programs', 'Impact', 'Faculty'].map(item => (
              <a key={item} href="#" className="block text-4xl font-serif font-black italic border-b border-white/10 pb-4">{item}</a>
            ))}
          </div>
          <Button className="mt-12 bg-[#a51c30] h-20 text-xl font-black rounded-none">Explore Courses</Button>
        </div>
      )}
    </div>
  );
}