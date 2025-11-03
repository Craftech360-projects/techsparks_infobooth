'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function BackButton() {
  return (
    <Link
      href="/"
      className="relative flex items-center gap-3 px-8 py-4 font-semibold text-xl transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        backgroundImage: "url(/images/button_frame.png)",
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minWidth: '180px',
        color: '#FFFFFF',
      }}
    >
      <Image
        src="/images/home_icon.png"
        alt="Home"
        width={24}
        height={24}
        className="w-6 h-6"
      />
      Home
    </Link>
  );
}
