
import { useEditBookingForm } from '@/hooks/useEditBookingForm';
import { ConflictsAlert } from './edit/ConflictsAlert';
import { EditBookingFormFields } from './edit/EditBookingFormFields';
import { EditHistory } from './edit/EditHistory';
import { Booking } from '@/types';

interface EditBookingFormProps {
  booking: Booking;
  onSuccess?: () => void;
}

export const EditBookingForm = ({ booking, onSuccess }: EditBookingFormProps) => {
  const {
    formData,
    updateFormData,
    conflicts,
    isCheckingConflicts,
    customers,
    staff,
    services,
    bookingEdits,
    editBooking,
    handleTimeChange,
    handleSubmit,
  } = useEditBookingForm(booking, onSuccess);

  return (
    <div className="space-y-6">
      <ConflictsAlert conflicts={conflicts} />

      <EditBookingFormFields
        formData={formData}
        updateFormData={updateFormData}
        customers={customers || []}
        staff={staff || []}
        services={services || []}
        isCheckingConflicts={isCheckingConflicts}
        conflicts={conflicts}
        editBooking={editBooking}
        onTimeChange={handleTimeChange}
        onSubmit={handleSubmit}
      />

      <EditHistory bookingEdits={bookingEdits || []} />
    </div>
  );
};
