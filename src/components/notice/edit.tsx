'use client';

import AddEditNotice from '@/components/notice/add';

interface Props {
    noticeId: string;
    initialData: {
        title: string;
        description: string;
    };
}

export default function EditNoticeForm({ noticeId, initialData }: Props) {
    // console.log("noticeId", noticeId, "initial Data", initialData)
    return (
        <AddEditNotice
            mode="edit"
            noticeId={noticeId}
            initialData={initialData}
        />
    );
}
