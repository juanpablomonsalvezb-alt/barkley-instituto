import { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  Loader2,
  AlertCircle,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface TextbookViewerProps {
  pdfUrl: string;
  title?: string;
  startPage: number;
  endPage: number;
  moduleNumber: number;
}

function convertToProxyUrl(url: string): string {
  if (!url) return "";
  
  // Use our server-side proxy to fetch the PDF (bypasses CORS)
  if (url.includes("drive.google.com")) {
    return `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
  }
  
  return url;
}

export function TextbookViewer({ pdfUrl, title, startPage, endPage, moduleNumber }: TextbookViewerProps) {
  const [currentPage, setCurrentPage] = useState(startPage);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.0);
  
  const totalPages = endPage - startPage + 1;
  const relativeCurrentPage = currentPage - startPage + 1;
  const proxyUrl = convertToProxyUrl(pdfUrl);
  
  useEffect(() => {
    setCurrentPage(startPage);
  }, [startPage]);

  const handlePrevPage = () => {
    if (currentPage > startPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < endPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDocumentLoadSuccess = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const handleDocumentLoadError = useCallback((err: Error) => {
    console.error("PDF load error:", err);
    setIsLoading(false);
    setError("No se pudo cargar el PDF. Verifica que el archivo esté compartido públicamente.");
  }, []);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  if (!pdfUrl) {
    return (
      <Card className="rounded-none border-slate-200">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 text-sm">No hay texto escolar configurado para esta asignatura</p>
        </CardContent>
      </Card>
    );
  }

  if (!startPage || !endPage) {
    return (
      <Card className="rounded-none border-slate-200">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 text-sm">No hay páginas asignadas a este módulo</p>
        </CardContent>
      </Card>
    );
  }

  const ViewerContent = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#F8F9FA]">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-[#A51C30]" />
          <div>
            <h3 className="text-sm font-bold text-[#0A192F]">{title || "Texto Escolar"}</h3>
            <p className="text-[10px] text-slate-500">Módulo {moduleNumber} • Páginas {startPage}-{endPage}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            data-testid="zoom-out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-slate-500 w-12 text-center">{Math.round(scale * 100)}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomIn}
            disabled={scale >= 2.5}
            data-testid="zoom-in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Badge className="bg-[#0A192F] text-white rounded-none text-[9px] px-3">
            Página {relativeCurrentPage} de {totalPages}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsFullscreen(!isFullscreen)}
            data-testid="toggle-fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "relative bg-slate-100 overflow-auto flex justify-center",
        isFullscreen ? "flex-1" : "h-[600px]"
      )}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#A51C30] mx-auto mb-2" />
              <p className="text-xs text-slate-500">Cargando página {currentPage}...</p>
            </div>
          </div>
        )}
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-sm text-slate-600 mb-2">{error}</p>
              <p className="text-xs text-slate-400">
                Asegúrate de que el PDF de Google Drive esté configurado como "Cualquier persona con el enlace puede ver"
              </p>
            </div>
          </div>
        ) : (
          <Document
            file={proxyUrl}
            onLoadSuccess={handleDocumentLoadSuccess}
            onLoadError={handleDocumentLoadError}
            loading={null}
            className="py-4"
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              loading={null}
              className="shadow-lg"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        )}
      </div>

      <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-white">
        <Button
          variant="outline"
          size="sm"
          className="rounded-none"
          onClick={handlePrevPage}
          disabled={currentPage <= startPage}
          data-testid="prev-page"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Button>
        
        <div className="flex items-center gap-1 overflow-x-auto max-w-[300px]">
          {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => {
            const pageNum = startPage + i;
            const showEllipsis = totalPages > 10 && i === 9;
            
            if (showEllipsis) {
              return <span key="ellipsis" className="text-slate-400 text-xs px-1">...</span>;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={cn(
                  "w-7 h-7 text-[10px] font-bold transition-all flex-shrink-0",
                  currentPage === pageNum
                    ? "bg-[#0A192F] text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
                data-testid={`page-${pageNum}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="rounded-none"
          onClick={handleNextPage}
          disabled={currentPage >= endPage}
          data-testid="next-page"
        >
          Siguiente
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </>
  );

  if (isFullscreen) {
    return (
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 rounded-none flex flex-col">
          <ViewerContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="rounded-none border-slate-200 overflow-hidden">
      <ViewerContent />
    </Card>
  );
}

export function TextbookViewerCompact({ pdfUrl, title, startPage, endPage, moduleNumber, onOpen }: TextbookViewerProps & { onOpen: () => void }) {
  if (!pdfUrl || !startPage || !endPage) {
    return null;
  }

  return (
    <button
      onClick={onOpen}
      className="w-full p-4 border border-slate-200 bg-white hover:border-[#A51C30] hover:shadow-md transition-all flex items-center gap-4"
      data-testid="textbook-compact-button"
    >
      <div className="w-12 h-12 bg-[#A51C30]/10 flex items-center justify-center">
        <BookOpen className="w-6 h-6 text-[#A51C30]" />
      </div>
      <div className="flex-1 text-left">
        <h4 className="text-sm font-bold text-[#0A192F]">{title || "Texto Escolar"}</h4>
        <p className="text-[10px] text-slate-500">Módulo {moduleNumber} • Páginas {startPage}-{endPage}</p>
      </div>
      <Badge className="bg-slate-100 text-slate-600 rounded-none text-[9px]">
        {endPage - startPage + 1} páginas
      </Badge>
    </button>
  );
}
