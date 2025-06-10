
import { Service } from '@/types';

interface BookingSummaryProps {
  selectedServiceIds: string[];
  services?: Service[];
}

export const BookingSummary = ({ selectedServiceIds, services }: BookingSummaryProps) => {
  const calculateTotalDuration = () => {
    if (!services) return 0;
    return selectedServiceIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.duration || 0);
    }, 0);
  };

  const calculateTotalPrice = () => {
    if (!services) return 0;
    return selectedServiceIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  if (selectedServiceIds.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <div className="text-sm font-medium">Summary:</div>
      <div className="text-sm text-gray-600">
        Total Duration: {calculateTotalDuration()} minutes
      </div>
      <div className="text-sm text-gray-600">
        Total Price: ${calculateTotalPrice()}
      </div>
    </div>
  );
};
