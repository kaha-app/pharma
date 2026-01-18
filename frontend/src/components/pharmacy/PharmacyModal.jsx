import { X, MapPin, Phone, Globe, Star, Clock, Package, Truck, Mail } from 'lucide-react';

export default function PharmacyModal({ pharmacy, onClose }) {
  // Get the best available image: coverImage -> gallery[0] -> fallback
  const getDisplayImage = () => {
    if (pharmacy.coverImageUrl) return pharmacy.coverImageUrl;
    if (pharmacy.gallery && pharmacy.gallery.length > 0) return pharmacy.gallery[0];
    return null;
  };

  const displayImage = getDisplayImage();

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-5 h-5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  const formatWorkingHours = (hours) => {
    if (!hours || Object.keys(hours).length === 0) return null;
    
    return Object.entries(hours).map(([day, times]) => (
      <div key={day} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
        <span className="font-medium text-gray-700">{day}</span>
        <span className="text-gray-600">
          {Array.isArray(times) ? times.join(', ') : times}
        </span>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header with Image */}
        <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200">
          {displayImage ? (
            <img 
              src={displayImage}
              alt={pharmacy.name}
              className="w-full h-full object-cover"
              onError={(e) => e.target.style.display = 'none'}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-24 h-24 text-primary-400" />
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Title and Rating */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {pharmacy.name}
            </h2>
            <div className="flex items-center space-x-2">
              {renderStars(pharmacy.avgRatings)}
              <span className="text-lg font-semibold text-gray-700 ml-2">
                {parseFloat(pharmacy.avgRatings).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              
              {pharmacy.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700">Address</p>
                    <p className="text-gray-600">{pharmacy.address}</p>
                  </div>
                </div>
              )}

              {pharmacy.contact && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700">Phone</p>
                    <a 
                      href={`tel:${pharmacy.contact}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {pharmacy.contact}
                    </a>
                  </div>
                </div>
              )}

              {pharmacy.email && (
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <a 
                      href={`mailto:${pharmacy.email}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {pharmacy.email}
                    </a>
                  </div>
                </div>
              )}

              {pharmacy.website && (
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700">Website</p>
                    <a 
                      href={pharmacy.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Services</h3>
              <div className="space-y-3">
                <div className={`flex items-center space-x-3 p-3 rounded-lg ${pharmacy.isPickup ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <Package className={`w-5 h-5 ${pharmacy.isPickup ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className={pharmacy.isPickup ? 'text-green-700 font-medium' : 'text-gray-500'}>
                    Pickup {pharmacy.isPickup ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className={`flex items-center space-x-3 p-3 rounded-lg ${pharmacy.isDelivery ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <Truck className={`w-5 h-5 ${pharmacy.isDelivery ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={pharmacy.isDelivery ? 'text-blue-700 font-medium' : 'text-gray-500'}>
                    Delivery {pharmacy.isDelivery ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          {pharmacy.workingDaysAndHours && Object.keys(pharmacy.workingDaysAndHours).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary-600" />
                <span>Working Hours</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {formatWorkingHours(pharmacy.workingDaysAndHours)}
              </div>
            </div>
          )}

          {/* Gallery */}
          {pharmacy.gallery && pharmacy.gallery.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pharmacy.gallery.slice(0, 8).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={image}
                      alt={`${pharmacy.name} - ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {pharmacy.location && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Coordinates</p>
                  <p className="font-mono text-gray-900">
                    {pharmacy.location.lat.toFixed(6)}, {pharmacy.location.lng.toFixed(6)}
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${pharmacy.location.lat},${pharmacy.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Open in Maps
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
