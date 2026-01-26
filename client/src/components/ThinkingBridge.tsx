import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Trophy, Shield, Eye, BatteryCharging } from "lucide-react";

export function ThinkingBridge() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    const steps = [
        {
            icon: Shield,
            title: "El Freno Ejecutivo",
            desc: "Paso 1: Inhibición del impulso. Detenemos la reacción automática para permitir el análisis."
        },
        {
            icon: Eye,
            title: "El Visor Temporal",
            desc: "Paso 2: Memoria de Trabajo. Visualizamos el futuro y traemos las consecuencias al presente."
        },
        {
            icon: BatteryCharging,
            title: "La Batería Interna",
            desc: "Paso 3: Autoregulación. Generamos motivación y energía sin depender del estado de ánimo."
        }
    ];

    return (
        <section ref={containerRef} className="bg-[#0a0f1a] py-32 overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50" />

            <div className="container-harvard relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* LEFT COL: The Visual Metaphor (Bridge Animation) */}
                    <div className="relative flex flex-col items-center justify-center p-12 bg-white/5 rounded-2xl border border-white/10 shadow-2xl min-h-[400px]">
                        <div className="w-full flex items-center justify-between relative px-4">

                            {/* Brain Node */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.8 }}
                                className="flex flex-col items-center gap-3 relative z-10"
                            >
                                <div className="relative">
                                    {/* Pulsing ring for Potential */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-slate-500/20"
                                        animate={isInView ? { scale: [1, 1.5], opacity: [0.5, 0] } : {}}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                    />
                                    <motion.div
                                        className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 relative z-10"
                                        animate={isInView ? {
                                            boxShadow: ["0 0 0px rgba(148, 163, 184, 0)", "0 0 20px rgba(148, 163, 184, 0.3)", "0 0 0px rgba(148, 163, 184, 0)"]
                                        } : {}}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Brain className="w-8 h-8 text-slate-400" />
                                    </motion.div>
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Potencial</span>
                            </motion.div>

                            {/* The Bridge Line */}
                            <div className="absolute left-10 right-10 top-8 h-[2px] bg-slate-800 z-0">
                                <motion.div
                                    className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]"
                                    initial={{ width: "0%" }}
                                    animate={isInView ? { width: "100%" } : {}}
                                    transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                                />
                            </div>

                            {/* Trophy Node */}
                            <motion.div
                                initial={{ opacity: 0.5, scale: 0.8, filter: "grayscale(100%)" }}
                                animate={isInView ? { opacity: 1, scale: 1, filter: "grayscale(0%)" } : {}}
                                transition={{ duration: 0.5, delay: 3 }}
                                className="flex flex-col items-center gap-3 relative z-10"
                            >
                                <div className="relative">
                                    {/* Powerful pulse for Achievement */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-amber-500/40"
                                        initial={{ opacity: 0 }}
                                        animate={isInView ? { scale: [1, 1.8], opacity: [0.8, 0] } : {}}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 3 }}
                                    />
                                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 relative overflow-hidden z-10">
                                        <motion.div
                                            className="absolute inset-0 bg-amber-500/20"
                                            animate={isInView ? { opacity: [0.2, 0.5, 0.2] } : {}}
                                            transition={{ duration: 2, repeat: Infinity, delay: 3 }}
                                        />
                                        <Trophy className="w-8 h-8 text-amber-500" />
                                    </div>
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Logro</span>
                            </motion.div>

                        </div>

                        <div className="mt-16 text-center">
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 3.2 }}
                                className="text-white/60 text-sm font-serif italic"
                            >
                                "Construyendo el puente neuronal..."
                            </motion.p>
                        </div>
                    </div>

                    {/* RIGHT COL: The Mechanics (Text Content) */}
                    <div className="space-y-10 pl-0 lg:pl-10">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                className="text-3xl md:text-4xl font-serif font-bold text-white mb-4"
                            >
                                La Mecánica del Éxito
                            </motion.h2>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={isInView ? { width: 60 } : {}}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="h-1 bg-amber-500"
                            />
                        </div>

                        <div className="space-y-8">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 3 + (idx * 0.4), duration: 0.6 }} // Start after bridge (3s) + stagger
                                    className="flex gap-4 group"
                                >
                                    <div className="mt-1 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0 group-hover:border-amber-500/50 transition-colors">
                                        <step.icon className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-serif font-bold text-slate-200 mb-1">{step.title}</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed font-light">
                                            {step.desc}
                                        </p>
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
