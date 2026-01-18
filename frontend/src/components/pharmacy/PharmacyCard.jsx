import { MapPin, Phone, Star, Clock, Package, Truck } from 'lucide-react';
import { useState } from 'react';

export default function PharmacyCard({ pharmacy, onClick }) {
  const [imageError, setImageError] = useState(false);
  
  // Get the best available image: coverImage -> avatarUrl -> gallery[0] -> fallback
  const getDisplayImage = () => {
    if (pharmacy.coverImageUrl) return pharmacy.coverImageUrl;
    if (pharmacy.avatarUrl) return pharmacy.avatarUrl;
    if (pharmacy.gallery && pharmacy.gallery.length > 0) return pharmacy.gallery[0];
    return null;
  };

  const displayImage = !imageError ? getDisplayImage() : null;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div 
      className="card overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
      onClick={() => onClick(pharmacy)}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={pharmacy.name}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
            loading="lazy"
            onError={(e) => {
              console.log('Image failed to load:', displayImage);
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Package className="w-16 h-16 text-primary-400 mb-2" />
            <span className="text-primary-600 text-sm font-medium">{pharmacy.name}</span>
          </div>
        )}
        
        {/* Rating Badge */}
        {pharmacy.avgRatings > 0 && (
          <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-lg flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-sm">{parseFloat(pharmacy.avgRatings).toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {pharmacy.name}
        </h3>
        
        {/* Rating Stars */}
        <div className="flex items-center space-x-1 mb-3">
          {renderStars(pharmacy.avgRatings)}
          <span className="text-sm text-gray-500 ml-2">
            ({parseFloat(pharmacy.avgRatings).toFixed(1)})
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start space-x-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-600" />
          <span className="line-clamp-2">{pharmacy.address}</span>
        </div>

        {/* Contact */}
        {pharmacy.contact && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
            <Phone className="w-4 h-4 flex-shrink-0 text-primary-600" />
            <span>{pharmacy.contact}</span>
          </div>
        )}

        {/* Services */}
        <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
          {pharmacy.isPickup && (
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <Package className="w-3 h-3" />
              <span>Pickup</span>
            </div>
          )}
          {pharmacy.isDelivery && (
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <Truck className="w-3 h-3" />
              <span>Delivery</span>
            </div>
          )}
          {pharmacy.workingDaysAndHours && Object.keys(pharmacy.workingDaysAndHours).length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Open</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
