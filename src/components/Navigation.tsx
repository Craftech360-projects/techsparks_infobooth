import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-center space-x-8">
          <Link 
            href="/" 
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            Home
          </Link>
          <Link 
            href="/agenda" 
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            Agenda
          </Link>
          <Link 
            href="/speakers" 
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            Speakers
          </Link>
          <Link 
            href="/partners" 
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            Partners
          </Link>
          <Link 
            href="/navigate" 
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            Navigate
          </Link>
        </div>
      </div>
    </nav>
  );
}