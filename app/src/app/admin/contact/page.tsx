import { prisma } from '@/shared/db';
import ContactTable from './_components/ContactTable';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Contact' };

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500,
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-light-text">Contact</h1>
        <p className="text-sm text-dark-text mt-1">
          {messages.length} message{messages.length !== 1 ? 's' : ''} from the site-wide Contact form
        </p>
      </div>

      <ContactTable messages={messages} />
    </div>
  );
}
