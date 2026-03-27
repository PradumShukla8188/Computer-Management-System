import CMSPageForm from '@/components/cmsPages/cmsForm';

export const metadata = {
    title: 'Create New Page | CMS',
    description: 'Create a new CMS page',
};

export default function NewPagePage() {
    return <CMSPageForm />;
}