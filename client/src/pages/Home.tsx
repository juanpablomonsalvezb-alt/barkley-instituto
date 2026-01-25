import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, GraduationCap, ChevronRight, X, Clock, Target, Brain, ArrowRight, Loader2, BookOpen, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

// Asset Imports
import csThumbnail from "@assets/generated_images/computer_science_course_thumbnail.png";
import artThumbnail from "@assets/generated_images/art_history_course_thumbnail.png";
import mathThumbnail from "@assets/generated_images/mathematics_course_thumbnail.png";
import heroBg from "@assets/generated_images/harvard_yard_entrance_with_banners.png";

import { motion } from "framer-motion";

import { ThinkingBridge } from "@/components/ThinkingBridge";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  const programs = [
    {
      id: 1,
      title: "Plan Barkley FOCUS",
      subtitle: "Jóvenes (7° a 4° Medio)",
      price: "Matrícula: $50.000 Mensualidad: $75.000",
      description: "Preparación para Exámenes Libres (Decreto 2272). Diseñado para estudiantes que necesitan estructura y apoyo constante. Foco en asignaturas oficiales (Lenguaje, Matemática, Ciencias, Historia e Inglés) con Tutor Académico.",
      image: csThumbnail,
      category: "Validación de Estudios",
      linkText: "Más Información"
    },
    {
      id: 2,
      title: "Plan Barkley IMPULSO",
      subtitle: "Adultos (Básica y Media)",
      price: "Matrícula: $35.000 Mensualidad: $55.000",
      description: "Nivelación de estudios (2x1). Ideal para adultos que buscan completar su escolaridad de forma eficiente. Incluye acompañamiento de Tutor y módulos de eficiencia cognitiva.",
      image: mathThumbnail,
      category: "Validación de Estudios",
      linkText: "Más Información"
    },
    {
      id: 3,
      title: "Plataforma STRATMORE",
      subtitle: "Entrenamiento Autónomo",
      price: "Pago Único: $150.000",
      description: "Acceso a herramientas digitales para el desarrollo de funciones ejecutivas. Entrenamiento 100% autogestionable que enseña a externalizar el tiempo y cumplir metas sin procrastinar.",
      image: artThumbnail,
      category: "Modelo Barkley & Stratmore",
      linkText: "Obtener Acceso"
    },
    {
      id: 4,
      title: "Tutoría INDIVIDUAL",
      subtitle: "Instalación del Método",
      price: "Pack 4 Sesiones: $200.000",
      description: "Instalación personalizada del método. Acompañamiento uno a uno para implementar las estrategias en la vida diaria, trabajando la responsabilidad y el fortalecimiento de la voluntad.",
      image: heroBg,
      category: "Modelo Barkley & Stratmore",
      linkText: "Reservar Sesión"
    }
  ];

  const pillars = [
    {
      title: "Externalización del Tiempo",
      description: "Uso de herramientas visuales y temporales para hacer el paso del tiempo 'tangible', evitando la ceguera temporal y mejorando la gestión de plazos.",
      icon: Clock
    },
    {
      title: "Memoria de Trabajo Externa",
      description: "Sistemas de recordatorios y visualización de objetivos que reducen la carga cognitiva, permitiendo al estudiante enfocarse en ejecutar.",
      icon: Target
    },
    {
      title: "Recompensas Inmediatas",
      description: "Implementación de ciclos de retroalimentación positiva y recompensas frecuentes para mantener la motivación dopaminérgica constante.",
      icon: Award
    },
    {
      title: "Andamiaje de la Previsión",
      description: "Planificación estructurada que no depende de la voluntad, sino de un sistema que guía la acción paso a paso hacia el futuro.",
      icon: Brain
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1e1e1e] antialiased">
      {/* Top Banner - Harvard Style */}
      <div className="bg-[#1e1e1e] text-[10px] text-white/70 py-2.5 font-medium tracking-[0.2em] uppercase border-b border-white/10">
        <div className="container-harvard flex justify-end gap-10">
          <a href="#" className="hover:text-[#a51c30] transition-colors duration-200">Validación de Estudios</a>
          <a href="#" className="hover:text-[#a51c30] transition-colors duration-200">Entrenamiento Barkley</a>
        </div>
      </div>

      {/* Main Navigation - Refined Harvard Style */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm h-20' : 'bg-white h-24'}`}>
        <nav className="container-harvard h-full flex items-center justify-between">
          <div className="flex items-center gap-16 h-full">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-[#a51c30] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                <GraduationCap className="text-white w-7 h-7" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-[24px] font-bold tracking-[-0.02em] text-[#1e1e1e] leading-none">Barkley</span>
                <span className="text-[10px] tracking-[0.5em] font-semibold text-[#a51c30] uppercase mt-0.5">Instituto</span>
              </div>
            </a>

            <div className="hidden lg:flex items-center gap-12 text-[13px] font-medium text-[#1e1e1e] tracking-[0.05em] h-full">
              {['Programas', 'Método', 'Plataforma', 'Contacto'].map((item) => (
                <a key={item} href="#" className="hover:text-[#a51c30] transition-colors duration-200 relative group h-full flex items-center">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#a51c30] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden sm:flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] text-[#1e1e1e]/70 hover:text-[#a51c30] transition-colors duration-200">
              <Search className="w-4 h-4" />
            </button>
            {/* Botón de Acceso Directo (Solicitado por Usuario) */}
            <Link href="/dashboard">
              <Button variant="outline" className="border-2 border-[#A51C30] text-[#A51C30] hover:bg-[#A51C30] hover:text-white rounded-none uppercase tracking-[0.2em] text-[11px] font-semibold px-6 h-12 transition-all mr-4 hidden sm:flex items-center gap-2">
                <Target className="w-4 h-4" />
                Acceso Intranet
              </Button>
            </Link>

            {isLoading ? (
              <Button className="bg-[#1e1e1e] hover:bg-[#333] text-white rounded-none uppercase tracking-[0.2em] text-[11px] font-semibold px-8 h-12 transition-all flex items-center gap-2.5" disabled>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cargando...
              </Button>
            ) : (
              <a href="/api/auth/google" data-testid="btn-login-google">
                <Button className="bg-[#1e1e1e] hover:bg-[#333] text-white rounded-none uppercase tracking-[0.2em] text-[11px] font-semibold px-8 h-12 transition-all flex items-center gap-2.5 shadow-sm hover:shadow-md">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Ingresar con Google
                </Button>
              </a>
            )}
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-[#1e1e1e]">
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section - Harvard Elegant Style */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#1e1e1e]">
          <div className="absolute inset-0">
            <img src={heroBg} alt="" className="w-full h-full object-cover opacity-50 grayscale-[20%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="container-harvard relative z-10 pt-24 pb-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-8 leading-[1.1] font-bold tracking-tight">
                Método Barkley:<br />
                <span className="text-[#a51c30] italic font-normal">Entrena tu cerebro para ganar.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/85 mb-10 leading-[1.7] font-normal max-w-2xl pl-0 border-l-0">
                La primera plataforma de validación de estudios en Chile que elimina la procrastinación mediante neurociencia aplicada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-[#a51c30] text-white hover:bg-[#8a1828] rounded-none px-10 py-6 text-[13px] font-semibold uppercase tracking-[0.15em] transition-all group shadow-lg hover:shadow-xl">
                  Explorar Programas <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform inline-block" />
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-none px-10 py-6 text-[13px] font-semibold uppercase tracking-[0.15em] transition-all">
                  Conoce el Método
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Thinking Bridge - Metaphor Section */}
        <ThinkingBridge />

        {/* Programs Grid - Harvard Clean Layout */}
        <section className="py-32 bg-white">
          <div className="container-harvard">
            <div className="mb-20">
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1e1e1e] leading-[1.1] tracking-tight mb-4">
                Nuestros Programas
              </h2>
              <div className="h-0.5 bg-[#a51c30] w-20 mb-6" />
              <p className="text-lg text-[#1e1e1e]/70 leading-[1.7] max-w-2xl">
                Programas diseñados para construir competencia, curiosidad y confianza mediante metodologías basadas en neurociencia.
              </p>
            </div>

            <div className="flex flex-col gap-0 border-t border-[#1e1e1e]/10">
              {programs.map((prog, index) => (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="group grid grid-cols-1 lg:grid-cols-2 min-h-[500px] border-b border-[#1e1e1e]/10"
                >
                  {/* Text Section */}
                  <div className={`flex flex-col justify-center p-12 lg:p-20 order-2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2 bg-[#f4f4f4]'}`}>
                    <div className="max-w-md mx-auto lg:mx-0">
                      <div className="mb-6">
                        <Badge className="bg-[#A51C30] text-white rounded-none px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase">{prog.category}</Badge>
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-serif font-bold leading-tight text-[#1e1e1e] mb-4 group-hover:text-[#A51C30] transition-colors duration-300">
                        {prog.title}
                      </h3>
                      <p className="text-xs font-bold text-[#1e1e1e]/40 uppercase tracking-[0.2em] mb-2">{prog.subtitle}</p>
                      <p className="text-sm font-medium text-[#A51C30] uppercase tracking-[0.15em] mb-6">{prog.price}</p>
                      <p className="text-[#1e1e1e]/80 text-[18px] leading-[1.6] font-sans-safe mb-8 font-light">
                        {prog.description}
                      </p>
                      <a href="#" className="inline-flex items-center gap-3 text-[#A51C30] font-bold uppercase tracking-[0.2em] text-[11px] group-hover:gap-4 transition-all duration-200 border-b-2 border-transparent group-hover:border-[#A51C30] pb-1">
                        {prog.linkText} <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Image Section - With Harvard-style Rounded Corners */}
                  <div className={`relative h-[400px] lg:h-auto order-1 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} p-8 lg:p-12 flex items-center justify-center`}>
                    <div className="w-full h-full overflow-hidden rounded-2xl shadow-xl">
                      <img src={prog.image} alt="" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-[1.05]" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* The Method Section - Harvard Refined */}
        <section className="py-32 bg-[#fafafa]">
          <div className="container-harvard grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1e1e1e] leading-[1.1] tracking-tight">
                El Método Barkley
              </h2>
              <div className="h-0.5 bg-[#a51c30] w-16" />
              <p className="text-lg text-[#1e1e1e]/75 leading-[1.7] font-normal">
                Un andamiaje externo para las funciones ejecutivas. No confiamos en la "fuerza de voluntad" del alumno; diseñamos un entorno digital que externaliza el tiempo, las metas y las recompensas. Es una estrategia de neurociencia aplicada para vencer la procrastinación.
              </p>
              <blockquote className="text-[#1e1e1e]/70 leading-[1.7] italic border-l-3 border-[#a51c30] pl-6 py-2 text-lg">
                "Mientras otros entregan contenido, nosotros entregamos capacidad de ejecución."
              </blockquote>
              <Button className="bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white rounded-none px-8 py-5 text-[12px] font-semibold uppercase tracking-[0.15em] transition-all">
                Comienza tu Transformación
              </Button>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillars.map((pillar, i) => (
                <div key={i} className="bg-white p-8 group hover:shadow-lg transition-all duration-300 border border-[#1e1e1e]/5 hover:border-[#a51c30]/20">
                  <pillar.icon className="w-9 h-9 text-[#a51c30] mb-6" />
                  <h4 className="text-lg font-serif font-bold text-[#1e1e1e] mb-3 leading-tight">{pillar.title}</h4>
                  <p className="text-sm text-[#1e1e1e]/65 leading-[1.6] font-normal">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section - Harvard Elegant */}
        <section className="py-32 bg-[#1e1e1e] relative overflow-hidden">
          <div className="container-harvard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="space-y-6">
                <h2 className="text-5xl md:text-6xl font-serif font-bold text-white leading-[1.1] tracking-tight">
                  El Fundamento<br />
                  <span className="text-[#a51c30] italic font-normal">de tu Éxito</span>
                </h2>
                <div className="h-0.5 bg-[#a51c30] w-16" />
                <p className="text-white/75 text-lg leading-[1.7] max-w-md font-normal">
                  El conocimiento es saber qué hacer; el Método Barkley es hacer lo que sabes. En Barkley Instituto, cerramos la brecha entre la intención y el resultado.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-16">
                <div className="space-y-3">
                  <div className="text-6xl md:text-7xl font-serif font-bold text-[#a51c30] italic leading-none">100%</div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Tasa de Aprobación</p>
                </div>
                <div className="space-y-3">
                  <div className="text-6xl md:text-7xl font-serif font-bold text-[#a51c30] italic leading-none">20m</div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Ráfagas de Estudio</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Harvard Clean Style */}
      <footer className="bg-white border-t border-[#1e1e1e]/10 pt-24 pb-16">
        <div className="container-harvard">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-20">
            <div className="lg:col-span-5 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#a51c30] flex items-center justify-center">
                  <GraduationCap className="text-white w-7 h-7" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-serif text-[24px] font-bold text-[#1e1e1e] leading-none">Barkley</span>
                  <span className="text-[10px] tracking-[0.5em] font-semibold text-[#a51c30] uppercase mt-0.5">Instituto</span>
                </div>
              </div>
              <p className="text-base text-[#1e1e1e]/65 leading-[1.7] max-w-sm italic font-normal">
                "Cerrando la brecha entre la intención y el resultado mediante neurociencia aplicada."
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12">
              {[
                { title: "Programas", links: ["Plan Focus", "Plan Impulso", "Stratmore"] },
                { title: "Método", links: ["Pilares", "Neurociencia", "Investigación"] },
                { title: "Legal", links: ["Privacidad", "Términos", "Cookies"] }
              ].map(col => (
                <div key={col.title} className="space-y-6">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a51c30]">{col.title}</h4>
                  <ul className="space-y-3">
                    {col.links.map(link => (
                      <li key={link}>
                        <a href="#" className="text-sm font-medium text-[#1e1e1e]/70 hover:text-[#a51c30] transition-colors duration-200">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-[#1e1e1e]/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-medium tracking-[0.15em] text-[#1e1e1e]/50 uppercase">
              © 2026 Barkley Instituto Chile. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-[10px] font-medium tracking-[0.15em] text-[#1e1e1e]/50">
              <span>Neurociencia Aplicada</span>
              <div className="w-12 h-px bg-[#1e1e1e]/20" />
              <span>Chile</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#1e1e1e] text-white p-8 flex flex-col">
          <div className="flex justify-end mb-12">
            <button onClick={() => setMobileMenuOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>
          <div className="space-y-6">
            {['Programas', 'Método', 'Plataforma', 'Contacto'].map(item => (
              <a key={item} href="#" className="block text-3xl font-serif font-bold border-b border-white/10 pb-4 hover:text-[#a51c30] transition-colors">{item}</a>
            ))}
          </div>
          <Button className="mt-12 bg-[#a51c30] hover:bg-[#8a1828] h-14 text-base font-semibold rounded-none uppercase tracking-[0.15em]">Ver Programas</Button>
        </div>
      )}
    </div>
  );
}