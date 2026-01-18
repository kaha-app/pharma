import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePharmacies } from '../context/PharmacyContext';
import { 
  MapPin, Phone, Mail, Globe, Star, Clock, Package, Truck, 
  ArrowLeft, ExternalLink, Loader, Navigation
} from 'lucide-react';

export default function PharmacyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadPharmacyById } = usePharmacies();
  
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPharmacy = async () => {
      try {
        setLoading(true);
        const data = await loadPharmacyById(id);
        setPharmacy(data);
        
        // Set initial selected image
        if (data.coverImageUrl) {
          setSelectedImage(data.coverImageUrl);
        } else if (data.avatarUrl) {
          setSelectedImage(data.avatarUrl);
        } else if (data.gallery && data.gallery.length > 0) {
          setSelectedImage(data.gallery[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacy();
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 opacity-50" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-5 h-5 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const openInMaps = () => {
    if (pharmacy?.location) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${pharmacy.location.lat},${pharmacy.location.lng}`,
        '_blank'
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading pharmacy details...</p>
        </div>
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pharmacy Not Found</h2>
          <p className="text-gray-600 mb-8">{error || 'The pharmacy you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/pharmacies')} className="btn-primary">
            Back to Pharmacies
          </button>
        </div>
      </div>
    );
  }

  const allImages = [
    pharmacy.coverImageUrl,
    pharmacy.avatarUrl,
    pharmacy.buildingImageUrl,
    ...(pharmacy.gallery || [])
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {pharmacy.name}
              </h1>
              
              {/* Rating */}
              {pharmacy.avgRatings > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(pharmacy.avgRatings)}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {parseFloat(pharmacy.avgRatings).toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    ({pharmacy.reviewCount} {pharmacy.reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              {/* Services */}
              <div className="flex items-center space-x-4">
                {pharmacy.isPickup && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">Pickup Available</span>
                  </div>
                )}
                {pharmacy.isDelivery && (
                  <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm font-medium">Delivery Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery */}
            {allImages.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Gallery</h2>
                
                {/* Main Image */}
                {selectedImage && (
                  <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={selectedImage}
                      alt={pharmacy.name}
                      className="w-full h-96 object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                )}

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === img ? 'border-primary-600' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${pharmacy.name} ${idx + 1}`}
                          className="w-full h-20 object-cover"
                          crossOrigin="anonymous"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {pharmacy.description && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600">{pharmacy.description}</p>
              </div>
            )}

            {/* Reviews */}
            {pharmacy.userReviews && pharmacy.userReviews.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
                <div className="space-y-4">
                  {pharmacy.userReviews.slice(0, 5).map((review, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-start space-x-3">
                        {review.ProfilePicture && (
                          <img
                            src={review.ProfilePicture}
                            alt={review.Name}
                            className="w-10 h-10 rounded-full"
                            crossOrigin="anonymous"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900">{review.Name}</span>
                            {review.Rating && (
                              <div className="flex items-center">
                                {renderStars(review.Rating)}
                              </div>
                            )}
                          </div>
                          {review.Description && (
                            <p className="text-gray-600 text-sm">{review.Description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">{pharmacy.address}</p>
                  </div>
                </div>

                {/* Phone */}
                {pharmacy.contact && (
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <a href={`tel:${pharmacy.contact}`} className="text-sm text-primary-600 hover:underline">
                        {pharmacy.contact}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {pharmacy.email && (
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <a href={`mailto:${pharmacy.email}`} className="text-sm text-primary-600 hover:underline">
                        {pharmacy.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Website */}
                {pharmacy.website && (
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Website</p>
                      <a 
                        href={pharmacy.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline flex items-center space-x-1"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Open in Maps Button */}
              <button
                onClick={openInMaps}
                className="w-full mt-6 btn-primary flex items-center justify-center space-x-2"
              >
                <Navigation className="w-5 h-5" />
                <span>Open in Google Maps</span>
              </button>
            </div>

            {/* Working Hours */}
            {pharmacy.workingDaysAndHours && Object.keys(pharmacy.workingDaysAndHours).length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Working Hours</span>
                </h2>
                <div className="space-y-2">
                  {Object.entries(pharmacy.workingDaysAndHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900">{day}</span>
                      <span className="text-gray-600">
                        {Array.isArray(hours) ? hours.join(', ') : hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
