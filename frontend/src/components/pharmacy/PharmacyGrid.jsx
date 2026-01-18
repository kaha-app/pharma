import PharmacyCard from './PharmacyCard';

export default function PharmacyGrid({ pharmacies, onPharmacyClick }) {
  if (pharmacies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No pharmacies found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pharmacies.map((pharmacy, index) => (
        <PharmacyCard 
          key={index} 
          pharmacy={pharmacy} 
          onClick={onPharmacyClick}
        />
      ))}
    </div>
  );
}
