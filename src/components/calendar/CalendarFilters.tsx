
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X } from 'lucide-react';
import { Staff } from '@/types';
import { Service } from '@/types';

interface CalendarFiltersProps {
  selectedStaffId: string;
  selectedServiceId: string;
  staff: Staff[];
  services: Service[];
  filteredBookingsCount: number;
  currentMonth: string;
  onStaffChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onClearFilters: () => void;
}

export const CalendarFilters = ({
  selectedStaffId,
  selectedServiceId,
  staff,
  services,
  filteredBookingsCount,
  currentMonth,
  onStaffChange,
  onServiceChange,
  onClearFilters
}: CalendarFiltersProps) => {
  const hasActiveFilters = selectedStaffId !== 'all' || selectedServiceId !== 'all';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Staff Member
            </label>
            <Select value={selectedStaffId} onValueChange={onStaffChange}>
              <SelectTrigger>
                <SelectValue placeholder="All staff members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All staff members</SelectItem>
                {staff.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Service
            </label>
            <Select value={selectedServiceId} onValueChange={onServiceChange}>
              <SelectTrigger>
                <SelectValue placeholder="All services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All services</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button variant="outline" onClick={onClearFilters} className="mb-0">
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredBookingsCount} filtered booking{filteredBookingsCount !== 1 ? 's' : ''} for {currentMonth}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
