'use client';

import Link from 'next/link';
import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  theme?: 'dark' | 'light';
}

export default function PageHeader({ title, theme = 'dark' }: PageHeaderProps) {
  const isDark = theme === 'dark';
  const homeIcon = isDark ? '/images/home_icon.png' : '/images/home_icon_black.png';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const backgroundColor = isDark ? '#000000' : '#FFFFFF';

  return (
    <div className="w-full sticky top-0 z-40" style={{ backgroundColor }}>
      <div className="flex items-center justify-between pt-28 pb-12 px-32">
        <h1 className="text-6xl font-bold" style={{ color: textColor }}>
          {title}
        </h1>

        <Link
          href="/"
          className="relative flex items-start gap-3 px-8 py-4 font-medium text-3xl transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            backgroundImage: "url(/images/button_frame.png)",
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minWidth: '180px',
            color: textColor,
          }}
        >
          <Image
            src={homeIcon}
            alt="Home"
            width={28}
            height={28}
            className="w-8 h-8"
          />
          Home
        </Link>
      </div>
    </div>
  );
}
