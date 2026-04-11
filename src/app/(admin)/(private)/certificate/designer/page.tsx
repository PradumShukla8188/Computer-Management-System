"use client";

import React, { useState, useRef } from 'react';
import { Layout, Typography, Button, Space, Card, Divider } from 'antd';
import { SaveOutlined, EyeOutlined, ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import CertificateDesigner from '@/components/certificate/CertificateDesigner';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

import { useRouter } from 'next/navigation';
import { Modal, Input as AntInput } from 'antd';
import { useAddCertificateTemplate } from '../hooks/useCertificateApi';

export default function CertificateDesignerPage() {
  const { mutate: addTemplate, isPending: isSaving } = useAddCertificateTemplate();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('New Certificate Template');
  const [designData, setDesignData] = useState<any>(null);
  
  const designerRef = useRef<any>(null);
  const router = useRouter();

  const handleSaveClick = (data: any) => {
    setDesignData(data);
    setIsNameModalOpen(true);
  };

  const handleFinalSave = async () => {
    if (!templateName.trim()) return;
    
    setIsNameModalOpen(false);
    addTemplate({
      name: templateName,
      design: designData.elements,
      dimensions: designData.dimensions,
    }, {
      onSuccess: () => {
        router.push('/certificate/list');
      }
    });
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4 overflow-hidden -mt-2">
      {/* Premium Header Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            type="text" 
            className="hover:bg-gray-100 rounded-xl"
            onClick={() => router.back()}
          />
          <div className="h-8 w-[1px] bg-gray-200 mx-1" />
          <div>
            <Title level={5} className="!m-0 text-gray-800">Certificate Designer</Title>
            <Typography.Text type="secondary" className="text-[10px] uppercase tracking-wider font-semibold">Template Editor</Typography.Text>
          </div>
        </div>

        <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
          <Button 
            type="text" 
            className="flex items-center gap-2 hover:bg-white hover:shadow-sm h-9 px-3"
            onClick={() => designerRef.current?.addText()}
          >
            <span className="bg-blue-500 text-white w-5 h-5 rounded-md flex items-center justify-center"><PlusOutlined style={{fontSize: 10}} /></span>
            <span className="text-sm font-medium">Add Text</span>
          </Button>
          <div className="w-[1px] h-5 bg-gray-200 mx-1" />
          <Button 
            type="text" 
            className="flex items-center gap-2 hover:bg-white hover:shadow-sm h-9 px-3"
            onClick={() => document.getElementById('logo-upload')?.click()}
          >
            <span className="bg-indigo-500 text-white w-5 h-5 rounded-md flex items-center justify-center"><EyeOutlined style={{fontSize: 10}} /></span>
            <span className="text-sm font-medium">Add Image</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Button icon={<EyeOutlined />} className="rounded-xl">Preview</Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            loading={isSaving}
            className="bg-blue-600 hover:bg-blue-700 h-10 px-6 rounded-xl shadow-md border-none flex items-center gap-2"
            onClick={() => designerRef.current?.save?.()}
          >
            Save Template
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-0 relative">
        <CertificateDesigner ref={designerRef} onSave={handleSaveClick} />
      </div>

      <Modal
        title="Template Name"
        open={isNameModalOpen}
        onOk={handleFinalSave}
        onCancel={() => setIsNameModalOpen(false)}
        okText="Save template"
        confirmLoading={isSaving}
      >
        <div className="py-4">
          <Typography.Text strong className="mb-2 block">Enter a name for this certificate template</Typography.Text>
          <AntInput 
            size="large" 
            value={templateName} 
            onChange={e => setTemplateName(e.target.value)} 
            placeholder="e.g., Summer Course Certificate"
            className="rounded-xl"
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
}
