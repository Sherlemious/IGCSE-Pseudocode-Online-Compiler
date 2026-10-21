'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';

export default function JoinSlip({
  classId,
  name,
  joinCode,
  joinUrl,
  qr,
}: {
  classId: string;
  name: string;
  joinCode: string;
  joinUrl: string;
  qr: string;
}) {
  useEffect(() => {
    const onPrint = () => captureEvent('class_join_slip_printed', { class_id: classId });
    window.addEventListener('beforeprint', onPrint);
    return () => window.removeEventListener('beforeprint', onPrint);
  }, [classId]);

  function printSlip() {
    window.print();
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6">
      <style>{`
        @media print {
          body { height: auto !important; overflow: visible !important; background: #fff !important; }
          body * { visibility: hidden; }
          .print-slip, .print-slip * { visibility: visible; }
          .print-slip { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
      <div className="no-print mx-auto mb-6 flex max-w-xl items-center justify-between gap-3">
        <Link href={`/classes/${classId}`} className="inline-flex items-center gap-1.5 text-xs text-dark-text hover:text-primary transition-colors">
          <ArrowLeft size={13} />
          Back to class
        </Link>
        <button
          type="button"
          onClick={printSlip}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-on-primary hover:opacity-90"
        >
          <Printer size={14} aria-hidden="true" />
          Print
        </button>
      </div>
      <article className="print-slip mx-auto max-w-xl rounded-xl border border-[#d4d4d4] bg-white px-8 py-10 text-center text-[#171717]">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[#737373]">Join the class</p>
        <h1 className="display-serif mt-2 text-3xl font-semibold">{name}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-[#525252]">
          Open this link, sign in, and you will be added to the class.
        </p>
        {qr ? (
          <div
            className="mx-auto mt-6 w-52 [&_svg]:h-auto [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qr }}
          />
        ) : null}
        <p className="mt-4 break-all font-mono text-sm">{joinUrl}</p>
        <p className="mt-6 text-xs uppercase tracking-widest text-[#737373]">Join code</p>
        <p className="mt-1 font-mono text-3xl font-semibold tracking-[0.2em]">{joinCode}</p>
      </article>
    </div>
  );
}
