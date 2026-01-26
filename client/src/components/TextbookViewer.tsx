import { useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import { BookOpen, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

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
  const [currentPage, setCurrentPage] = useState(startPage);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const totalAllowedPages = endPage - startPage + 1;
  const relativePageNum = currentPage - startPage + 1;

  // Convert Google Drive link to direct PDF link
  const getDirectPdfUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
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

  return (
    <div className="w-full flex flex-col bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#A51C30] to-[#821626] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{title || "Texto Escolar"}</h3>
              <p className="text-sm text-white/80">
                Módulo {moduleNumber} • Páginas {startPage}-{endPage}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black">{relativePageNum}/{totalAllowedPages}</div>
            <div className="text-xs text-white/80">Página del módulo</div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-100 min-h-[600px] relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#A51C30] mx-auto mb-2" />
              <p className="text-gray-600">Cargando PDF...</p>
            </div>
          </div>
        )}
        
        <Document
          file={directPdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div />}
          error={
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-600 font-semibold mb-2">Error al cargar el PDF</p>
              <p className="text-sm text-gray-600">
                Verifica que el link de Google Drive sea público
              </p>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-2xl"
            width={Math.min(window.innerWidth - 100, 800)}
          />
        </Document>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            onClick={goToPrevPage}
            disabled={currentPage <= startPage}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Página real del PDF: <span className="font-semibold">{currentPage}</span>
            </span>
            <span className="text-xs text-gray-400">
              (Solo puedes ver páginas {startPage}-{endPage})
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
