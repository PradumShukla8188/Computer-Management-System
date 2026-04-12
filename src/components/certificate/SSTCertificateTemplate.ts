
export const SST_CERTIFICATE_TEMPLATE = {
  name: "SST Default Template",
  dimensions: { width: 794, height: 1123 },
  elements: [
    // Border
    { id: 'border-1', type: 'rect', x: 20, y: 20, width: 754, height: 1083, fill: 'transparent', stroke: '#D4AF37', strokeWidth: 4 },
    { id: 'border-2', type: 'rect', x: 30, y: 30, width: 734, height: 1063, fill: 'transparent', stroke: '#D4AF37', strokeWidth: 1 },

    // Header Logos
    { id: 'logo-msme', type: 'image', x: 80, y: 70, width: 80, height: 60, src: '/images/SSSS/manab adhikar jbce logo3_20210920090941_20220203085217.jpg' },
    { id: 'logo-sst-main', type: 'image', x: 357, y: 60, width: 80, height: 80, src: '/images/logo/SST-logo.png' },
    { id: 'logo-iso-top', type: 'image', x: 630, y: 70, width: 80, height: 60, src: '/images/SSSS/ISO_9001-2015-jbce6_20210920091101_20220203085121_20230819225005.jpg' },

    // Certificate No & Enrollment No
    { id: 'txt-cert-no', type: 'text', x: 80, y: 50, text: 'Certificate No: {{certificate_no}}', fontSize: 12, fontWeight: 'bold' },
    { id: 'txt-enroll-no', type: 'text', x: 530, y: 50, text: 'Enrollment No: {{roll_no}}', fontSize: 12, fontWeight: 'bold' },

    // Institute Name
    { id: 'txt-inst-name', type: 'text', x: 397, y: 170, text: 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE', fontSize: 32, fontWeight: 'bold', fill: '#A52A2A', width: 700, align: 'center', offsetX: 350 },
    
    // Reg Details
    { id: 'txt-reg-1', type: 'text', x: 397, y: 220, text: 'An ISO 9001:2015 Certified Institute', fontSize: 10, align: 'center', offsetX: 350 },
    { id: 'txt-reg-2', type: 'text', x: 397, y: 235, text: 'Registered Under Ministry of Corporate Affairs, (Govt. of India)', fontSize: 10, align: 'center', offsetX: 350 },
    { id: 'txt-reg-3', type: 'text', x: 397, y: 250, text: 'Udyam Registration No.: UDYAM-UP-35-0054566', fontSize: 10, fontWeight: 'bold', align: 'center', offsetX: 350 },
    { id: 'txt-reg-4', type: 'text', x: 397, y: 265, text: 'Registered under The Societies Registration Act, 1860 (Act No. 21).', fontSize: 10, align: 'center', offsetX: 350 },
    { id: 'txt-reg-5', type: 'text', x: 397, y: 280, text: 'Society Registration No.: HAR/05025/2025-2026', fontSize: 10, fontWeight: 'bold', align: 'center', offsetX: 350 },

    // Certificate Title
    { id: 'txt-cert-title', type: 'text', x: 397, y: 340, text: 'Certificate', fontSize: 60, fontFamily: 'cursive', fill: '#ff4d4f', align: 'center', offsetX: 350 },
    { id: 'txt-certified-that', type: 'text', x: 397, y: 410, text: 'This Is Certified That', fontSize: 20, fontWeight: 'bold', align: 'center', offsetX: 350 },

    // Photo Placeholder
    { id: 'img-student-photo', type: 'rect', x: 620, y: 350, width: 100, height: 120, fill: '#f0f0f0', stroke: '#ccc' },
    { id: 'txt-photo-label', type: 'text', x: 670, y: 410, text: 'Photo', fontSize: 14, fill: '#999', align: 'center', offsetX: 50 },

    // Student Details Grid
    { id: 'lbl-name', type: 'text', x: 80, y: 480, text: 'Mr./Mrs./Miss:', fontSize: 14, fontWeight: 'bold' },
    { id: 'val-name', type: 'text', x: 220, y: 480, text: '{{student_name}}', fontSize: 16, fontWeight: 'bold' },
    
    { id: 'lbl-father', type: 'text', x: 450, y: 480, text: "Father's Name:", fontSize: 14, fontWeight: 'bold' },
    { id: 'val-father', type: 'text', x: 570, y: 480, text: '{{father_name}}', fontSize: 14, fontWeight: 'bold', width: 150 },

    { id: 'lbl-mother', type: 'text', x: 80, y: 530, text: "Mother's Name:", fontSize: 14, fontWeight: 'bold' },
    { id: 'val-mother', type: 'text', x: 220, y: 530, text: '{{mother_name}}', fontSize: 14, fontWeight: 'bold' },

    { id: 'lbl-dob', type: 'text', x: 450, y: 530, text: 'Date of Birth:', fontSize: 14, fontWeight: 'bold' },
    { id: 'val-dob', type: 'text', x: 570, y: 530, text: '{{dob}}', fontSize: 14, fontWeight: 'bold' },

    // Course Section
    { id: 'txt-completed', type: 'text', x: 397, y: 600, text: 'Has Successfully Completed the Course:', fontSize: 16, fontWeight: 'bold', align: 'center', offsetX: 350 },
    { id: 'txt-course-val', type: 'text', x: 397, y: 640, text: '{{course_name}}', fontSize: 22, fontWeight: 'bold', align: 'center', offsetX: 350 },

    // Results Section
    { id: 'lbl-secured', type: 'text', x: 80, y: 720, text: 'And Secured:', fontSize: 14, fontWeight: 'bold' },
    { id: 'val-secured', type: 'text', x: 200, y: 720, text: '{{secured_percentage}}%', fontSize: 14, fontWeight: 'bold' },

    { id: 'lbl-grade', type: 'text', x: 450, y: 720, text: 'In the Grade:', fontSize: 14, fontWeight: 'bold' },
    { id: 'val-grade', type: 'text', x: 570, y: 720, text: '{{grade}}', fontSize: 14, fontWeight: 'bold' },

    { id: 'lbl-session', type: 'text', x: 80, y: 760, text: 'Session:', fontSize: 14, fontWeight: 'bold' },
    { id: 'val-session', type: 'text', x: 200, y: 760, text: '{{session}}', fontSize: 14, fontWeight: 'bold' },

    { id: 'lbl-center', type: 'text', x: 450, y: 760, text: 'Center Code:', fontSize: 14, fontWeight: 'bold' },
    { id: 'val-center', type: 'text', x: 570, y: 760, text: '{{center_code}}', fontSize: 14, fontWeight: 'bold' },

    // Bottom Logos
    { id: 'logo-iso-btm', type: 'image', x: 100, y: 850, width: 60, height: 60, src: '/images/SSSS/ISO-9001-2015-Certified-image-710x318-1_20230819224807.png' },
    { id: 'logo-iaf', type: 'image', x: 250, y: 850, width: 60, height: 60, src: '/images/SSSS/7777_20220915081926.jpg' },
    { id: 'logo-swach', type: 'image', x: 450, y: 850, width: 80, height: 40, src: '/images/SSSS/swachh-bharat-abhiyan  jbce 5_20210920091019_20220203085200.png' },
    { id: 'logo-skill', type: 'image', x: 630, y: 850, width: 80, height: 40, src: '/images/SSSS/digital india_20231001222002.png' },

    // Issue Date & QR
    { id: 'txt-issue-date', type: 'text', x: 397, y: 950, text: 'ISSUE DATE: {{issue_date}}', fontSize: 16, fontWeight: 'bold', align: 'center', offsetX: 350 },
    { id: 'img-qr', type: 'image', x: 620, y: 920, width: 80, height: 80, src: '{{qr_code}}' },

    // Signatures
    { id: 'line-sig-1', type: 'rect', x: 80, y: 1050, width: 150, height: 1, fill: '#000' },
    { id: 'txt-sig-1', type: 'text', x: 155, y: 1060, text: 'Controller of Exam', fontSize: 10, align: 'center', offsetX: 75 },

    { id: 'line-sig-2', type: 'rect', x: 564, y: 1050, width: 150, height: 1, fill: '#000' },
    { id: 'txt-sig-2', type: 'text', x: 639, y: 1060, text: 'Authorized Signatory', fontSize: 10, align: 'center', offsetX: 75 },

    // Footer Address
    { id: 'txt-footer-addr', type: 'text', x: 397, y: 1100, text: 'Head Office: 12, Radhey Dhikunni Dhikunni, Hardoi Uttar Pradesh 241203', fontSize: 10, align: 'center', offsetX: 350 },
  ]
};
