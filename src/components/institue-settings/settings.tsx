// 'use client'

// import React, { useState } from 'react'
// import { useForm, SubmitHandler } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import { Mail, MapPin, Phone, Settings, Users, Building2, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
// import "./setting.css"
// import { ApiHitter } from '@/lib/axiosApi/apiHitter'
// import { useMutation } from '@tanstack/react-query'

// // Zod validation schema
// // const SettingsSchema = z.object({
// //     instituteName: z.string().min(3, 'Institute name must be at least 3 characters').max(100),
// //     instituteAddress: z.string().min(10, 'Address must be at least 10 characters').max(300),
// //     instituteContact: z.string().regex(/^[0-9\s\-\+\(\)]+$/, 'Invalid phone number').min(10, 'Phone must be at least 10 digits'),
// //     instituteEmail: z.string().email('Invalid email address'),
// //     description: z.string().max(500, 'Description cannot exceed 500 characters').optional().or(z.literal('')),
// //     logo: z.string().regex(/\.(jpg|jpeg|png|gif|webp)$/i, 'Invalid file format'),
// // })

// const SettingsSchema = z.object({
//     instituteName: z
//         .string()
//         .nonempty("Institute name is required")
//         .min(3, "Institute name must be at least 3 characters")
//         .max(100, "Institute name must not exceed 100 characters"),

//     instituteAddress: z
//         .string()
//         .nonempty("Institute address is required")
//         .min(10, "Address must be at least 10 characters")
//         .max(300, "Address must not exceed 300 characters"),

//     instituteContact: z
//         .string()
//         .nonempty("Institute contact number is required")
//         .regex(/^[0-9\s\-\+\(\)]+$/, "Invalid phone number format")
//         .min(10, "Phone number must be at least 10 digits"),

//     instituteEmail: z
//         .string()
//         .nonempty("Institute email is required")
//         .email("Invalid email address"),

//     description: z
//         .string()
//         .nonempty("Description is required")
//         .max(500, "Description cannot exceed 500 characters"),

//     logo: z
//         .instanceof(File, { message: "Institute logo is required" })
//         .refine(
//             (file) =>
//                 ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
//             "Logo must be an image (jpg, jpeg, png, gif, webp)"
//         )
//         .refine(
//             (file) => file.size <= 2 * 1024 * 1024,
//             "Logo size must be less than 2MB"
//         ),

//     // logo: z
//     //     .string()
//     //     .nonempty("Institute logo is required")
//     //     .regex(
//     //         /\.(jpg|jpeg|png|gif|webp)$/i,
//     //         "Logo must be an image (jpg, jpeg, png, gif, webp)"
//     //     ),
// });

// type SettingsFormData = z.infer<typeof SettingsSchema>

// export default function SettingsComponent() {
//     const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
//     const [logoPreview, setLogoPreview] = useState<string | null>(null)
//     const [selectedFiles, setSelectedFiles] = useState<{
//         logo: File | null;
//     }>({
//         logo: null,
//     });

//     const {
//         register,
//         handleSubmit,
//         clearErrors,
//         formState: { errors, isSubmitting },
//         reset,
//     } = useForm<SettingsFormData>({
//         resolver: zodResolver(SettingsSchema),
//         defaultValues: {
//             instituteName: 'Global Education Institute',
//             instituteAddress: '123 Education Street, New York, NY 10001',
//             instituteContact: '+1 (212) 555-0123',
//             instituteEmail: 'info@institute.edu',
//             description: 'Leading institution for higher education excellence',
//             logo: undefined,
//         },
//         mode: 'onChange',
//     })

//     // Upload single file
//     const uploadFile = async (file: File): Promise<string | null> => {
//         const formData = new FormData();
//         formData.append('files', file);

//         try {
//             const response = await ApiHitter('POST', 'UPLOAD', formData, '', {
//                 showSuccess: false,
//                 showError: true,
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             return response[0].fileName || null;
//             return null;
//         } catch (err) {
//             console.error('Upload error:', err);
//             throw err;
//         }
//     };

//     const { mutate: addInstituteSettingsMutation } = useMutation({
//         mutationFn: (body: any) =>
//             ApiHitter('POST', 'ADD_INSTITUTE_SETTINGS', body, '', {
//                 showSuccess: true,
//                 successMessage: 'Institute settings added successfully',
//                 showError: true,
//             }),
//         onSuccess: () => {
//             alert('Institute settings added successfully!');
//             //   showNotification('success', 'Student added successfully!');
//             //   setTimeout(() => {
//             //     router.push('/student');
//             //   }, 1500);
//         },
//         onError: (error: any) => {
//             alert(error?.response?.data?.message || 'Failed to add institute settings');
//             //   showNotification('error', error?.response?.data?.message || 'Failed to add student');
//         },
//     });

//     // ADD_INSTITUTE_SETTINGS

//     const onSubmit: SubmitHandler<SettingsFormData> = async (data) => {
//         try {
//             console.log('Settings Data:', data)
//             let logoUrl;
//             if (selectedFiles?.logo) {
//                 logoUrl = await uploadFile(selectedFiles.logo);
//                 console.log("logoUrl", logoUrl);
//             }

//             // Prepare submission data
//             const submissionData = {
//                 ...data,
//                 logo: logoUrl,
//             };

//             console.log("submissionData", submissionData);
//             addInstituteSettingsMutation(submissionData)
//             // await new Promise(resolve => setTimeout(resolve, 1000))
//             // setSubmitMessage({ type: 'success', message: 'Settings updated successfully!' })
//             // setTimeout(() => setSubmitMessage(null), 3000)
//         } catch (error) {
//             setSubmitMessage({ type: 'error', message: 'Failed to save settings' })
//             setTimeout(() => setSubmitMessage(null), 3000)
//         }
//     }

//     const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0]
//         if (file) {
//             const reader = new FileReader()
//             reader.onloadend = () => {
//                 setLogoPreview(reader.result as string)
//             }
//             reader.readAsDataURL(file)
//         }
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//             {/* Animated background elements */}
//             <div className="fixed inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
//                 <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//                 <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
//             </div>

//             <div className="relative z-10">
//                 {/* Header */}
//                 <header className="backdrop-blur-md bg-white/5 border-b border-white/10">
//                     <div className="max-w-7xl mx-auto px-6 py-8">
//                         <div className="flex items-center gap-3 mb-2">
//                             <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
//                                 <Settings className="w-6 h-6 text-white" />
//                             </div>
//                             <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
//                                 Settings
//                             </h1>
//                         </div>
//                         <p className="text-slate-400 text-sm">Manage your institute settings and information</p>
//                     </div>
//                 </header>

//                 {/* Main Content */}
//                 <main className="max-w-7xl mx-auto px-6 py-12">
//                     {/* Success/Error Message */}
//                     {submitMessage && (
//                         <div
//                             className={`mb-8 p-4 rounded-xl backdrop-blur-sm border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${submitMessage.type === 'success'
//                                 ? 'bg-green-500/10 border-green-500/20 text-green-300'
//                                 : 'bg-red-500/10 border-red-500/20 text-red-300'
//                                 }`}
//                         >
//                             {submitMessage.type === 'success' ? (
//                                 <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
//                             ) : (
//                                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
//                             )}
//                             <span className="text-sm font-medium">{submitMessage.message}</span>
//                         </div>
//                     )}

//                     {/* Stats Grid */}
//                     {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                         {[
//                             { label: 'Total Students', value: '2,543', icon: Users, color: 'from-blue-500 to-cyan-500' },
//                             { label: 'Active Courses', value: '24', icon: Building2, color: 'from-purple-500 to-pink-500' },
//                             { label: 'Staff Members', value: '87', icon: Settings, color: 'from-orange-500 to-red-500' },
//                         ].map((stat) => (
//                             <div
//                                 key={stat.label}
//                                 className="p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
//                             >
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
//                                         <p className="text-3xl font-bold text-white">{stat.value}</p>
//                                     </div>
//                                     <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
//                                         <stat.icon className="w-6 h-6 text-white" />
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div> */}

//                     {/* Settings Form */}
//                     <form onSubmit={handleSubmit(onSubmit)} className="setting-custom p-8 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10">
//                         <h2 className="text-2xl font-bold text-white mb-8">Institute Settings</h2>

//                         {/* Logo Upload Section */}
//                         <div className="mb-8 p-6 rounded-lg bg-white/5 border border-white/10">
//                             <h3 className="text-lg font-semibold text-white mb-4">Institute Logo</h3>
//                             <div className="flex items-center gap-6">
//                                 {logoPreview ? (
//                                     <img
//                                         src={logoPreview}
//                                         alt="Logo Preview"
//                                         className="w-24 h-24 rounded-lg object-cover border-2 border-blue-500/50"
//                                     />
//                                 ) : (
//                                     <div className="w-24 h-24 rounded-lg bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
//                                         <Building2 className="w-8 h-8 text-slate-400" />
//                                     </div>
//                                 )}
//                                 <div>
//                                     <label className="block text-sm font-medium text-white mb-2">Upload Logo</label>
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 file:bg-blue-500 file:text-white file:border-0 file:rounded file:px-3 file:py-1.5 file:mr-3 file:cursor-pointer hover:file:bg-blue-600 transition-all duration-200"
//                                         {...register("logo", {
//                                             setValueAs: (files) => files?.[0],
//                                             onChange: (e) => {
//                                                 const file = e.target.files?.[0] || null;

//                                                 setSelectedFiles((prev) => ({
//                                                     ...prev,
//                                                     logo: file,
//                                                 }));
//                                                 if (file) {
//                                                     clearErrors("logo");
//                                                 }

//                                             },
//                                         })}
//                                     />
//                                     <p className="text-xs text-slate-400 mt-1">Recommended size: 200x200px, Max 5MB</p>
//                                     {errors.logo && (
//                                         <p className="mt-1 text-sm text-red-400 flex items-center gap-1"> <AlertCircle className="w-4 h-4" />{errors.logo.message}</p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Form Fields Grid */}
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                             {/* Institute Name */}
//                             <div>
//                                 <label className="block text-sm font-medium text-white mb-2">Institute Name *</label>
//                                 <input
//                                     {...register('instituteName')}
//                                     placeholder="Enter institute name"
//                                     className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.instituteName ? 'border-red-500/50' : 'border-white/10'
//                                         }`}
//                                 />
//                                 {errors.instituteName && (
//                                     <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
//                                         <AlertCircle className="w-4 h-4" />
//                                         {errors.instituteName.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Institute Email */}
//                             <div>
//                                 <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
//                                     <Mail className="w-4 h-4" /> Email *
//                                 </label>
//                                 <input
//                                     {...register('instituteEmail')}
//                                     type="email"
//                                     placeholder="institute@example.com"
//                                     className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.instituteEmail ? 'border-red-500/50' : 'border-white/10'
//                                         }`}
//                                 />
//                                 {errors.instituteEmail && (
//                                     <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
//                                         <AlertCircle className="w-4 h-4" />
//                                         {errors.instituteEmail.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Institute Contact */}
//                             <div>
//                                 <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
//                                     <Phone className="w-4 h-4" /> Contact Number *
//                                 </label>
//                                 <input
//                                     {...register('instituteContact')}
//                                     placeholder="+1 (123) 456-7890"
//                                     className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.instituteContact ? 'border-red-500/50' : 'border-white/10'
//                                         }`}
//                                 />
//                                 {errors.instituteContact && (
//                                     <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
//                                         <AlertCircle className="w-4 h-4" />
//                                         {errors.instituteContact.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Placeholder for alignment */}
//                             <div></div>
//                         </div>

//                         {/* Address */}
//                         <div className="mb-6">
//                             <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
//                                 <MapPin className="w-4 h-4" /> Address *
//                             </label>
//                             <input
//                                 {...register('instituteAddress')}
//                                 placeholder="Enter full address"
//                                 className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.instituteAddress ? 'border-red-500/50' : 'border-white/10'
//                                     }`}
//                             />
//                             {errors.instituteAddress && (
//                                 <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
//                                     <AlertCircle className="w-4 h-4" />
//                                     {errors.instituteAddress.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Description */}
//                         <div className="mb-8">
//                             <label className="block text-sm font-medium text-white mb-2">Description</label>
//                             <textarea
//                                 {...register('description')}
//                                 placeholder="Enter institute description"
//                                 rows={4}
//                                 className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none ${errors.description ? 'border-red-500/50' : 'border-white/10'
//                                     }`}
//                             />
//                             {errors.description && (
//                                 <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
//                                     <AlertCircle className="w-4 h-4" />
//                                     {errors.description.message}
//                                 </p>
//                             )}
//                             <p className="text-xs text-slate-400 mt-1">Max 500 characters</p>
//                         </div>

//                         {/* Quick Access Section */}
//                         {/* <div className="mb-8 p-6 rounded-lg bg-white/5 border border-white/10">
//                             <h3 className="text-lg font-semibold text-white mb-6">Quick Access</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {[
//                                     { title: 'Manage Users', desc: 'Add, edit, or remove user accounts' },
//                                     { title: 'View Reports', desc: 'Access performance and enrollment reports' },
//                                     { title: 'System Logs', desc: 'Monitor system activity and events' },
//                                     { title: 'Backup Data', desc: 'Create and restore system backups' },
//                                 ].map((item) => (
//                                     <button
//                                         key={item.title}
//                                         type="button"
//                                         className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-200 text-left group"
//                                     >
//                                         <p className="font-medium text-white group-hover:text-blue-300 transition-colors">{item.title}</p>
//                                         <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
//                                     </button>
//                                 ))}
//                             </div>
//                         </div> */}

//                         {/* Submit Button */}
//                         <div className="flex gap-4">
//                             <button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
//                             >
//                                 <Save className="w-5 h-5 text-white" />
//                                 <span className="text-white">{isSubmitting ? 'Saving...' : 'Save Settings'}</span>
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={() => reset()}
//                                 className="px-6 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white font-semibold py-3 rounded-lg transition-all duration-200"
//                             >
//                                 Reset
//                             </button>
//                         </div>
//                     </form>
//                 </main>
//             </div>

//             <style jsx>{`
//         @keyframes blob {
//           0%, 100% {
//             transform: translate(0, 0) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//         }

//         .animate-blob {
//           animation: blob 7s infinite;
//         }

//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }

//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//         </div>
//     )
// }

'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mime, z } from 'zod'
import { Mail, MapPin, Phone, Settings, Users, Building2, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import "./setting.css"
import { ApiHitter } from '@/lib/axiosApi/apiHitter'
import { useMutation } from '@tanstack/react-query'

const SettingsSchema = z.object({
    instituteName: z
        .string()
        .nonempty("Institute name is required")
        .min(3, "Institute name must be at least 3 characters")
        .max(100, "Institute name must not exceed 100 characters"),

    instituteAddress: z
        .string()
        .nonempty("Institute address is required")
        .min(10, "Address must be at least 10 characters")
        .max(300, "Address must not exceed 300 characters"),

    instituteContact: z
        .string()
        .nonempty("Institute contact number is required")
        .regex(/^[0-9\s\-\+\(\)]+$/, "Invalid phone number format")
        .min(10, "Phone number must be at least 10 digits"),

    instituteEmail: z
        .string()
        .nonempty("Institute email is required")
        .email("Invalid email address"),

    description: z
        .string()
        .nonempty("Description is required")
        .max(500, "Description cannot exceed 500 characters"),

    logo: z
        .instanceof(File, { message: "Institute logo is required" })
        .refine(
            (file) =>
                ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
            "Logo must be an image (jpg, jpeg, png, gif, webp)"
        )
        .refine(
            (file) => file.size <= 2 * 1024 * 1024,
            "Logo size must be less than 2MB"
        ),
});

type SettingsFormData = z.infer<typeof SettingsSchema>

export default function SettingsComponent() {
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<{
        logo: File | null;
    }>({
        logo: null,
    });

    useEffect(() => {
        getInsituteDetailsMutation()
    }, [])

    const {
        register,
        handleSubmit,
        clearErrors,
        formState: { errors, isSubmitting },
        reset,
        trigger,
        watch,
        setValue,
    } = useForm<SettingsFormData>({
        resolver: zodResolver(SettingsSchema),
        // defaultValues: {
        //     instituteName: 'Global Education Institute',
        //     instituteAddress: '123 Education Street, New York, NY 10001',
        //     instituteContact: '+1 (212) 555-0123',
        //     instituteEmail: 'info@institute.edu',
        //     description: 'Leading institution for higher education excellence',
        //     logo: undefined,
        // },
        mode: 'onChange',
    })

    const logoField = watch('logo')

    // Upload single file
    const uploadFile = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('files', file);

        try {
            const response = await ApiHitter('POST', 'UPLOAD', formData, '', {
                showSuccess: false,
                showError: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response[0].fileName || null;
        } catch (err) {
            console.error('Upload error:', err);
            throw err;
        }
    };

    const { mutate: addInstituteSettingsMutation } = useMutation({
        mutationFn: (body: any) =>
            ApiHitter('POST', 'ADD_INSTITUTE_SETTINGS', body, '', {
                showSuccess: true,
                successMessage: 'Institute settings added successfully',
                showError: true,
            }),
        onSuccess: () => {
            setSubmitMessage({ type: 'success', message: 'Institute settings saved successfully!' })
            setTimeout(() => setSubmitMessage(null), 3000)
            reset()
            setLogoPreview(null)
            setSelectedFiles({ logo: null })
            getInsituteDetailsMutation()
        },
        onError: (error: any) => {
            const errorMsg = error?.response?.data?.message || 'Failed to add institute settings'
            setSubmitMessage({ type: 'error', message: errorMsg })
            setTimeout(() => setSubmitMessage(null), 3000)
        },
    });


    const { mutate: getInsituteDetailsMutation } = useMutation({
        mutationFn: () => ApiHitter('GET', 'GET_INSTITUTE_SETTINGS', {}, '', {
            showSuccess: true,
            successMessage: 'Institute details fetched successfully',
            showError: true,
        }),
        onSuccess: (data: any) => {
            console.log('Institute details:', data)
            setValue('instituteName', data?.instituteName)
            setValue('instituteAddress', data?.instituteAddress)
            setValue('instituteEmail', data?.instituteEmail)
            setValue('instituteContact', data?.instituteContact)
            setValue('description', data?.description)
            setValue('logo', data?.logo)
            setLogoPreview(data?.logo)
        },
        onError: (error: any) => {
            const errorMsg = error?.response?.data?.message || 'Failed to fetch institute details'
            setSubmitMessage({ type: 'error', message: errorMsg })
            setTimeout(() => setSubmitMessage(null), 3000)
        },
    })

    // ============ FIXED LOGO UPLOAD HANDLER ============
    const handleLogoUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Set file into RHF (IMPORTANT)
            setValue("logo", file, { shouldValidate: true });

            // Preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            clearErrors("logo");
        },
        [setValue, clearErrors]
    );


    const onSubmit: SubmitHandler<SettingsFormData> = async (data) => {
        try {
            console.log('Settings Data:', data)
            let logoUrl;
            if (data?.logo) {
                logoUrl = await uploadFile(data.logo);
                console.log("logoUrl", logoUrl);
            }

            // Prepare submission data
            const submissionData = {
                ...data,
                logo: logoUrl,
            };

            console.log("submissionData", submissionData);
            addInstituteSettingsMutation(submissionData)
        } catch (error) {
            setSubmitMessage({ type: 'error', message: 'Failed to save settings' })
            setTimeout(() => setSubmitMessage(null), 3000)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header className="backdrop-blur-md bg-white/5 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                                <Settings className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                                Settings
                            </h1>
                        </div>
                        <p className="text-slate-400 text-sm">Manage your institute settings and information</p>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-6 py-12">
                    {/* Success/Error Message */}
                    {submitMessage && (
                        <div
                            className={`mb-8 p-4 rounded-xl backdrop-blur-sm border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${submitMessage.type === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-300'
                                : 'bg-red-500/10 border-red-500/20 text-red-300'
                                }`}
                        >
                            {submitMessage.type === 'success' ? (
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            )}
                            <span className="text-sm font-medium">{submitMessage.message}</span>
                        </div>
                    )}

                    {/* Settings Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="setting-custom p-8 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-8">Institute Settings</h2>

                        {/* Logo Upload Section */}
                        <div className="mb-8 p-6 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4">Institute Logo</h3>
                            <div className="flex items-center gap-6">
                                {logoPreview ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}uploads/${logoPreview}`}
                                        alt="Logo Preview"
                                        className="w-24 h-24 rounded-lg object-cover border-2 border-blue-500/50"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-lg bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                                        <Building2 className="w-8 h-8 text-slate-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-white mb-2">Upload Logo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className={`w-full px-4 py-2 rounded-lg bg-white/5 border text-slate-300 file:bg-blue-500 file:text-white file:border-0 file:rounded file:px-3 file:py-1.5 file:mr-3 file:cursor-pointer hover:file:bg-blue-600 transition-all duration-200 ${errors.logo && selectedFiles.logo === null ? 'border-red-500/50' : 'border-white/10'
                                            }`}
                                    // {...register('logo', {
                                    //     setValueAs: (files) => files?.[0],
                                    // })}
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Recommended size: 200x200px, Max 2MB</p>

                                    {/* Error - Only show when no file selected */}
                                    {errors.logo && selectedFiles.logo === null && (
                                        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.logo.message}
                                        </p>
                                    )}

                                    {/* Success - Show when file selected */}
                                    {selectedFiles.logo && !errors.logo && (
                                        <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded">
                                            <p className="text-sm text-green-400 flex items-center gap-1">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Logo ready: {selectedFiles.logo.name} ({(selectedFiles.logo.size / 1024).toFixed(2)} KB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Fields Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Institute Name */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Institute Name *</label>
                                <input
                                    {...register('instituteName')}
                                    placeholder="Enter institute name"
                                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.instituteName ? 'border-red-500/50' : 'border-white/10'
                                        }`}
                                />
                                {errors.instituteName && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.instituteName.message}
                                    </p>
                                )}
                            </div>

                            {/* Institute Email */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Email *
                                </label>
                                <input
                                    {...register('instituteEmail')}
                                    type="email"
                                    placeholder="institute@example.com"
                                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.instituteEmail ? 'border-red-500/50' : 'border-white/10'
                                        }`}
                                />
                                {errors.instituteEmail && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.instituteEmail.message}
                                    </p>
                                )}
                            </div>

                            {/* Institute Contact */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> Contact Number *
                                </label>
                                <input
                                    {...register('instituteContact')}
                                    placeholder="+1 (123) 456-7890"
                                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.instituteContact ? 'border-red-500/50' : 'border-white/10'
                                        }`}
                                />
                                {errors.instituteContact && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.instituteContact.message}
                                    </p>
                                )}
                            </div>

                            {/* Placeholder for alignment */}
                            <div></div>
                        </div>

                        {/* Address */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Address *
                            </label>
                            <input
                                {...register('instituteAddress')}
                                placeholder="Enter full address"
                                className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.instituteAddress ? 'border-red-500/50' : 'border-white/10'
                                    }`}
                            />
                            {errors.instituteAddress && (
                                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.instituteAddress.message}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-white mb-2">Description</label>
                            <textarea
                                {...register('description')}
                                placeholder="Enter institute description"
                                rows={4}
                                className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none ${errors.description ? 'border-red-500/50' : 'border-white/10'
                                    }`}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.description.message}
                                </p>
                            )}
                            <p className="text-xs text-slate-400 mt-1">Max 500 characters</p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                            >
                                <Save className="w-5 h-5 text-white" />
                                <span className="text-white">{isSubmitting ? 'Saving...' : 'Save Settings'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    reset()
                                    setLogoPreview(null)
                                    setSelectedFiles({ logo: null })
                                }}
                                className="px-6 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white font-semibold py-3 rounded-lg transition-all duration-200"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </main>
            </div>

            <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    )
}