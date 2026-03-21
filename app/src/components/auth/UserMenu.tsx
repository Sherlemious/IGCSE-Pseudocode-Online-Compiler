'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { LogIn, LogOut, User, Crown } from 'lucide-react';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [session?.user?.image]);

  if (status === 'loading') {
    return <div className="w-6 h-6 rounded-full bg-header-text/10 animate-pulse" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-header-text/70
          hover:text-header-text hover:bg-white/10 transition duration-200"
      >
        <LogIn size={13} />
        Sign In
      </button>
    );
  }

  const isPremium = session.user.plan === 'PREMIUM';
  const hasValidImage = Boolean(session.user.image) && !avatarLoadFailed;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded hover:bg-white/10 transition duration-200 p-0.5"
        title={session.user.name ?? 'Account'}
      >
        {hasValidImage ? (
          <Image
            src={session.user.image!}
            alt=""
            width={24}
            height={24}
            className="w-6 h-6 rounded-full border border-header-text/20"
            referrerPolicy="no-referrer"
            onError={() => setAvatarLoadFailed(true)}
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <User size={12} className="text-primary" />
          </div>
        )}
        {isPremium && <Crown size={10} className="text-warning" />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-border bg-surface shadow-intense z-50 overflow-hidden">
          {/* User info */}
          <div className="px-3 py-2.5 border-b border-border">
            <div className="text-sm font-medium text-light-text truncate">{session.user.name ?? 'User'}</div>
            <div className="text-xs text-dark-text truncate">{session.user.email}</div>
            <div className="mt-1.5">
              {isPremium ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-warning/15 border border-warning/30 text-warning">
                  <Crown size={9} />
                  PREMIUM
                </span>
              ) : (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface border border-border text-dark-text">
                  FREE
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="py-1">
            {!isPremium && (
              <button
                onClick={() => {
                  setOpen(false); /* TODO: upgrade flow */
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-warning hover:bg-warning/10 transition-colors"
              >
                <Crown size={13} />
                Upgrade to Premium
              </button>
            )}
            <button
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-dark-text hover:text-light-text hover:bg-background transition-colors"
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
