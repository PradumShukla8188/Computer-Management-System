import EditNoticeForm from '@/components/notice/edit';
import { serverApi } from '@/lib/axiosApi/serverAPI';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}



interface Notice {
    title: string;
    description: string;
}

export default async function EditNoticePage({ params }: PageProps) {
    const { id } = await params;
    console.log("id", id);

    const notice = await serverApi<Notice>(`notice/${id}`);
    console.log("notice data", notice)

    if (!notice) {
        notFound();
    }

    return (
        <EditNoticeForm
            noticeId={id}
            initialData={{
                title: notice.title,
                description: notice.description,
            }}
        />
    );
}
