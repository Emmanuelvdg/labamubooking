
import { Card, CardContent } from '@/components/ui/card';
import { Clock, DollarSign, Calendar } from 'lucide-react';
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

  const selectedServices = services?.filter(service => 
    selectedServiceIds.includes(service.id)
  ) || [];

  if (selectedServiceIds.length === 0) {
    return null;
  }

  const totalDuration = calculateTotalDuration();
  const totalPrice = calculateTotalPrice();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <Calendar className="h-5 w-5" />
            <h3 className="font-semibold">Booking Summary</h3>
          </div>
          
          <div className="space-y-2">
            {selectedServices.map((service, index) => (
              <div key={service.id} className="flex items-center justify-between py-2 border-b border-blue-100 last:border-b-0">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-800">{service.name}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{service.duration}min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3" />
                    <span>Rp{service.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-blue-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-blue-800">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">{totalDuration} minutes total</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-800">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">Rp{totalPrice} total</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
