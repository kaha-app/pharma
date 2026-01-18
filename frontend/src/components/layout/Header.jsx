import { Link } from 'react-router-dom';
import { MapPin, Pill } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Kathmandu Pharmacies
              </h1>
              <p className="text-xs text-gray-500">Find pharmacies near you</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/pharmacies" 
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              All Pharmacies
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
