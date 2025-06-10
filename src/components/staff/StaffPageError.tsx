
interface StaffPageErrorProps {
  error: Error;
}

export const StaffPageError = ({ error }: StaffPageErrorProps) => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-red-600">Error loading staff: {error.message}</div>
    </div>
  );
};
