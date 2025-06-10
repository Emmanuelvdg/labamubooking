
import ReminderSettings from '@/components/settings/ReminderSettings';

const CustomerEngagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Engagement</h1>
        <p className="text-gray-600">Manage automated reminders and customer communications</p>
      </div>

      <ReminderSettings />
    </div>
  );
};

export default CustomerEngagement;
