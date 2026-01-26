import { useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut, Download, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface TextbookViewerProps {
  pdfUrl: string;
  title?: string;
  startPage: number;
  endPage: number;
  moduleNumber: number;
}

export function TextbookViewer({ pdfUrl, title, startPage, endPage, moduleNumber }: TextbookViewerProps) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(startPage);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const totalAllowedPages = endPage - startPage + 1;
  const relativePageNum = currentPage - startPage + 1;

  // Convert Google Drive link to direct PDF link
  const getDirectPdfUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        // Use the viewer endpoint which works better for PDFs
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }
    return url;
  };

  const directPdfUrl = getDirectPdfUrl(pdfUrl);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  const goToPrevPage = () => {
    if (currentPage > startPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < endPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    if (scale < 2.0) {
      setScale(scale + 0.2);
      toast({
        description: `Zoom: ${Math.round((scale + 0.2) * 100)}%`,
      });
    }
  };

  const handleZoomOut = () => {
    if (scale > 0.6) {
      setScale(scale - 0.2);
      toast({
        description: `Zoom: ${Math.round((scale - 0.2) * 100)}%`,
      });
    }
  };

  const handleDownload = () => {
    window.open(directPdfUrl, '_blank');
    toast({
      description: 'Abriendo PDF en nueva pestaña',
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    toast({
      description: isFullscreen ? 'Modo normal' : 'Modo pantalla completa',
    });
  };

  return (
    <div className="w-full flex flex-col bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#A51C30] to-[#821626] text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BookOpen className="w-7 h-7" />
            </motion.div>
            <div>
              <h3 className="font-serif font-black text-xl">{title || "Texto Escolar"}</h3>
              <div className="flex items-center gap-3 mt-1">
                <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 text-white">
                  Módulo {moduleNumber}
                </Badge>
                <span className="text-sm text-white/90">
                  Páginas {startPage}-{endPage}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-3xl font-black tracking-tight">{relativePageNum}/{totalAllowedPages}</div>
            <div className="text-xs text-white/80 uppercase tracking-wider">Página actual</div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-100 min-h-[600px] relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-[#A51C30] mx-auto mb-4" />
              <p className="text-gray-600 font-semibold text-lg">Cargando PDF...</p>
              <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
              <p className="text-xs text-gray-400 mt-4 max-w-md">
                URL: {directPdfUrl.substring(0, 50)}...
              </p>
            </div>
          </div>
        )}
        
        <Document
          file={directPdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            console.error('PDF Load Error:', error);
            setLoading(false);
            toast({
              title: "Error al cargar PDF",
              description: "No se pudo cargar el archivo. Verifica que el link sea válido.",
              variant: "destructive",
            });
          }}
          loading={<div />}
          error={
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-600 font-semibold mb-2">Error al cargar el PDF</p>
              <p className="text-sm text-gray-600 mb-4">
                No se pudo cargar el archivo PDF
              </p>
              <details className="text-left max-w-md mx-auto">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Ver detalles técnicos
                </summary>
                <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono">
                  <p className="break-all">URL: {pdfUrl}</p>
                  <p className="mt-2 break-all">Direct URL: {directPdfUrl}</p>
                </div>
              </details>
              <Button
                onClick={() => window.open(pdfUrl, '_blank')}
                variant="outline"
                className="mt-4"
              >
                Abrir link original
              </Button>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-2xl transition-transform duration-300"
            width={Math.min(window.innerWidth - 100, 800) * scale}
            scale={scale}
          />
        </Document>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex flex-col gap-4 max-w-6xl mx-auto">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleZoomOut}
                disabled={scale <= 0.6}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ZoomOut className="w-4 h-4" />
                <span className="hidden sm:inline">Alejar</span>
              </Button>
              <Badge variant="outline" className="px-3 py-1">
                {Math.round(scale * 100)}%
              </Badge>
              <Button
                onClick={handleZoomIn}
                disabled={scale >= 2.0}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ZoomIn className="w-4 h-4" />
                <span className="hidden sm:inline">Acercar</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isFullscreen ? 'Normal' : 'Pantalla completa'}</span>
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Abrir PDF</span>
              </Button>
            </div>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center justify-between">
            <Button
              onClick={goToPrevPage}
              disabled={currentPage <= startPage}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Página del módulo: <span className="font-bold text-[#A51C30]">{relativePageNum}/{totalAllowedPages}</span>
                </span>
              </div>
              <span className="text-xs text-gray-400">
                (Página real: {currentPage})
              </span>
            </div>

            <Button
              onClick={goToNextPage}
              disabled={currentPage >= endPage}
              variant="outline"
              className="flex items-center gap-2"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="bg-blue-50 border-t border-blue-200 px-4 py-3">
        <div className="flex items-center justify-center gap-2 text-sm text-blue-800">
          <BookOpen className="w-4 h-4" />
          <span>
            Este módulo incluye {totalAllowedPages} página{totalAllowedPages !== 1 ? 's' : ''} 
            {' '}del libro "{title || 'Texto Escolar'}"
          </span>
        </div>
      </div>
    </div>
  );
}
