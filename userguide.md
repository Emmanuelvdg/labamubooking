
# LabamuBooking User Guide

Welcome to LabamuBooking - your comprehensive service management and booking system. This guide will walk you through all the key features and functionalities of the platform.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Account and Business Registration](#account-and-business-registration)
3. [Managing Service Categories and Services](#managing-service-categories-and-services)
4. [Staff Management](#staff-management)
5. [Commission Management](#commission-management)
6. [Booking Management](#booking-management)
7. [Calendar Overview](#calendar-overview)
8. [Dashboard Analytics](#dashboard-analytics)

---

## Getting Started

LabamuBooking is a multi-tenant application that allows you to manage multiple businesses under a single account. Each business operates independently with its own staff, services, customers, and bookings.

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Valid email address

---

## Account and Business Registration

### 1. Register a New Account and Business

#### Step 1: Access the Registration Page
1. Navigate to the LabamuBooking website
2. Click on "Create Your Business Account" or visit `/tenant-create`

#### Step 2: Fill in Business Details
**Business Information:**
- **Business Name**: Enter your business name (required)
- **Business Type**: Select from available options like "Hair Salon", "Spa", "Fitness Center", etc. (required)
- **Description**: Optional brief description of your business

**Contact Information:**
- **Owner Name**: Full name of the business owner (required)
- **Email**: Business email address (required) - this will be your login email
- **Phone**: Business phone number (optional)

#### Step 3: Create Account Credentials
- **Password**: Create a secure password (minimum 6 characters) (required)
- **Confirm Password**: Re-enter your password for confirmation (required)

#### Step 4: Complete Registration
1. Review all information for accuracy
2. Click "Create Business & Account"
3. Check your email for a confirmation message (if email confirmation is enabled)
4. Once confirmed, you'll be automatically logged in and redirected to your dashboard

### 2. Register a New Business Under an Existing Account

If you already have an account and want to add another business:

#### Step 1: Access Business Creation
1. Log in to your existing account
2. Look for the tenant selector in the top navigation
3. Click on "Add New Business" or similar option

#### Step 2: Complete Business Setup
1. Fill in the new business details following the same process as above
2. The new business will be linked to your existing account
3. You can switch between businesses using the tenant selector

#### Step 3: Switch Between Businesses
- Use the tenant selector dropdown in the header
- The system will remember your last selected business
- Each business has its own independent data and settings

---

## Managing Service Categories and Services

### Service Categories

Categories help organize your services and make them easier to manage.

#### Creating Service Categories

1. **Navigate to Services**
   - Go to the "Services" page from the main navigation

2. **Access Category Management**
   - Click on "Manage Categories" button
   - This opens the category management dialog

3. **Add New Category**
   - Click "New Category"
   - Fill in the category details:
     - **Name**: Category name (e.g., "Hair Services", "Facial Treatments")
     - **Description**: Optional description
     - **Color**: Choose a color for visual identification
   - Click "Create Category"

4. **Edit Categories**
   - Click on any existing category to edit
   - Update the name, description, or color as needed
   - Save changes

### Services

#### Creating Services

1. **Access Service Creation**
   - From the Services page, click "New Service"

2. **Fill in Service Details**
   - **Name**: Service name (e.g., "Haircut", "Deep Tissue Massage")
   - **Description**: Detailed description of the service
   - **Category**: Select from your created categories
   - **Duration**: Service duration in minutes
   - **Price**: Service price in your local currency

3. **Save Service**
   - Click "Create Service"
   - The service will appear in your services list

#### Managing Services

- **Edit Services**: Click on any service card to edit details
- **Filter by Category**: Use category filters to view services by type
- **Service Organization**: Services are automatically organized by category

---

## Staff Management

### Staff Roles

#### Creating Staff Roles

1. **Access Role Management**
   - Go to the "Staff" page
   - Click on "Manage Roles"

2. **Create New Role**
   - Click "New Role"
   - Fill in role details:
     - **Name**: Role name (e.g., "Senior Stylist", "Massage Therapist")
     - **Description**: Role responsibilities and description
     - **Permissions**: Set specific permissions for this role
   - Save the role

#### Role Permissions

Roles control what staff members can access and do in the system:
- **Booking Management**: Create, edit, cancel bookings
- **Customer Management**: View and manage customer information
- **Schedule Management**: Manage their own schedules
- **Service Management**: Add or modify services
- **Staff Management**: Manage other staff members (admin roles)

### Adding Staff Members

#### Step 1: Create Staff Profile

1. **Navigate to Staff Overview**
   - Go to "Staff" → "Staff Overview" tab

2. **Add New Staff Member**
   - Click "New Staff Member"
   - Fill in staff details:
     - **Name**: Full name of the staff member
     - **Email**: Their email address
     - **Role**: Select from your created roles
     - **Skills**: Add relevant skills (e.g., "Coloring", "Extensions")
     - **Status**: Set as Active or Inactive

3. **Save Staff Member**
   - Click "Create Staff Member"
   - The staff member will appear in your team list

#### Step 2: Staff Account Creation (Optional)

1. **Create Staff Account**
   - Right-click on the staff member card
   - Select "Create Account" from the context menu
   - Set up login credentials for the staff member
   - This allows staff to log in and manage their own schedules

### Staff Schedules

#### Setting Up Individual Schedules

1. **Access Schedule Management**
   - Go to "Staff" → "Schedules" tab

2. **Create New Schedule**
   - Click "New Schedule"
   - Fill in schedule details:
     - **Staff Member**: Select the staff member
     - **Title**: Schedule title (e.g., "Morning Shift", "Weekend Hours")
     - **Start Date & Time**: When the schedule starts
     - **End Date & Time**: When the schedule ends
     - **Description**: Additional notes

3. **Recurring Schedules**
   - Enable "Recurring" option
   - Choose repeat pattern:
     - **Weekly**: Select specific days of the week
     - **Custom**: Set custom intervals
   - Set end date for recurring schedule

4. **Save Schedule**
   - Click "Create Schedule"
   - The schedule will appear in the calendar view

#### Managing Schedule Templates

1. **Create Templates**
   - Templates allow you to quickly apply common schedule patterns
   - Create templates for standard shifts (e.g., "Full Day", "Part Time")

2. **Apply Templates**
   - When creating new schedules, select from existing templates
   - Templates speed up the scheduling process

#### Schedule Calendar View

- **Weekly View**: See all staff schedules in a weekly calendar
- **Staff Filter**: Filter to view specific staff member schedules
- **Color Coding**: Different staff members have different colors
- **Conflict Detection**: System warns of scheduling conflicts

---

## Commission Management

### Commission Schemes

Commission schemes define how staff members earn commissions on services.

#### Creating Commission Schemes

1. **Navigate to Commissions**
   - Go to "Commissions" from the main navigation
   - Select "Commission Schemes" tab

2. **Add New Scheme**
   - Click "New Commission Scheme"
   - Fill in scheme details:
     - **Staff Member**: Select the staff member
     - **Service**: Choose specific service or leave blank for all services
     - **Commission Type**: 
       - **Percentage**: Commission as percentage of service price
       - **Fixed Amount**: Fixed amount per service
     - **Commission Value**: Enter the percentage (e.g., 15) or fixed amount
     - **Status**: Set as Active or Inactive

3. **Save Scheme**
   - Click "Create Scheme"
   - The scheme will be automatically applied to future bookings

#### Commission Scheme Examples

- **Service-Specific**: 20% commission on all haircut services
- **General**: 15% commission on all services for a staff member
- **Fixed Rate**: $10 commission per massage service
- **Tiered**: Different rates for different service categories

#### Viewing Commission Records

1. **Access Commission Records**
   - Go to "Commissions" → "Commission Records" tab

2. **Review Earnings**
   - See all commission records generated from completed bookings
   - Filter by staff member, date range, or service
   - View total earnings per staff member
   - Track payment status

3. **Commission Calculation**
   - Commissions are automatically calculated when bookings are marked as "Completed"
   - Based on the service price and applicable commission scheme
   - Records show: service price, commission rate, calculated amount

---

## Booking Management

### Creating New Bookings

#### Step 1: Access Booking Creation

1. **Navigate to Bookings**
   - Go to "Bookings" from the main navigation
   - Click "New Booking"

#### Step 2: Select Customer

1. **Choose Existing Customer**
   - Search and select from your customer database
   - View customer history and preferences

2. **Add New Customer**
   - If customer doesn't exist, click "New Customer"
   - Fill in customer details:
     - **Name**: Customer's full name
     - **Email**: Contact email
     - **Phone**: Contact phone number
   - Save customer profile

#### Step 3: Booking Details

1. **Service Selection**
   - Choose the service from your service catalog
   - Service duration and price are automatically populated

2. **Staff Assignment**
   - Select available staff member
   - System shows staff members qualified for the selected service

3. **Date and Time**
   - Choose booking date using the calendar picker
   - Select available time slot
   - System prevents double-booking conflicts

4. **Additional Information**
   - **Notes**: Add any special instructions or customer preferences
   - **Status**: Set initial status (usually "Confirmed" or "Pending")

#### Step 4: Confirm Booking

1. **Review Details**
   - Double-check all booking information
   - Verify no scheduling conflicts exist

2. **Save Booking**
   - Click "Create Booking"
   - Booking appears in your bookings list and calendar

### Editing Existing Bookings

#### Accessing Booking Edit

1. **Find the Booking**
   - Navigate to "Bookings" page
   - Use search or browse to find the booking
   - Click on the booking card

2. **Edit Booking Details**
   - Click "Edit" on the booking card
   - Modify any booking details:
     - **Customer**: Change customer (if needed)
     - **Service**: Update service selection
     - **Staff**: Reassign to different staff member
     - **Date/Time**: Reschedule the appointment
     - **Status**: Update booking status
     - **Notes**: Add or modify notes

3. **Conflict Management**
   - System checks for scheduling conflicts
   - Displays warnings if conflicts are detected
   - Suggests alternative time slots

4. **Save Changes**
   - Provide reason for changes (tracked in booking history)
   - Click "Update Booking"
   - Changes are logged for audit purposes

### Booking Status Management

#### Status Types

- **Pending**: Booking awaiting confirmation
- **Confirmed**: Confirmed appointment
- **Cancelled**: Cancelled booking
- **Completed**: Service has been completed

#### Status Workflow

1. **New Booking**: Usually starts as "Pending" or "Confirmed"
2. **Confirmation**: Change "Pending" to "Confirmed" once verified
3. **Completion**: Mark as "Completed" after service delivery
4. **Cancellation**: Change to "Cancelled" if appointment is cancelled

#### Status Updates

- Edit booking and change status field
- Status changes are tracked in booking history
- Completed bookings trigger commission calculations

---

## Calendar Overview

### Accessing the Calendar

1. **Navigate to Calendar**
   - Click "Calendar" in the main navigation
   - Calendar displays all bookings in a monthly view

### Calendar Features

#### Monthly View

- **Day Grid**: See all bookings organized by day
- **Booking Cards**: Each booking shows:
  - Customer name
  - Service name
  - Time slot
  - Staff member
  - Booking status (color-coded)

#### Filtering Options

1. **Staff Filter**
   - Filter calendar to show specific staff member's bookings
   - Useful for viewing individual schedules

2. **Service Filter**
   - Filter by specific service types
   - Helps analyze service demand patterns

3. **Clear Filters**
   - Reset all filters to view complete calendar

#### Navigation

- **Month Navigation**: Use arrow buttons to navigate between months
- **Current Month**: Header shows current month and year
- **Booking Count**: See total bookings for filtered view

#### Booking Information

- **Time Display**: Bookings show start time in 12-hour format
- **Status Colors**: Different colors indicate booking status
- **Quick View**: Click on booking for quick details
- **Multi-booking Days**: Days with multiple bookings show count

### Calendar Management

#### Daily Scheduling

- View all appointments for any given day
- Identify busy periods and available slots
- Spot scheduling conflicts quickly

#### Resource Planning

- See staff utilization across the month
- Identify peak and slow periods
- Plan staff schedules accordingly

#### Customer Flow

- Track customer appointment patterns
- Identify regular customers and their preferences
- Plan service capacity based on demand

---

## Dashboard Analytics

### Dashboard Overview

The dashboard provides key insights into your business performance.

#### Key Metrics

1. **Total Bookings**: Number of bookings in current period
2. **Total Revenue**: Revenue generated from completed bookings
3. **Active Staff**: Number of active staff members
4. **Customer Base**: Total number of customers

#### Recent Activity

- **Recent Bookings**: Latest booking activities
- **Upcoming Appointments**: Next scheduled appointments
- **Status Summary**: Breakdown of booking statuses

#### Performance Insights

- **Booking Trends**: Track booking patterns over time
- **Service Popularity**: Most requested services
- **Staff Performance**: Individual staff booking counts
- **Revenue Tracking**: Financial performance metrics

### Using Analytics for Business Decisions

#### Capacity Planning

- Analyze busy periods to plan staff schedules
- Identify peak days and times
- Optimize service availability

#### Service Optimization

- Track which services are most popular
- Adjust pricing based on demand
- Plan service expansions or reductions

#### Staff Management

- Monitor staff utilization rates
- Balance workloads across team members
- Plan training and development needs

---

## Tips for Success

### Getting Started Checklist

1. ✅ Create your business account and profile
2. ✅ Set up service categories and services
3. ✅ Create staff roles and add team members
4. ✅ Set up staff schedules
5. ✅ Configure commission schemes
6. ✅ Add your first customers
7. ✅ Create your first bookings
8. ✅ Familiarize yourself with the calendar view

### Best Practices

#### Service Management
- Keep service descriptions clear and detailed
- Update prices regularly
- Use categories to organize services logically

#### Staff Management
- Define clear roles with appropriate permissions
- Keep staff information updated
- Regularly review and update schedules

#### Booking Management
- Confirm bookings promptly
- Keep detailed notes for customer preferences
- Update booking status as services progress

#### Customer Relations
- Maintain accurate customer information
- Track customer preferences and history
- Use booking notes for personalized service

#### Commission Management
- Set up commission schemes early
- Review commission records regularly
- Ensure schemes are fair and motivating

### Troubleshooting Common Issues

#### Login Issues
- Ensure you're using the correct email and password
- Check if email confirmation is required
- Contact support if account is locked

#### Booking Conflicts
- Check staff availability before scheduling
- Use calendar view to identify conflicts
- Consider rescheduling conflicting appointments

#### Data Issues
- Ensure all required fields are completed
- Check for duplicate entries
- Verify permissions for data access

---

## Support and Resources

### Getting Help

- **User Guide**: This comprehensive guide covers all features
- **System Notifications**: Pay attention to error messages and warnings
- **Dashboard Insights**: Use analytics to understand your business better

### System Updates

- LabamuBooking is regularly updated with new features
- Check announcements for new functionality
- Provide feedback on features you'd like to see

### Data Security

- Your business data is securely stored and isolated
- Each business operates independently
- Regular backups ensure data protection

---

## Conclusion

LabamuBooking provides a comprehensive solution for managing service-based businesses. From initial setup to daily operations, the system supports all aspects of booking management, staff coordination, and business analytics.

Take time to explore each feature and customize the system to match your business needs. Regular use of the analytics and reporting features will help you make informed decisions to grow your business.

For the best experience, maintain accurate data, keep staff information updated, and regularly review your booking patterns and commission structures.

Welcome to efficient business management with LabamuBooking!
