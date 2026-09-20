import { prisma } from '@/shared/db';
import { AdminPageHeader } from '../_components/adminUi';
import ContactTable from './_components/ContactTable';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Contact' };

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500,
  });

  return (
    <div className="space-y-5 max-w-6xl">
      <AdminPageHeader
        title="Contact"
        description={`${messages.length} message${messages.length !== 1 ? 's' : ''} from the site-wide Contact form`}
      />

      <ContactTable messages={messages} />
    </div>
  );
}
