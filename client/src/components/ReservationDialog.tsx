import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";

const reservationSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  rut: z.string().min(8, "RUT inválido"),
  email: z.string().email("Email inválido").refine(
    (email) => email.endsWith("@gmail.com"),
    { message: "Debe usar una cuenta de Gmail (@gmail.com)" }
  ),
  phone: z.string().min(8, "Teléfono inválido"),
  dateOfBirth: z.string(),
  programType: z.enum(["focus", "impulso", "stratmore", "tutoria"]),
  levelInterest: z.string().optional(),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Precios de los programas
const programPrices: Record<string, { matricula: string; curso: string }> = {
  focus: { matricula: "$150.000", curso: "$450.000" },
  impulso: { matricula: "$120.000", curso: "$380.000" },
  stratmore: { matricula: "$80.000", curso: "$280.000" },
  tutoria: { matricula: "$100.000", curso: "$350.000" },
};

export function ReservationDialog({ open, onOpenChange }: ReservationDialogProps) {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      fullName: "",
      rut: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      programType: "focus",
      levelInterest: "",
    },
  });

  const selectedProgram = form.watch("programType");

  const mutation = useMutation({
    mutationFn: async (data: ReservationFormData) => {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al enviar la reserva");
      }

      return response.json();
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast({
        title: "¡Reserva enviada!",
        description: "Nos pondremos en contacto contigo pronto.",
      });
      form.reset();
      setTimeout(() => {
        setIsSuccess(false);
        onOpenChange(false);
      }, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReservationFormData) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      form.reset();
      setIsSuccess(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-[#a51c30]" />
            <DialogTitle className="text-2xl font-serif text-center">¡Reserva Confirmada!</DialogTitle>
            <DialogDescription className="text-center">
              Hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-3xl font-serif text-[#1e1e1e]">
                Formulario de Reserva de Cupo
              </DialogTitle>
              <DialogDescription>
                Completa los siguientes datos para reservar tu cupo en nuestros programas.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              {/* Datos Personales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1e1e1e] border-b border-[#1e1e1e]/10 pb-2">
                  Datos Personales
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre Completo *</Label>
                    <Input
                      id="fullName"
                      placeholder="Juan Pérez González"
                      {...form.register("fullName")}
                      className="rounded-none"
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rut">RUT *</Label>
                    <Input
                      id="rut"
                      placeholder="12.345.678-9"
                      {...form.register("rut")}
                      className="rounded-none"
                    />
                    {form.formState.errors.rut && (
                      <p className="text-sm text-red-500">{form.formState.errors.rut.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Gmail requerido) *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu.correo@gmail.com"
                      {...form.register("email")}
                      className="rounded-none"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      {...form.register("phone")}
                      className="rounded-none"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fecha de Nacimiento *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...form.register("dateOfBirth")}
                    className="rounded-none"
                  />
                  {form.formState.errors.dateOfBirth && (
                    <p className="text-sm text-red-500">{form.formState.errors.dateOfBirth.message}</p>
                  )}
                </div>
              </div>

              {/* Datos del Programa */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1e1e1e] border-b border-[#1e1e1e]/10 pb-2">
                  Programa de Interés
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="programType">Tipo de Programa *</Label>
                    <Select
                      onValueChange={(value) => form.setValue("programType", value as any)}
                      defaultValue={form.watch("programType")}
                    >
                      <SelectTrigger className="rounded-none">
                        <SelectValue placeholder="Selecciona un programa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="focus">Plan Barkley FOCUS (Jóvenes 7° a 4° Medio)</SelectItem>
                        <SelectItem value="impulso">Plan Barkley IMPULSO (Adultos)</SelectItem>
                        <SelectItem value="stratmore">Plataforma STRATMORE (Entrenamiento)</SelectItem>
                        <SelectItem value="tutoria">Tutoría INDIVIDUAL</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.programType && (
                      <p className="text-sm text-red-500">{form.formState.errors.programType.message}</p>
                    )}
                  </div>

                  {/* Precios del programa seleccionado */}
                  {selectedProgram && (
                    <div className="bg-[#a51c30]/5 border border-[#a51c30]/20 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-[#1e1e1e] text-sm">Valores del Programa</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-[#1e1e1e]/60 mb-1">Matrícula</p>
                          <p className="text-2xl font-bold text-[#a51c30]">
                            {programPrices[selectedProgram].matricula}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#1e1e1e]/60 mb-1">Valor Curso</p>
                          <p className="text-2xl font-bold text-[#a51c30]">
                            {programPrices[selectedProgram].curso}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="levelInterest">Nivel de Interés</Label>
                    <Select onValueChange={(value) => form.setValue("levelInterest", value)}>
                      <SelectTrigger className="rounded-none">
                        <SelectValue placeholder="Selecciona un nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7b">7° Básico</SelectItem>
                        <SelectItem value="8b">8° Básico</SelectItem>
                        <SelectItem value="1m">1° Medio</SelectItem>
                        <SelectItem value="2m">2° Medio</SelectItem>
                        <SelectItem value="3m">3° Medio</SelectItem>
                        <SelectItem value="4m">4° Medio</SelectItem>
                        <SelectItem value="adultos">Adultos (Básica/Media)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#1e1e1e]/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={mutation.isPending}
                  className="rounded-none"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-[#a51c30] hover:bg-[#8a1828] text-white rounded-none px-8"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Reserva"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
