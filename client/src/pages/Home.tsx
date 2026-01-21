import { useState } from "react";
import { Search, Menu, User, BookOpen, GraduationCap, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Navigation */}
      <nav className="border-b border-border/50 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tighter uppercase text-primary">
                Harvard<span className="text-foreground/80">Online</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">Courses</a>
              <a href="#" className="hover:text-primary transition-colors">Programs</a>
              <a href="#" className="hover:text-primary transition-colors">About</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search courses..." 
                className="pl-10 bg-muted/50 border-none focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="hidden sm:flex border-primary text-primary hover:bg-primary/5 uppercase tracking-wider text-xs font-bold px-6">
              Log In
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white uppercase tracking-wider text-xs font-bold px-6">
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
        <section className="relative py-24 overflow-hidden bg-primary">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <img src={heroBg} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
                Advance Your <br />
                <span className="italic">Perspective</span>.
              </h1>
              <p className="text-xl text-white/90 mb-10 leading-relaxed font-light">
                Learn from the world's leading experts with online courses and programs from Harvard University. 
                Experience a uniquely immersive way to learn.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-base font-bold uppercase tracking-widest">
                  Explore Courses
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-base font-bold uppercase tracking-widest">
                  Our Story
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Course Catalog */}
        <section className="py-24 container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Catalog</span>
              <h2 className="text-4xl font-serif text-foreground">Featured Courses</h2>
            </div>
            <a href="#" className="hidden sm:flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm hover:underline group">
              View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="group border-none shadow-none bg-transparent overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden mb-6">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary font-bold uppercase tracking-wider px-3 py-1 text-[10px] rounded-none shadow-sm">
                    {course.category}
                  </Badge>
                </div>
                <CardContent className="p-0">
                  <div className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold mb-2">
                    {course.school}
                  </div>
                  <h3 className="text-2xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors cursor-pointer leading-snug">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-6 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      {course.level}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="bg-muted py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4">
                <div className="text-6xl font-serif text-primary">150+</div>
                <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Countries Represented</div>
              </div>
              <div className="space-y-4">
                <div className="text-6xl font-serif text-primary">500k+</div>
                <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Learners Worldwide</div>
              </div>
              <div className="space-y-4">
                <div className="text-6xl font-serif text-primary">200+</div>
                <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">World Class Instructors</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-sidebar py-20 text-sidebar-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-sidebar-border pb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
                  <GraduationCap className="text-white w-6 h-6" />
                </div>
                <span className="font-serif text-2xl font-bold tracking-tighter uppercase">
                  Harvard<span className="text-sidebar-foreground/60">Online</span>
                </span>
              </div>
              <p className="text-sidebar-foreground/60 max-w-sm text-sm leading-relaxed mb-8">
                Online courses and programs from Harvard University. Experience a uniquely immersive way to learn from anywhere in the world.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Courses</h4>
              <ul className="space-y-4 text-sm text-sidebar-foreground/60">
                <li><a href="#" className="hover:text-primary transition-colors">Computer Science</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Business</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Humanities</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Data Science</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Connect</h4>
              <ul className="space-y-4 text-sm text-sidebar-foreground/60">
                <li><a href="#" className="hover:text-primary transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 flex flex-col md:flex-row justify-between gap-4 text-[10px] uppercase tracking-widest font-bold text-sidebar-foreground/40">
            <div>© 2024 Harvard Online. All Rights Reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary">Privacy Policy</a>
              <a href="#" className="hover:text-primary">Terms of Service</a>
              <a href="#" className="hover:text-primary">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}