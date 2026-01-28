import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Mail, Phone, User, Loader2, Filter, Download } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Reservation {
  id: string;
  fullName: string;
  rut: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  programType: "focus" | "impulso" | "stratmore" | "tutoria";
  levelInterest?: string;
  howDidYouHear?: string;
  comments?: string;
  status: "pending" | "contacted" | "enrolled" | "rejected";
  createdAt: string;
  updatedAt: string;
}

const programTypeLabels: Record<string, string> = {
  focus: "Plan Barkley FOCUS",
  impulso: "Plan Barkley IMPULSO",
  stratmore: "Plataforma STRATMORE",
  tutoria: "Tutoría INDIVIDUAL",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  contacted: "Contactado",
  enrolled: "Matriculado",
  rejected: "Rechazado",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  contacted: "bg-blue-100 text-blue-800 border-blue-300",
  enrolled: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

export default function Reservations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: reservations = [], isLoading } = useQuery<Reservation[]>({
    queryKey: ["/api/reservations"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      toast({
        title: "Estado actualizado",
        description: "El estado de la reserva ha sido actualizado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la reserva.",
        variant: "destructive",
      });
    },
  });

  const filteredReservations = filterStatus === "all"
    ? reservations
    : reservations.filter(r => r.status === filterStatus);

  const exportToCSV = () => {
    const headers = ["Nombre", "RUT", "Email", "Teléfono", "Fecha Nacimiento", "Programa", "Nivel", "Estado", "Fecha Registro"];
    const rows = filteredReservations.map(r => [
      r.fullName,
      r.rut,
      r.email,
      r.phone,
      r.dateOfBirth,
      programTypeLabels[r.programType],
      r.levelInterest || "-",
      statusLabels[r.status],
      format(new Date(r.createdAt), "dd/MM/yyyy HH:mm", { locale: es }),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `reservas_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === "pending").length,
    contacted: reservations.filter(r => r.status === "contacted").length,
    enrolled: reservations.filter(r => r.status === "enrolled").length,
    rejected: reservations.filter(r => r.status === "rejected").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#a51c30]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#1e1e1e] mb-2">
          Reservas de Cupo
        </h1>
        <p className="text-[#1e1e1e]/70">
          Gestión de inscripciones y solicitudes de reserva
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#1e1e1e]/70">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e1e1e]">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#1e1e1e]/70">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#1e1e1e]/70">Contactados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.contacted}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#1e1e1e]/70">Matriculados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.enrolled}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#1e1e1e]/70">Rechazados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-[#1e1e1e]/70" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="contacted">Contactados</SelectItem>
                  <SelectItem value="enrolled">Matriculados</SelectItem>
                  <SelectItem value="rejected">Rechazados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={exportToCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar a CSV
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Reservations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Reservas ({filteredReservations.length})</CardTitle>
          <CardDescription>
            Información detallada de todas las solicitudes de reserva
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12 text-[#1e1e1e]/70">
              No hay reservas para mostrar
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Programa</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Registro</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{reservation.fullName}</div>
                          <div className="text-sm text-[#1e1e1e]/70">{reservation.rut}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3" />
                            <a href={`mailto:${reservation.email}`} className="text-[#a51c30] hover:underline">
                              {reservation.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3" />
                            <a href={`tel:${reservation.phone}`} className="text-[#1e1e1e]/70">
                              {reservation.phone}
                            </a>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {programTypeLabels[reservation.programType]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {reservation.levelInterest || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[reservation.status]} border`}>
                          {statusLabels[reservation.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-[#1e1e1e]/70">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(reservation.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={reservation.status}
                          onValueChange={(value) => updateStatusMutation.mutate({ id: reservation.id, status: value })}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="contacted">Contactado</SelectItem>
                            <SelectItem value="enrolled">Matriculado</SelectItem>
                            <SelectItem value="rejected">Rechazado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
