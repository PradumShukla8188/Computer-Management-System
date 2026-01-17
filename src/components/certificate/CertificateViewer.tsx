"use client";

import React, { useRef } from 'react';
import { Stage, Layer, Text, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

interface Element {
  id: string;
  type: 'text' | 'image' | 'rect';
  x: number;
  y: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  width?: number;
  height?: number;
  src?: string;
  rotation?: number;
  isPlaceholder?: boolean;
  fontWeight?: string;
}

interface CertificateViewerProps {
  design: Element[] | { elements: Element[] }; // Support both raw array and wrapped object
  dimensions: { width: number; height: number };
  backgroundImage?: string;
  data?: Record<string, string>; // Dynamic data for placeholders
}

const StaticImage = ({ src, x, y, width, height }: any) => {
  const [img] = useImage(src, 'anonymous');
  return <KonvaImage image={img} x={x} y={y} width={width} height={height} />;
};

export default function CertificateViewer({ design, dimensions, backgroundImage, data = {} }: CertificateViewerProps) {
  const elements = Array.isArray(design) ? design : design.elements;
  const [bgImg] = useImage(backgroundImage || '', 'anonymous');

  const interpolate = (text: string) => {
    return text.replace(/\{\{(.*?)\}\}/g, (match, key) => {
      return data[key.trim()] || match;
    });
  };

  return (
    <div className="bg-white shadow-lg overflow-hidden" style={{ width: dimensions.width, height: dimensions.height }}>
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {bgImg && (
            <KonvaImage image={bgImg} width={dimensions.width} height={dimensions.height} />
          )}
          {elements.map((el) => {
            if (el.type === 'text') {
              return (
                <Text
                  key={el.id}
                  {...el}
                  text={el.text ? interpolate(el.text) : ''}
                  draggable={false}
                />
              );
            }
            if (el.type === 'image' && el.src) {
              return (
                <StaticImage
                  key={el.id}
                  src={el.src}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
}
