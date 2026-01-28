import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Settings, Shield, Eye, Battery, Award } from "lucide-react";

export function ThinkingBridge() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    const steps = [
        {
            icon: Shield,
            title: "1. Enfoque en Autonomía (Self-Paced)",
            subtitle: "Paso 1",
            desc: "Rompemos la inercia de la educación pasiva. Tomas el control total de tu tiempo con contenido On-Demand de alto impacto, eliminando la dependencia de horarios fijos y clases magistrales innecesarias."
        },
        {
            icon: Eye,
            title: "2. Aprendizaje Adaptativo (Mastery Path)",
            subtitle: "Paso 2",
            desc: "Avanzas solo cuando demuestras dominio. Nuestra IA especialista detecta tus brechas en tiempo real y personaliza tu ruta, asegurando que cada concepto sea una competencia ganada antes de dar el siguiente paso."
        },
        {
            icon: Battery,
            title: "3. Success Mentoring (Performance)",
            subtitle: "Paso 3",
            desc: "Gestión de éxito estratégica. Tu mentor de rendimiento, inspirado en el modelo del MIT, supervisa tu progreso y entrena tu disciplina para asegurar que alcances tu meta de validación oficial en tiempo récord."
        }
    ];

    // Easing profesional tipo Apple/Stripe
    const smoothEasing = [0.4, 0, 0.2, 1];

    return (
        <section ref={containerRef} className="bg-white py-20 overflow-hidden relative">
            {/* Background Tech Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--tw-gradient-stops))] from-[#ff9f1c]/5 via-transparent to-transparent opacity-30" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e1e08_1px,transparent_1px),linear-gradient(to_bottom,#1e1e1e08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            <div className="container-harvard relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* LEFT COL: Image Replacement */}
                    <div className="relative">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.8, ease: smoothEasing }}
                            className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 shadow-2xl shadow-gray-200/60 overflow-hidden"
                        >
                            {/* Image */}
                            <img 
                                src="/1.png" 
                                alt="Ruta de Aceleración Académica" 
                                className="w-full h-auto rounded-xl"
                            />

                    {/* RIGHT COL: Dynamic Text Content */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.8, ease: smoothEasing }}
                                    className="flex flex-col items-center gap-4 relative z-20"
                                >
                                    <div className="relative">
                                        {/* Outer Glow Ring */}
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-[#ff9f1c]/30 blur-xl"
                                            animate={isInView ? { 
                                                scale: [1, 1.3, 1],
                                                opacity: [0.5, 0.8, 0.5]
                                            } : {}}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                        {/* Pulsing Ring */}
                                        <motion.div
                                            className="absolute -inset-2 rounded-full border-2 border-[#ff9f1c]/40"
                                            animate={isInView ? { 
                                                scale: [1, 1.4], 
                                                opacity: [0.6, 0] 
                                            } : {}}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                        />
                                        {/* Main Node */}
                                        <motion.div
                                            className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff9f1c] to-[#ff8c00] flex items-center justify-center border-2 border-[#ff9f1c]/50 relative z-10 shadow-[0_0_30px_rgba(255,159,28,0.5)]"
                                            animate={isInView ? {
                                                boxShadow: [
                                                    "0 0 30px rgba(255,159,28,0.5)",
                                                    "0 0 50px rgba(255,159,28,0.8)",
                                                    "0 0 30px rgba(255,159,28,0.5)"
                                                ]
                                            } : {}}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <Settings className="w-10 h-10 text-white" strokeWidth={2.5} />
                                        </motion.div>
                                    </div>
                                    <motion.span 
                                        initial={{ opacity: 0 }}
                                        animate={isInView ? { opacity: 1 } : {}}
                                        transition={{ delay: 0.5 }}
                                        className="text-[9px] uppercase tracking-[0.2em] text-[#ff9f1c] font-bold"
                                    >
                                        Competencia
                                    </motion.span>
                                </motion.div>

                                {/* NEURAL FLOW LINE (The Bridge) */}
                                <div className="absolute left-[5rem] right-[5rem] top-10 h-[3px] bg-gray-200 z-0 rounded-full overflow-hidden">
                                    {/* Background track */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />
                                    
                                    {/* Main animated line */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-[#ff9f1c] via-[#ffd700] to-[#ff9f1c] shadow-[0_0_15px_rgba(255,159,28,0.8)]"
                                        initial={{ width: "0%", left: "0%" }}
                                        animate={isInView ? { width: "100%", left: "0%" } : {}}
                                        transition={{ 
                                            duration: 2.5, 
                                            ease: smoothEasing,
                                            delay: 1
                                        }}
                                    />
                                    
                                    {/* Particle effects traveling along the line */}
                                    {[0, 0.3, 0.6, 0.9].map((delay, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                            initial={{ left: "0%", opacity: 0 }}
                                            animate={isInView ? {
                                                left: ["0%", "100%"],
                                                opacity: [0, 1, 1, 0]
                                            } : {}}
                                            transition={{
                                                duration: 2,
                                                ease: "linear",
                                                delay: 1 + delay,
                                                repeat: Infinity,
                                                repeatDelay: 0.5
                                            }}
                                        />
                                    ))}
                                    
                                    {/* Organic pulse/wave effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                        initial={{ x: "-100%" }}
                                        animate={isInView ? { x: "200%" } : {}}
                                        transition={{
                                            duration: 3,
                                            ease: "easeInOut",
                                            delay: 1,
                                            repeat: Infinity,
                                            repeatDelay: 1
                                        }}
                                    />
                                </div>

                                {/* END NODE: Validación de Estudios */}
                                <motion.div
                                    initial={{ opacity: 0.3, scale: 0.5, filter: "grayscale(100%)" }}
                                    animate={isInView ? { 
                                        opacity: 1, 
                                        scale: 1, 
                                        filter: "grayscale(0%)" 
                                    } : {}}
                                    transition={{ 
                                        duration: 0.8, 
                                        delay: 3.5,
                                        ease: smoothEasing 
                                    }}
                                    className="flex flex-col items-center gap-4 relative z-20"
                                >
                                    <div className="relative">
                                        {/* Victory Pulse */}
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-[#ffd700]/40 blur-xl"
                                            initial={{ opacity: 0 }}
                                            animate={isInView ? { 
                                                scale: [1, 1.5, 1],
                                                opacity: [0, 0.8, 0]
                                            } : {}}
                                            transition={{ 
                                                duration: 2, 
                                                repeat: Infinity, 
                                                ease: "easeOut",
                                                delay: 3.5
                                            }}
                                        />
                                        {/* Main Shield/Trophy Node */}
                                        <motion.div
                                            className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ffed4e] flex items-center justify-center border-2 border-[#ffd700]/50 relative overflow-hidden z-10 shadow-[0_0_40px_rgba(255,215,0,0.6)]"
                                            initial={{ rotate: -180 }}
                                            animate={isInView ? { 
                                                rotate: 0,
                                                boxShadow: [
                                                    "0 0 40px rgba(255,215,0,0.6)",
                                                    "0 0 60px rgba(255,215,0,1)",
                                                    "0 0 40px rgba(255,215,0,0.6)"
                                                ]
                                            } : {}}
                                            transition={{ 
                                                rotate: { duration: 1, delay: 3.5, ease: smoothEasing },
                                                boxShadow: { duration: 2, repeat: Infinity, delay: 3.5 }
                                            }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-white/20"
                                                animate={isInView ? { opacity: [0.2, 0.6, 0.2] } : {}}
                                                transition={{ duration: 2, repeat: Infinity, delay: 3.5 }}
                                            />
                                            <Award className="w-10 h-10 text-white" strokeWidth={2.5} />
                                        </motion.div>
                                    </div>
                                    <motion.span 
                                        initial={{ opacity: 0 }}
                                        animate={isInView ? { opacity: 1 } : {}}
                                        transition={{ delay: 4 }}
                                        className="text-[9px] uppercase tracking-[0.2em] text-[#ffd700] font-bold"
                                    >
                                        Validación
                                    </motion.span>
                                </motion.div>

                            </div>

                            {/* Bottom Text with Typewriter Effect */}
                            <div className="mt-12 text-center px-4">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    transition={{ delay: 4.5, duration: 0.5 }}
                                    className="text-[#ff9f1c] text-xs font-bold uppercase tracking-[0.15em]"
                                >
                                    Ruta de Aceleración Académica
                                </motion.p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COL: Dynamic Text Content */}
                    <div className="space-y-6 pl-0 lg:pl-10">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ ease: smoothEasing }}
                                className="text-2xl md:text-3xl font-serif font-bold text-[#1e1e1e] mb-3 leading-tight"
                            >
                                La Mecánica de la Maestría:<br />
                                <span className="text-[#ff9f1c] italic font-normal">De la Neurociencia a la Competencia Real</span>
                            </motion.h2>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={isInView ? { width: 60 } : {}}
                                transition={{ delay: 0.2, duration: 0.8, ease: smoothEasing }}
                                className="h-0.5 bg-gradient-to-r from-[#ff9f1c] to-[#ffd700] rounded-full"
                            />
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.4, ease: smoothEasing }}
                            className="text-[#1e1e1e]/70 text-sm leading-relaxed"
                        >
                            Nuestro método no solo te entrega contenido; entrena tu capacidad de ejecutarlo bajo el estándar de WGU.
                        </motion.p>

                        <div className="space-y-4">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ 
                                        delay: 1 + (idx * 0.5), 
                                        duration: 0.8,
                                        ease: smoothEasing
                                    }}
                                    className="group"
                                >
                                    <div className="flex gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-200 hover:border-[#ff9f1c]/30 hover:bg-gray-50 transition-all duration-300">
                                        {/* Icon with illumination effect */}
                                        <motion.div 
                                            className="mt-0.5 w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-white flex items-center justify-center border border-gray-200 shrink-0 group-hover:border-[#ff9f1c]/50 transition-all relative overflow-hidden"
                                            animate={isInView ? {
                                                boxShadow: [
                                                    "0 0 0px rgba(255,159,28,0)",
                                                    "0 0 20px rgba(255,159,28,0.3)",
                                                    "0 0 0px rgba(255,159,28,0)"
                                                ]
                                            } : {}}
                                            transition={{
                                                delay: 1 + (idx * 0.5) + 0.3,
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-[#ff9f1c]/20"
                                                initial={{ opacity: 0 }}
                                                animate={isInView ? { opacity: [0, 0.5, 0] } : {}}
                                                transition={{
                                                    delay: 1 + (idx * 0.5) + 0.3,
                                                    duration: 1,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                            <step.icon className="w-5 h-5 text-[#ff9f1c] relative z-10" strokeWidth={2.5} />
                                        </motion.div>
                                        
                                        <div className="flex-1">
                                            <motion.h4 
                                                className="text-base font-serif font-bold text-[#1e1e1e] mb-1"
                                                initial={{ opacity: 0 }}
                                                animate={isInView ? { opacity: 1 } : {}}
                                                transition={{ delay: 1 + (idx * 0.5) + 0.2 }}
                                            >
                                                {step.title}
                                            </motion.h4>
                                            <motion.p
                                                className="text-[10px] text-[#ff9f1c] font-semibold uppercase tracking-wider mb-1.5"
                                                initial={{ opacity: 0 }}
                                                animate={isInView ? { opacity: 1 } : {}}
                                                transition={{ delay: 1 + (idx * 0.5) + 0.4 }}
                                            >
                                                {step.subtitle}
                                            </motion.p>
                                            <motion.p 
                                                className="text-xs text-[#1e1e1e]/65 leading-relaxed"
                                                initial={{ opacity: 0 }}
                                                animate={isInView ? { opacity: 1 } : {}}
                                                transition={{ delay: 1 + (idx * 0.5) + 0.5 }}
                                            >
                                                {step.desc}
                                            </motion.p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
