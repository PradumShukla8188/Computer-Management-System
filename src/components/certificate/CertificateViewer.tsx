"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Rect } from 'react-konva';
import { jsPDF } from 'jspdf';

type Element = {
  id: string;
  type: 'text' | 'image' | 'rect';
  x: number;
  y: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
  src?: string;
  rotation?: number;
  isPlaceholder?: boolean;
  fontWeight?: string;
  align?: 'left' | 'center' | 'right';
  offsetX?: number;
  offsetY?: number;
};

interface CertificateViewerProps {
  design: Element[] | { elements: Element[] };
  dimensions: { width: number; height: number };
  backgroundImage?: string;
  data?: Record<string, string>;
  onExportStart?: () => void;
  onExportEnd?: () => void;
}

export interface CertificateViewerHandle {
  exportAsDataUrl: (pixelRatio?: number) => string | null;
  downloadPdf: (fileName?: string) => Promise<void>;
  isReady: () => boolean;
}

const loadImage = (src: string) =>
  new Promise<[string, HTMLImageElement | null]>((resolve) => {
    if (!src) {
      resolve([src, null]);
      return;
    }

    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve([src, image]);
    image.onerror = () => resolve([src, null]);
    image.src = src;
  });

const CertificateViewer = forwardRef<CertificateViewerHandle, CertificateViewerProps>(function CertificateViewer(
  { design, dimensions, backgroundImage, data = {}, onExportStart, onExportEnd },
  ref,
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [scale, setScale] = useState(1);
  const [assetMap, setAssetMap] = useState<Record<string, HTMLImageElement>>({});
  const [assetsReady, setAssetsReady] = useState(false);

  const elements = useMemo(() => (Array.isArray(design) ? design : design?.elements || []), [design]);

  const interpolate = useCallback(
    (value: string) =>
      value.replace(/\{\{(.*?)\}\}/g, (_, key) => {
        const resolved = data[key.trim()];
        return resolved === undefined || resolved === null ? '' : String(resolved);
      }),
    [data],
  );

  const imageSources = useMemo(() => {
    const sources = new Set<string>();

    if (backgroundImage) {
      sources.add(backgroundImage);
    }

    elements.forEach((element) => {
      if (element.type === 'image' && element.src) {
        const resolved = interpolate(String(element.src));
        if (resolved) {
          sources.add(resolved);
        }
      }
    });

    return Array.from(sources);
  }, [backgroundImage, elements, interpolate]);

  useEffect(() => {
    let cancelled = false;

    const preloadAssets = async () => {
      if (!imageSources.length) {
        setAssetMap({});
        setAssetsReady(true);
        return;
      }

      setAssetsReady(false);
      const loadedEntries = await Promise.all(imageSources.map((src) => loadImage(src)));
      if (cancelled) {
        return;
      }

      const nextMap: Record<string, HTMLImageElement> = {};
      loadedEntries.forEach(([src, image]) => {
        if (src && image) {
          nextMap[src] = image;
        }
      });

      setAssetMap(nextMap);
      setAssetsReady(true);
    };

    preloadAssets();

    return () => {
      cancelled = true;
    };
  }, [imageSources]);

  useEffect(() => {
    const updateScale = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) {
        return;
      }

      const availableWidth = wrapper.clientWidth || dimensions.width;
      const nextScale = Math.min(1, availableWidth / dimensions.width);
      setScale(nextScale > 0 ? nextScale : 1);
    };

    updateScale();

    const wrapper = wrapperRef.current;
    if (!wrapper || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateScale);
      return () => window.removeEventListener('resize', updateScale);
    }

    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapper);
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [dimensions.width, dimensions.height]);

  useImperativeHandle(
    ref,
    () => ({
      exportAsDataUrl: (pixelRatio = 2) => {
        if (!stageRef.current) {
          return null;
        }
        return stageRef.current.toDataURL({ pixelRatio });
      },
      downloadPdf: async (fileName = 'certificate.pdf') => {
        if (!stageRef.current || !assetsReady) return;
        
        try {
          if (onExportStart) onExportStart();
          
          // Capture at high resolution for PDF
          const dataUrl = stageRef.current.toDataURL({ pixelRatio: 3 });
          
          // Create PDF
          // dimensions are in px (approx 96dpi), for A4 we use mm
          // A4 is 210 x 297 mm
          const pdf = new jsPDF({
            orientation: dimensions.width > dimensions.height ? 'landscape' : 'portrait',
            unit: 'mm',
            format: [dimensions.width * 0.264583, dimensions.height * 0.264583] // px to mm conversion
          });

          pdf.addImage(
            dataUrl, 
            'PNG', 
            0, 
            0, 
            dimensions.width * 0.264583, 
            dimensions.height * 0.264583,
            undefined,
            'FAST'
          );
          
          pdf.save(fileName);
        } catch (error) {
          console.error('PDF Generation failed:', error);
        } finally {
          if (onExportEnd) onExportEnd();
        }
      },
      isReady: () => assetsReady,
    }),
    [assetsReady, dimensions, onExportStart, onExportEnd],
  );

  const scaledWidth = dimensions.width * scale;
  const scaledHeight = dimensions.height * scale;
  const backgroundAsset = backgroundImage ? assetMap[backgroundImage] : undefined;

  return (
    <div ref={wrapperRef} className="w-full">
      <div className="mx-auto" style={{ width: scaledWidth, height: scaledHeight }}>
        <div
          className="origin-top-left bg-white shadow-lg"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <Stage ref={stageRef} width={dimensions.width} height={dimensions.height}>
            <Layer>
              {backgroundAsset && <KonvaImage image={backgroundAsset} width={dimensions.width} height={dimensions.height} />}
              {elements.map((element) => {
                if (element.type === 'text') {
                  const fontStyle = String(element.fontWeight || '').toLowerCase().includes('bold') ? 'bold' : 'normal';
                  return (
                    <Text
                      key={element.id}
                      x={element.x}
                      y={element.y}
                      text={element.text ? interpolate(element.text) : ''}
                      fontSize={element.fontSize}
                      fontFamily={element.fontFamily || 'serif'}
                      fill={element.fill || '#000000'}
                      width={element.width}
                      height={element.height}
                      rotation={element.rotation}
                      fontStyle={fontStyle}
                      align={element.align || 'left'}
                      offsetX={element.offsetX || 0}
                      offsetY={element.offsetY || 0}
                      listening={false}
                    />
                  );
                }

                if (element.type === 'image' && element.src) {
                  const resolvedSrc = interpolate(String(element.src));
                  const image = assetMap[resolvedSrc];

                  if (!image) {
                    return null;
                  }

                  return (
                    <KonvaImage
                      key={element.id}
                      image={image}
                      x={element.x}
                      y={element.y}
                      width={element.width}
                      height={element.height}
                      rotation={element.rotation}
                      listening={false}
                    />
                  );
                }

                if (element.type === 'rect') {
                  return (
                    <Rect
                      key={element.id}
                      x={element.x}
                      y={element.y}
                      width={element.width}
                      height={element.height}
                      fill={element.fill || 'transparent'}
                      stroke={element.stroke}
                      strokeWidth={element.strokeWidth}
                      rotation={element.rotation}
                      listening={false}
                    />
                  );
                }

                return null;
              })}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
});

export default CertificateViewer;
