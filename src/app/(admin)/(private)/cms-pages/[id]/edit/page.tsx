import CMSPageForm from "@/components/cmsPages/cmsForm";

export const metadata = {
    title: 'Edit Page | CMS',
    description: 'Edit CMS page',
};

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CMSPageForm pageId={id} />;
}
