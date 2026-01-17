"use client";

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Text, Rect, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { Space, Button, Input, Select, ColorPicker, Slider, Typography, Card, Divider, Tabs, List, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  FontColorsOutlined, 
  FileImageOutlined, 
  FontSizeOutlined,
  DeleteOutlined,
  CopyOutlined,
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BlockOutlined,
  PieChartOutlined
} from '@ant-design/icons';

const { Title, Text: AntText } = Typography;
const { TabPane } = Tabs;

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

const URLImage = ({ src, x, y, width, height, id, isSelected, onSelect, onChange }: any) => {
  const [img] = useImage(src, 'anonymous');
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        image={img}
        x={x}
        y={y}
        width={width}
        height={height}
        id={id}
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        draggable
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, (node as any).getAttr('width') * scaleX),
            height: Math.max(5, (node as any).getAttr('height') * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const EditableText = ({ id, x, y, text, fontSize, fill, fontFamily, fontWeight, isSelected, onSelect, onChange }: any) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        text={text}
        x={x}
        y={y}
        fontSize={fontSize}
        fill={fill}
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        id={id}
        ref={shapeRef}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          onChange({
            y: (node as any).getAttr('y'),
            rotation: (node as any).getAttr('rotation'),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
        />
      )}
    </>
  );
};

export const CertificateDesigner = forwardRef(({ onSave }: { onSave?: (data: any) => void }, ref) => {
  const [elements, setElements] = useState<Element[]>([
    { id: '1', type: 'text', x: 561, y: 150, text: 'CERTIFICATE', fontSize: 40, fontFamily: 'Arial', fill: '#000', fontWeight: 'bold' },
    { id: '2', type: 'text', x: 561, y: 220, text: 'OF APPRECIATION', fontSize: 20, fontFamily: 'Arial', fill: '#666' },
    { id: '3', type: 'text', x: 561, y: 350, text: 'This is to certify that', fontSize: 18, fontFamily: 'serif', fill: '#333' },
    { id: '4', type: 'text', x: 561, y: 420, text: '{{student_name}}', fontSize: 36, fontFamily: 'serif', fill: '#c00', isPlaceholder: true, fontWeight: 'bold' },
    { id: '5', type: 'text', x: 561, y: 500, text: 'has successfully completed the course of {{course_name}}', fontSize: 18, fontFamily: 'serif', fill: '#333' },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bgImage] = useImage('https://via.placeholder.com/1123x794/ffffff/cccccc?text=Certificate+Background', 'anonymous');
  const [stageSize, setStageSize] = useState({ width: 1123, height: 794 });
  const [scale, setScale] = useState(1);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive scaling logic
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width, height });
        const newScale = Math.min((width - 40) / 1123, (height - 40) / 794);
        setScale(Math.max(0.1, Math.min(newScale, 1.5)));
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    handleResize();

    return () => resizeObserver.disconnect();
  }, []);

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const save = () => {
    if (onSave) {
      onSave({
        elements,
        dimensions: { width: 1123, height: 794 },
      });
    }
  };

  useImperativeHandle(ref, () => ({
    save,
    addText,
    addImage
  }));
  
  const addText = (text: string = 'New Text', isPlaceholder: boolean = false) => {
    const newElement: Element = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      x: 561, // Center
      y: 397, // Center
      text: text,
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#000',
      isPlaceholder
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const addImage = (url: string) => {
    const newElement: Element = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'image',
      x: 480,
      y: 320,
      src: url,
      width: 150,
      height: 150,
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        addImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedElement = elements.find(el => el.id === selectedId);

  const updateSelectedElement = (updates: Partial<Element>) => {
    setElements(elements.map(el => el.id === selectedId ? { ...el, ...updates } : el));
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const placeholders = [
    { label: 'Student Name', value: '{{student_name}}' },
    { label: 'Course Name', value: '{{course_name}}' },
    { label: 'Duration', value: '{{duration}}' },
    { label: 'Date', value: '{{date}}' },
    { label: 'Institute Name', value: '{{institute_name}}' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Left */}
        <div className="w-64 border-r bg-white flex flex-col shrink-0">
          <Tabs defaultActiveKey="elements" className="h-full designer-tabs px-3" size="small">
            <TabPane tab="Elements" key="elements">
              <div className="flex flex-col gap-4 py-3 overflow-y-auto max-h-[calc(100vh-220px)]">
                <Title level={5} className="!mb-1">Placeholders</Title>
                <div className="grid grid-cols-1 gap-2">
                  {placeholders.map(item => (
                    <div 
                      key={item.value}
                      className="cursor-pointer hover:bg-blue-50 border border-gray-100 p-2 rounded-lg transition-colors group flex items-center justify-between"
                      onClick={() => addText(item.value, true)}
                    >
                      <div>
                        <div className="text-xs font-semibold text-gray-800">{item.label}</div>
                        <AntText code className="text-[10px]">{item.value}</AntText>
                      </div>
                      <PlusOutlined className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            </TabPane>
            
            <TabPane tab="Layers" key="layers">
              <div className="py-2 overflow-y-auto max-h-[calc(100vh-220px)]">
                <List
                  size="small"
                  dataSource={elements.slice().reverse()}
                  renderItem={item => (
                    <List.Item 
                      className={`cursor-pointer px-2 py-1.5 rounded-lg mb-1 transition-all ${selectedId === item.id ? 'bg-blue-50 border-blue-200 border' : 'border border-transparent hover:bg-gray-50'}`}
                      onClick={() => setSelectedId(item.id)}
                      extra={
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />} 
                          size="small"
                          onClick={(e) => { e.stopPropagation(); removeElement(item.id); }} 
                        />
                      }
                    >
                      <AntText ellipsis className="text-xs w-32">
                        {item.type === 'text' ? (item.isPlaceholder ? '⭐ ' : '') + item.text : '📷 Image'}
                      </AntText>
                    </List.Item>
                  )}
                />
              </div>
            </TabPane>
          </Tabs>
        </div>

        {/* Canvas Area */}
        <div 
          className="flex-1 bg-[#f0f2f5] p-4 flex items-center justify-center overflow-hidden relative"
          ref={containerRef}
        >
          <div 
            className="bg-white shadow-xl flex items-center justify-center overflow-hidden"
            style={{ 
              width: 1123 * scale, 
              height: 794 * scale,
              flexShrink: 0
            }}
          >
             <Stage
              width={1123 * scale}
              height={794 * scale}
              scaleX={scale}
              scaleY={scale}
              onMouseDown={checkDeselect}
              onTouchStart={checkDeselect}
              ref={stageRef}
            >
              <Layer>
                {bgImage && (
                   <KonvaImage
                    image={bgImage}
                    width={1123}
                    height={794}
                  />
                )}
                {elements.map((el, i) => {
                  if (el.type === 'text') {
                    return (
                      <EditableText
                        key={el.id}
                        {...el}
                        isSelected={el.id === selectedId}
                        onSelect={() => setSelectedId(el.id)}
                        onChange={(newAttrs: any) => {
                          updateSelectedElement(newAttrs);
                        }}
                      />
                    );
                  }
                  if (el.type === 'image') {
                    return (
                      <URLImage
                        key={el.id}
                        {...el}
                        isSelected={el.id === selectedId}
                        onSelect={() => setSelectedId(el.id)}
                        onChange={(newAttrs: any) => {
                          updateSelectedElement(newAttrs);
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </Layer>
            </Stage>
          </div>
          
          <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-lg text-[10px] font-bold text-gray-400 border border-gray-100 uppercase tracking-widest">
             <span className="flex items-center gap-1"><PieChartOutlined style={{fontSize: 10}} /> {Math.round(scale * 100)}%</span>
             <div className="w-[1px] h-3 bg-gray-200" />
             <span>1123 x 794 PX</span>
          </div>
        </div>

        {/* Sidebar Right - Properties */}
        <div className="w-72 border-l bg-white p-4 overflow-y-auto shrink-0">
          {selectedElement ? (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                 <Title level={5} className="!mb-0 uppercase tracking-wider text-xs font-bold text-gray-400">Properties</Title>
                 <Button type="text" size="small" icon={<DeleteOutlined />} danger onClick={() => removeElement(selectedId!)} />
              </div>
              
              {selectedElement.type === 'text' && (
                <>
                  <div className="space-y-1">
                    <AntText type="secondary" className="text-[10px] font-bold uppercase">Content</AntText>
                    <Input.TextArea 
                      value={selectedElement.text} 
                      onChange={e => updateSelectedElement({ text: e.target.value })}
                      rows={3}
                      size="small"
                      className="rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                       <AntText type="secondary" className="text-[10px] font-bold uppercase">Size</AntText>
                       <AntText className="text-xs">{selectedElement.fontSize}px</AntText>
                    </div>
                    <Slider 
                      min={8} 
                      max={72} 
                      value={selectedElement.fontSize} 
                      onChange={val => updateSelectedElement({ fontSize: val })} 
                      tooltip={{ open: false }}
                    />
                  </div>

                  <div className="space-y-1">
                    <AntText type="secondary" className="text-[10px] font-bold uppercase">Font Family</AntText>
                    <Select
                      className="w-full"
                      size="small"
                      value={selectedElement.fontFamily}
                      onChange={val => updateSelectedElement({ fontFamily: val })}
                      options={[
                        { label: 'Arial', value: 'Arial' },
                        { label: 'Times New Roman', value: 'Times New Roman' },
                        { label: 'Courier New', value: 'Courier New' },
                        { label: 'Georgia', value: 'Georgia' },
                        { label: 'Impact', value: 'Impact' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1">
                    <AntText type="secondary" className="text-[10px] font-bold uppercase">Text Color</AntText>
                    <ColorPicker 
                      value={selectedElement.fill} 
                      onChange={(color) => updateSelectedElement({ fill: color.toHexString() })} 
                      size="small"
                      showText
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <AntText type="secondary" className="text-[10px] font-bold uppercase">Weight</AntText>
                    <Button.Group size="small" className="w-full">
                      <Button 
                        block
                        type={selectedElement.fontWeight === 'bold' ? 'primary' : 'default'}
                        onClick={() => updateSelectedElement({ fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' })}
                      >
                        Bold
                      </Button>
                      <Button block>Italic</Button>
                    </Button.Group>
                  </div>
                </>
              )}
              
              {selectedElement.type === 'image' && (
                 <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl text-center border-2 border-dashed border-gray-200">
                        <img src={selectedElement.src} className="max-h-32 mx-auto mb-2 rounded" />
                        <AntText type="secondary" className="text-[10px]">Image Element</AntText>
                    </div>
                 </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FontColorsOutlined style={{ fontSize: 24 }} />
              </div>
              <Title level={5}>No Element Selected</Title>
              <AntText type="secondary">Select an item on the canvas to edit its details</AntText>
            </div>
          )}
        </div>
      </div>
      
      <input 
        type="file" 
        id="logo-upload" 
        className="hidden" 
        accept="image/*" 
        onChange={handleLogoUpload} 
      />
    </div>
  );
});

export default CertificateDesigner;
