import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Bot, ExternalLink, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GeminiCopilot {
  id: string;
  name: string;
  geminiLink: string;
  description?: string;
  levelIds: string;
  isActive: boolean;
}

interface GeminiCopilotButtonProps {
  levelId: string;
  variant?: "default" | "floating" | "inline";
  className?: string;
}

export function GeminiCopilotButton({ 
  levelId, 
  variant = "default",
  className = "" 
}: GeminiCopilotButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  // Fetch copilot for this level
  const { data: copilot, isLoading } = useQuery<GeminiCopilot>({
    queryKey: [`/api/gemini-copilots/by-level/${levelId}`],
    retry: false,
  });

  if (isLoading || !copilot) {
    return null;
  }

  const openCopilot = () => {
    window.open(copilot.geminiLink, "_blank", "noopener,noreferrer");
    setShowDialog(false);
  };

  if (variant === "floating") {
    return (
      <>
        <button
          onClick={() => setShowDialog(true)}
          className={`fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group ${className}`}
          title={`Hablar con ${copilot.name}`}
        >
          <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-purple-600" />
                {copilot.name}
              </DialogTitle>
              <DialogDescription>
                {copilot.description || "Tu asistente de IA personalizado para ayudarte en tus estudios"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  ¿Qué puede hacer por ti?
                </h4>
                <ul className="text-sm space-y-1 text-slate-700">
                  <li>✓ Responder preguntas sobre el contenido</li>
                  <li>✓ Explicar conceptos difíciles</li>
                  <li>✓ Ayudarte con ejercicios y tareas</li>
                  <li>✓ Prepararte para evaluaciones</li>
                </ul>
              </div>
              <Button onClick={openCopilot} className="w-full" size="lg">
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Chat con {copilot.name}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (variant === "inline") {
    return (
      <Button
        onClick={openCopilot}
        variant="outline"
        className={`border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 ${className}`}
      >
        <Bot className="w-4 h-4 mr-2 text-purple-600" />
        Pregúntale a {copilot.name}
      </Button>
    );
  }

  // Default variant
  return (
    <Button
      onClick={openCopilot}
      className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 ${className}`}
    >
      <Bot className="w-4 h-4 mr-2" />
      Chat con IA
    </Button>
  );
}
