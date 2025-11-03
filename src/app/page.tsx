import Link from 'next/link';

export default function Home() {
  const buttons = [
    { name: 'Agenda', path: '/agenda' },
    { name: 'Speakers', path: '/speakers' },
    { name: 'Partners', path: '/partners' },
    { name: 'Navigate', path: '/navigate' },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/images/landing_background.png)" }}
    >
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4">YOUR QUICK GUIDE TO TECHSPARK</h1>

          <div className="flex flex-row items-center justify-center gap-6 mt-12 flex-wrap">
            {buttons.map((button) => (
              <Link
                key={button.name}
                href={button.path}
                className="relative block transition-transform duration-300 hover:scale-105 active:scale-95"
                style={{ width: '290px', height: '100px' }}
              >
                <div
                  className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: "url(/images/button_frame.png)" }}
                />
                <div className="relative flex items-center justify-center h-full">
                  <span className="text-3xl font-medium text-white drop-shadow-lg">
                    {button.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
