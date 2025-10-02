# Product Requirements Document (PRD)
## Booking Management Platform

**Version:** 1.0  
**Date:** January 2025  
**Status:** In Development

---

## Executive Summary

The Booking Management Platform is a comprehensive, multi-tenant SaaS solution designed to streamline appointment scheduling, staff management, and customer engagement for service-based businesses. The platform provides both internal management tools and a public-facing online booking system, enabling businesses to efficiently manage their operations while providing customers with a seamless booking experience.

### Key Objectives
- Provide a complete booking management solution for service-based businesses
- Enable multi-tenant architecture supporting multiple independent businesses
- Offer public online booking capabilities for customer self-service
- Implement comprehensive staff scheduling and roster management
- Support commission tracking and reporting
- Integrate with third-party booking platforms
- Maintain security and data isolation between tenants

---

## Product Overview

### Target Users
1. **Business Owners** - Salon owners, spa managers, clinic administrators
2. **Staff Members** - Service providers, therapists, stylists
3. **Administrators** - Business managers with elevated permissions
4. **Customers** - End-users booking appointments

### Core Value Propositions
- **For Business Owners**: Centralized management of bookings, staff, and revenue with real-time insights
- **For Staff**: Clear visibility of schedules, assignments, and commission tracking
- **For Customers**: Easy online booking with real-time availability

---

## 1. Dashboard Module

### Overview
The Dashboard provides a real-time overview of business performance with key metrics and insights.

### Features
- Today's appointment count and upcoming appointments
- Revenue metrics (today, week, month)
- Staff utilization statistics
- Recent booking activity
- Quick action buttons for common tasks

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To view today's appointment count | I can quickly understand daily workload | I am on the dashboard | The page loads | I see the total number of appointments scheduled for today |
| Business Owner | To see revenue metrics for today, this week, and this month | I can track business performance | I am on the dashboard with completed bookings | The dashboard loads | Revenue cards display accurate totals for each time period |
| Business Owner | To view staff utilization rates | I can identify optimization opportunities | I have staff with scheduled appointments | I view the dashboard | Utilization percentages are displayed for each staff member |
| Business Owner | To see recent booking activity | I can monitor business operations | Recent bookings exist in the system | I load the dashboard | A list of the most recent bookings is displayed with timestamps |
| Business Owner | To access quick actions | I can perform common tasks efficiently | I am viewing the dashboard | I click a quick action button (e.g., "New Booking") | The relevant dialog or page opens |
| Business Owner | To view an empty state when no data exists | I understand what to do next | No bookings exist in the system | I load the dashboard | Helpful messages and call-to-action buttons guide me to create initial data |

---

## 2. Calendar Module

### Overview
The Calendar module provides visual scheduling with day, week, and month views, waitlist management, and drag-and-drop appointment editing.

### Features
- Multiple view modes (daily, weekly, monthly)
- Visual appointment blocks with color coding
- Filter by staff member, service, or status
- Drag-and-drop rescheduling
- Integrated waitlist panel
- Conflict detection
- Availability slot visualization

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To view appointments in a calendar format | I can visualize the schedule | Bookings exist in the system | I navigate to the Calendar page | Appointments are displayed as blocks in the calendar grid |
| Business Owner | To switch between daily, weekly, and monthly views | I can see schedules at different granularities | I am on the calendar page | I click a view toggle button | The calendar refreshes to show the selected view |
| Business Owner | To filter appointments by staff member | I can focus on a specific provider's schedule | Multiple staff members have bookings | I select a staff filter | Only appointments for that staff member are displayed |
| Business Owner | To filter appointments by service type | I can analyze service demand | Multiple service types have bookings | I select a service filter | Only appointments for that service are displayed |
| Business Owner | To filter appointments by status | I can focus on pending or confirmed bookings | Bookings with different statuses exist | I select a status filter (e.g., "Pending") | Only appointments with that status are displayed |
| Business Owner | To create a new appointment from the calendar | I can quickly schedule bookings | I am viewing the calendar | I click on an empty time slot | A new booking dialog opens with the date and time pre-filled |
| Business Owner | To view appointment details | I can see customer and service information | I click on an appointment block | The click occurs | A detailed view or popover shows booking information |
| Business Owner | To drag and drop appointments | I can easily reschedule bookings | An appointment exists | I drag an appointment to a new time slot | The booking is rescheduled and conflicts are checked |
| Business Owner | To see conflict warnings | I can avoid double-bookings | I attempt to schedule overlapping appointments | A conflict is detected | A warning message is displayed and the action is blocked or flagged |
| Business Owner | To view the waitlist alongside the calendar | I can convert waitlist entries when slots open | Waitlist entries exist | I view the calendar page | The waitlist panel is visible on the side |
| Administrator | To see color-coded appointment statuses | I can quickly identify booking states | Bookings with various statuses exist | I view the calendar | Appointments are color-coded (e.g., green for confirmed, yellow for pending) |
| Staff Member | To view only my own appointments | I can focus on my schedule | I have staff-level permissions | I access the calendar | I see only my assigned appointments |

### Negative Test Cases

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To be prevented from creating overlapping appointments | Data integrity is maintained | A staff member has an existing booking | I attempt to book the same staff at an overlapping time | An error message displays and the booking is not created |
| Business Owner | To see an empty state in the calendar | I understand no bookings exist | No appointments are scheduled | I view the calendar | An empty state message appears with guidance to create bookings |
| Business Owner | To handle drag-and-drop failures gracefully | The system remains stable | A network error occurs | I drag an appointment and the update fails | The appointment returns to its original position with an error message |

---

## 3. Bookings Module

### Overview
The Bookings module manages all appointments with comprehensive CRUD operations, status management, and audit trails.

### Features
- List view of all bookings with filtering and sorting
- Create new bookings with customer, service, and staff selection
- Edit existing bookings with conflict detection
- Cancel or complete bookings
- View booking history and edit logs
- Booking reference numbers
- Notes and internal comments

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To view a list of all bookings | I can manage appointments | Bookings exist in the system | I navigate to the Bookings page | A table displays all bookings with key details |
| Business Owner | To filter bookings by date range | I can focus on specific time periods | Multiple bookings exist | I select a date range filter | Only bookings within that range are displayed |
| Business Owner | To filter bookings by status | I can manage pending or completed appointments | Bookings with different statuses exist | I select a status filter | Only bookings matching that status are shown |
| Business Owner | To search for bookings by customer name | I can quickly find specific appointments | Bookings exist for various customers | I enter a customer name in the search box | Matching bookings are displayed |
| Business Owner | To create a new booking | I can schedule appointments for customers | Customers, services, and staff exist | I click "New Booking" and fill out the form | A new booking is created and appears in the list |
| Business Owner | To select a customer when creating a booking | I can associate the booking with the right person | Customers exist in the system | I open the new booking dialog | A searchable customer dropdown is available |
| Business Owner | To create a new customer during booking creation | I can serve walk-in clients | I am creating a booking | I click "Add New Customer" in the customer selector | A customer creation form appears inline |
| Business Owner | To select a service when creating a booking | I can specify what service is being provided | Services exist in the system | I am creating a booking | A service dropdown displays all available services with prices and durations |
| Business Owner | To select a staff member when creating a booking | I can assign the right provider | Staff members exist | I am creating a booking | A staff dropdown shows available staff (or "Any Available") |
| Business Owner | To select a date and time | I can schedule the appointment | I am creating a booking | I interact with date and time pickers | Available time slots are displayed based on staff schedules |
| Business Owner | To see only available time slots | I don't double-book staff | A staff member and service are selected | I view time slot options | Only non-conflicting slots are shown as available |
| Business Owner | To add notes to a booking | I can record special requests or information | I am creating or editing a booking | I enter text in the notes field | The notes are saved with the booking |
| Business Owner | To edit an existing booking | I can make changes to appointments | A booking exists | I click "Edit" on a booking | An edit dialog opens with pre-filled information |
| Business Owner | To change the booking date/time when editing | I can reschedule appointments | I am editing a booking | I select a new date/time | Conflict detection runs and updates are saved if valid |
| Business Owner | To view booking edit history | I can track changes made to appointments | A booking has been edited | I view the booking details | An edit history log is displayed with timestamps and users |
| Business Owner | To cancel a booking | I can handle cancellations | A confirmed booking exists | I click "Cancel" and confirm | The booking status changes to "Cancelled" |
| Business Owner | To mark a booking as completed | I can track finished appointments | A confirmed booking's time has passed | I click "Complete" | The booking status changes to "Completed" and commissions are calculated |
| Business Owner | To mark a booking as no-show | I can track customer attendance | A booking time has passed without the customer arriving | I click "No Show" | The booking status changes to "No Show" |
| Business Owner | To view booking details | I can see all information about an appointment | A booking exists | I click on a booking row | A detailed view displays customer, service, staff, time, and notes |
| Business Owner | To see a unique booking reference number | I can easily identify and communicate about bookings | A booking is created | I view the booking | A unique reference code (e.g., "BK20250123-A1B2C3") is displayed |
| Administrator | To delete a booking | I can remove erroneous entries | A booking exists | I click "Delete" and confirm | The booking is permanently removed from the system |

### Negative Test Cases

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To be prevented from creating a booking without required fields | Data integrity is maintained | I am creating a booking | I submit without selecting customer, service, or time | Validation errors highlight the missing fields |
| Business Owner | To be warned about scheduling conflicts | I avoid double-bookings | A staff member is already booked | I try to create an overlapping booking | A conflict warning is displayed |
| Business Owner | To handle booking creation failures | The system recovers gracefully | A database error occurs | I submit a new booking | An error message is displayed and the form remains filled |
| Business Owner | To see an empty state when no bookings exist | I understand what to do | No bookings are in the system | I view the Bookings page | An empty state with a "Create Booking" call-to-action is shown |

---

## 4. Customers Module

### Overview
The Customers module manages customer profiles, contact information, and booking history.

### Features
- Customer list with search and filtering
- Create and edit customer profiles
- Store contact information (name, email, phone, birth date)
- View customer booking history
- Customer avatars
- Delete customer records
- Sync customers from external integrations

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To view a list of all customers | I can manage my client base | Customers exist in the system | I navigate to the Customers page | A table displays all customers with names and contact info |
| Business Owner | To search for customers by name | I can quickly find specific clients | Multiple customers exist | I enter a name in the search box | Matching customers are displayed |
| Business Owner | To search for customers by email or phone | I can locate clients by different identifiers | Customers have email/phone records | I search by email or phone | Matching customers are found |
| Business Owner | To create a new customer | I can add new clients | I am on the Customers page | I click "New Customer" and fill the form | A new customer profile is created |
| Business Owner | To enter customer name | I can identify clients | I am creating a customer | I enter a name in the name field | The name is saved with the profile |
| Business Owner | To enter customer email | I can send confirmations and communicate | I am creating a customer | I enter an email in the email field | The email is validated and saved |
| Business Owner | To enter customer phone number | I can contact clients | I am creating a customer | I enter a phone number | The phone is saved with the profile |
| Business Owner | To enter customer birth date | I can send birthday promotions | I am creating a customer | I select a birth date | The date is saved with the profile |
| Business Owner | To upload a customer avatar | I can visually identify clients | I am creating or editing a customer | I upload an image | The avatar is stored and displayed |
| Business Owner | To edit customer information | I can keep records up-to-date | A customer exists | I click "Edit" on a customer | An edit dialog opens with pre-filled data |
| Business Owner | To view a customer's booking history | I can see their appointment patterns | A customer has past bookings | I view customer details | A list of past bookings is displayed |
| Business Owner | To delete a customer | I can remove records | A customer exists | I click "Delete" and confirm | The customer is removed (with safeguards for active bookings) |
| Business Owner | To sync customers from external systems | I can import existing client data | An integration is configured | I click "Sync Customers" | Customers are imported from the external system |
| Administrator | To see validation errors for invalid emails | Data quality is maintained | I am creating a customer | I enter an invalid email format | A validation error is displayed |

### Negative Test Cases

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To be prevented from creating a customer without a name | Data integrity is maintained | I am creating a customer | I submit without entering a name | A validation error highlights the name field |
| Business Owner | To be prevented from creating a customer without an email | Communication is possible | I am creating a customer | I submit without entering an email | A validation error highlights the email field |
| Business Owner | To be warned when deleting a customer with active bookings | I don't lose important data | A customer has upcoming bookings | I attempt to delete them | A warning message asks for confirmation |
| Business Owner | To see an empty state when no customers exist | I understand what to do | No customers are in the system | I view the Customers page | An empty state with a "Create Customer" button is shown |

---

## 5. Staff Module

### Overview
The Staff module manages employee profiles, roles, permissions, schedules, roster assignments, and commission tracking.

### Features
- Staff list with filtering and search
- Create and edit staff profiles
- Staff roles and permissions management
- Staff schedule management (recurring and one-time)
- Roster assignments
- Staff availability settings
- Avatar uploads
- Commission tracking per staff member
- Public profile configuration for online booking

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To view a list of all staff members | I can manage my team | Staff members exist | I navigate to the Staff page | A list displays all staff with names and roles |
| Business Owner | To create a new staff member | I can onboard new employees | I am on the Staff page | I click "New Staff" and fill the form | A new staff profile is created |
| Business Owner | To enter staff name and contact info | I can identify and communicate with staff | I am creating a staff member | I enter name, email, and phone | The information is saved |
| Business Owner | To assign a role to a staff member | I can define their permissions | I am creating or editing staff | I select a role from the dropdown | The role is assigned to the staff member |
| Business Owner | To set staff specialization | I can match them with appropriate services | I am creating or editing staff | I enter specialization details | The information is saved |
| Business Owner | To upload a staff avatar | I can visually identify team members | I am editing a staff profile | I upload an image | The avatar is stored and displayed |
| Business Owner | To edit staff information | I can keep records current | A staff member exists | I click "Edit" on a staff profile | An edit dialog opens with pre-filled data |
| Business Owner | To deactivate a staff member | I can handle departures without deleting history | An active staff member exists | I toggle "Is Active" to off | The staff member is marked inactive and hidden from new bookings |
| Business Owner | To view a staff member's schedule | I can see their work hours | A staff member has schedules | I navigate to their schedule tab | A calendar shows their scheduled working times |
| Business Owner | To create a recurring schedule for staff | I can define regular work hours | I am managing a staff member | I create a recurring schedule (e.g., Mon-Fri 9am-5pm) | The schedule repeats weekly and generates availability slots |
| Business Owner | To create a one-time schedule for staff | I can handle special shifts | I am managing a staff member | I create a non-recurring schedule | The schedule applies only to the specified date |
| Business Owner | To edit or delete staff schedules | I can adjust work hours | A schedule exists | I edit or delete a schedule | The changes are applied and availability slots regenerate |
| Business Owner | To view schedule exceptions | I can see when staff are unavailable | A schedule has exceptions (cancelled days) | I view the schedule | Exception dates are highlighted |
| Business Owner | To view roster assignments | I can see day-to-day work assignments | Roster assignments exist | I navigate to the Roster tab | Assignments are displayed in a calendar view |
| Business Owner | To create a roster assignment | I can assign staff to specific shifts | I am viewing rosters | I create a new assignment with date and time | The assignment is saved and appears in the calendar |
| Business Owner | To detect roster conflicts | I avoid double-booking staff | Overlapping assignments exist | I attempt to create a conflicting roster assignment | A conflict warning is displayed |
| Business Owner | To generate rosters from templates | I can quickly create recurring patterns | A roster template exists | I apply the template to a date range | Multiple assignments are created automatically |
| Business Owner | To manage staff roles | I can control access permissions | I am in staff management | I create or edit roles with specific permissions | Roles are saved and can be assigned to staff |
| Business Owner | To configure staff public profiles | I can display staff on the online booking page | I am editing a staff member | I configure their public profile settings (visibility, bio, specialties) | The profile appears on the public booking site |
| Business Owner | To view staff commission records | I can track earnings and performance | Completed bookings exist | I view commission reports | Commission calculations are displayed per staff member |
| Administrator | To create user accounts for staff | Staff can log into the system | I am creating a staff member | I set up their user account credentials | The staff member can log in with their credentials |

### Negative Test Cases

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To be prevented from creating staff without required fields | Data integrity is maintained | I am creating a staff member | I submit without name or role | Validation errors are displayed |
| Business Owner | To be warned about scheduling conflicts | Staff aren't double-booked | Overlapping schedules exist | I create a conflicting schedule | A conflict warning is shown |
| Business Owner | To handle avatar upload failures | The system remains stable | An upload error occurs | I attempt to upload an avatar | An error message is displayed and the form remains intact |
| Business Owner | To see an empty state when no staff exist | I understand what to do | No staff members are in the system | I view the Staff page | An empty state with a "Create Staff" button is shown |

---

## 6. Services Module

### Overview
The Services module manages the catalog of services offered, including categorization, pricing, duration, and public visibility.

### Features
- Service list with categorization
- Create and edit services
- Service categories management
- Pricing and duration settings
- Service descriptions
- Public service profiles for online booking
- Sync services from external integrations

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To view a list of all services | I can manage my offerings | Services exist in the system | I navigate to the Services page | A list displays all services with names, prices, and durations |
| Business Owner | To create a new service | I can offer new treatments | I am on the Services page | I click "New Service" and fill the form | A new service is created |
| Business Owner | To enter service name | I can identify the offering | I am creating a service | I enter a name | The name is saved |
| Business Owner | To enter service description | I can inform customers about the service | I am creating a service | I enter a description | The description is saved |
| Business Owner | To set service price | I can define the cost | I am creating a service | I enter a price | The price is saved and displayed |
| Business Owner | To set service duration | I can allocate appropriate time | I am creating a service | I enter duration in minutes | The duration is saved |
| Business Owner | To assign a service to a category | I can organize my offerings | Categories exist | I select a category when creating a service | The service is linked to the category |
| Business Owner | To create service categories | I can organize services logically | I am on the Services page | I open "Manage Categories" and create a new category | The category is saved and available for assignment |
| Business Owner | To edit service categories | I can update organization | A category exists | I edit a category name or description | The changes are saved |
| Business Owner | To delete service categories | I can remove unused categories | A category exists | I delete a category | The category is removed (with safeguards for services using it) |
| Business Owner | To edit service information | I can update offerings | A service exists | I click "Edit" on a service | An edit dialog opens with pre-filled data |
| Business Owner | To delete a service | I can remove discontinued offerings | A service exists | I click "Delete" and confirm | The service is removed (with safeguards for active bookings) |
| Business Owner | To configure public service profiles | I can control what appears on the booking page | I am editing a service | I configure visibility and online booking settings | The service appears on the public site as configured |
| Business Owner | To add service features/highlights | I can showcase benefits | I am editing a public service profile | I add feature bullet points | Features are displayed on the public booking page |
| Business Owner | To sync services from external systems | I can import existing service catalogs | An integration is configured | I click "Sync Services" | Services are imported from the external system |

### Negative Test Cases

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To be prevented from creating a service without required fields | Data integrity is maintained | I am creating a service | I submit without name, price, or duration | Validation errors are displayed |
| Business Owner | To be warned when deleting a service with active bookings | I don't disrupt operations | A service has upcoming bookings | I attempt to delete it | A warning message is displayed |
| Business Owner | To handle invalid price entries | Financial data is accurate | I am creating a service | I enter a negative or non-numeric price | A validation error is shown |
| Business Owner | To see an empty state when no services exist | I understand what to do | No services are in the system | I view the Services page | An empty state with a "Create Service" button is shown |

---

## 7. Commissions Module

### Overview
The Commissions module tracks and manages staff commissions based on completed bookings, supporting both percentage and fixed-amount schemes.

### Features
- Commission scheme creation and management
- Percentage-based or fixed-amount commissions
- Service-specific or general commission rules
- Staff-specific commission schemes
- Commission records automatically generated on booking completion
- Commission reports and tracking

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To view a list of commission schemes | I can manage payment structures | Commission schemes exist | I navigate to the Commissions page | A table displays all schemes with staff, services, and rates |
| Business Owner | To create a commission scheme | I can define staff earnings | I am on the Commissions page | I click "New Commission Scheme" | A creation dialog opens |
| Business Owner | To select a staff member for a scheme | I can assign commissions to specific employees | I am creating a scheme | I select a staff member | The scheme is linked to that staff member |
| Business Owner | To optionally select a service | I can define service-specific commissions | I am creating a scheme | I select a specific service or leave it blank | The scheme applies to that service or all services |
| Business Owner | To set commission type (percentage or fixed) | I can choose the calculation method | I am creating a scheme | I select "Percentage" or "Nominal" | The type is saved |
| Business Owner | To set commission value | I can define the amount or rate | I am creating a scheme | I enter a value (e.g., 15% or Rp50000) | The value is saved |
| Business Owner | To activate or deactivate schemes | I can control which rules are active | A scheme exists | I toggle the "Is Active" status | The scheme is enabled or disabled |
| Business Owner | To edit commission schemes | I can adjust payment structures | A scheme exists | I click "Edit" on a scheme | An edit dialog opens with pre-filled data |
| Business Owner | To delete commission schemes | I can remove outdated rules | A scheme exists | I click "Delete" and confirm | The scheme is removed |
| Business Owner | To automatically generate commission records | Commissions are tracked accurately | A booking is marked as completed | The completion occurs | A commission record is created based on applicable schemes |
| Business Owner | To view commission records | I can see earnings history | Commission records exist | I view the commission records table | Records show booking details, service price, and commission amounts |
| Business Owner | To filter commission records by staff member | I can review individual earnings | Records exist for multiple staff | I select a staff filter | Only that staff member's commissions are shown |
| Business Owner | To filter commission records by date range | I can generate reports for specific periods | Records exist | I select a date range | Only commissions from that period are displayed |
| Business Owner | To see commission totals | I can understand payout amounts | Commission records exist | I view the commissions page | Total commission amounts are calculated and displayed |

### Negative Test Cases

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To be prevented from creating a scheme without required fields | Data integrity is maintained | I am creating a scheme | I submit without staff or commission value | Validation errors are displayed |
| Business Owner | To handle invalid commission values | Calculations are accurate | I am creating a scheme | I enter a negative value or >100% | A validation error is shown |
| Business Owner | To be warned about conflicting schemes | Commission calculation is clear | Multiple schemes apply to the same staff/service | I create a potentially conflicting scheme | A warning message is displayed |
| Business Owner | To see an empty state when no schemes exist | I understand what to do | No schemes are in the system | I view the Commissions page | An empty state with a "Create Scheme" button is shown |

---

## 8. Calendar Waitlist

### Overview
The Waitlist feature allows businesses to manage customers waiting for appointments, track queue positions, and convert waitlist entries to bookings.

### Features
- Add customers to waitlist
- Queue position management
- Status tracking (waiting, called, served, cancelled)
- Convert waitlist entry to booking
- Estimated wait time tracking
- Waitlist notifications

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To add a customer to the waitlist | I can manage walk-ins and overflow demand | I am viewing the calendar or waitlist | I click "Add to Waitlist" | A dialog opens to create a waitlist entry |
| Business Owner | To select a customer for the waitlist | I can track who is waiting | I am adding to waitlist | I select a customer from the dropdown | The customer is associated with the entry |
| Business Owner | To select a service for the waitlist entry | I know what the customer is waiting for | I am adding to waitlist | I select a service | The service is saved with the entry |
| Business Owner | To optionally specify a preferred staff member | I can honor customer preferences | I am adding to waitlist | I select a preferred staff member | The preference is saved |
| Business Owner | To set estimated wait time | I can inform customers | I am adding to waitlist | I enter an estimated wait time in minutes | The time is saved and displayed |
| Business Owner | To add notes to a waitlist entry | I can record special information | I am adding to waitlist | I enter notes | The notes are saved |
| Business Owner | To view the waitlist queue | I can manage waiting customers | Waitlist entries exist | I view the waitlist panel | Entries are displayed in queue order |
| Business Owner | To see automatic queue positions | Entries are fairly ordered | Multiple entries exist | I view the waitlist | Entries show their position (1, 2, 3, etc.) |
| Business Owner | To call the next customer in queue | I can notify them it's their turn | A customer is in "waiting" status | I click "Call Next" | The status changes to "called" |
| Business Owner | To mark a customer as served | I can track completion | A customer has been called | I click "Mark as Served" | The status changes to "served" and queue positions update |
| Business Owner | To cancel a waitlist entry | I can remove customers who left | An entry exists | I click "Cancel" | The entry is marked as cancelled and queue positions update |
| Business Owner | To convert a waitlist entry to a booking | I can schedule the customer | An entry exists | I click "Convert to Booking" | A booking dialog opens with pre-filled customer and service info |
| Business Owner | To select date and time when converting | I can schedule appropriately | I am converting a waitlist entry | I choose available date and time slots | The booking is created with selected details |
| Business Owner | To see status badges on waitlist entries | I can quickly identify entry states | Entries with different statuses exist | I view the waitlist | Color-coded badges show each entry's status |

### Negative Test Cases

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To be prevented from adding to waitlist without required fields | Data integrity is maintained | I am adding to waitlist | I submit without customer or service | Validation errors are displayed |
| Business Owner | To handle conversion failures gracefully | The system remains stable | A booking conflict exists | I attempt to convert a waitlist entry | An error message explains the conflict |
| Business Owner | To see an empty state when waitlist is empty | I understand the current state | No waitlist entries exist | I view the waitlist panel | An empty state message is displayed |

---

## 9. Settings Module

### Overview
The Settings module provides configuration for business information, booking rules, and system preferences.

### Features
- General business settings (name, contact info)
- Business type selection
- Booking settings (lead time, cancellation policies)
- Time zone configuration
- Language selection
- Notification settings
- Public booking page customization

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To edit business name | My business is correctly identified | I am on the Settings page | I edit the business name field | The name is saved and displayed throughout the system |
| Business Owner | To edit business contact information | Customers can reach me | I am on Settings | I edit email, phone, and address | The information is saved |
| Business Owner | To select my business type | The system is tailored to my industry | I am on Settings | I select from business type options (salon, spa, clinic) | The type is saved |
| Business Owner | To set booking lead time | I control how far in advance customers can book | I am on Settings | I configure minimum and maximum lead time in hours/days | The rules are applied to online booking |
| Business Owner | To set cancellation policy | I manage cancellations consistently | I am on Settings | I configure cancellation deadline (e.g., 24 hours before) | The policy is applied and displayed to customers |
| Business Owner | To enable or disable online booking | I can control public booking availability | I am on Settings | I toggle "Enable Online Booking" | The public booking page is activated or deactivated |
| Business Owner | To configure time zone | Bookings are scheduled in the correct timezone | I am on Settings | I select my timezone from a dropdown | All times are displayed in the selected timezone |
| Business Owner | To select the system language | The interface is in my preferred language | I am on Settings | I select a language (English, Indonesian) | The UI text updates to the selected language |
| Business Owner | To configure reminder settings | Customers receive booking reminders | I am on Settings | I enable email/SMS reminders and set timing | Reminders are sent according to configuration |
| Business Owner | To customize the public booking page | It reflects my brand | I am on Settings | I edit business description and upload logo | Changes appear on the public booking site |
| Administrator | To save settings changes | My configurations are persisted | I have made changes | I click "Save" | Settings are saved and a success message appears |

### Negative Test Cases

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To be prevented from saving invalid settings | System operates correctly | I am editing settings | I enter invalid data (e.g., negative lead time) | Validation errors are displayed |
| Business Owner | To be notified of save failures | I can retry or troubleshoot | A network error occurs | I attempt to save settings | An error message is displayed and changes are not lost |

---

## 10. Online Booking Setup Module

### Overview
This module configures the public-facing online booking page, including business profile, staff visibility, and service offerings.

### Features
- Public business profile configuration
- Business slug/URL customization
- Staff profile management for public display
- Service profile management for public display
- Display order configuration
- Booking page preview

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To configure a public business profile | Customers can find information about my business | I am on Online Booking Setup | I edit business description and contact info | The information appears on the public booking page |
| Business Owner | To set a custom URL slug | I have a memorable booking page URL | I am configuring the profile | I enter a slug (e.g., "mysalon") | The booking page is accessible at /book/mysalon |
| Business Owner | To upload a business logo | My brand is visible on the booking page | I am configuring the profile | I upload a logo image | The logo appears on the public booking page |
| Business Owner | To configure which staff are visible | Only certain staff appear on the booking page | Staff members exist | I edit staff public profiles | I toggle visibility for each staff member |
| Business Owner | To add staff bios and specialties | Customers can learn about staff | I am editing a staff public profile | I enter bio text and specialties | The information appears on the public booking page |
| Business Owner | To set staff display order | Staff appear in my preferred sequence | Multiple visible staff exist | I set display order numbers | Staff are sorted accordingly on the booking page |
| Business Owner | To configure which services are visible | Only bookable services appear online | Services exist | I edit service public profiles | I toggle visibility and online booking enabled |
| Business Owner | To add service descriptions and features | Customers understand service offerings | I am editing a service public profile | I enter detailed descriptions and feature lists | The information appears on the booking page |
| Business Owner | To upload service images | Services are visually appealing | I am editing a service profile | I upload an image | The image appears on the booking page |
| Business Owner | To set service display order | Services appear in my preferred sequence | Multiple visible services exist | I set display order numbers | Services are sorted accordingly on the booking page |
| Business Owner | To preview the public booking page | I can see how it looks before publishing | I am on Online Booking Setup | I click "Preview" | The public booking page opens in a new tab |
| Business Owner | To publish the booking page | Customers can start booking online | Configuration is complete | I enable the booking page | The page becomes publicly accessible |

### Negative Test Cases

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To be prevented from using an already-taken slug | URLs are unique | I am setting a slug | I enter a slug that's already in use | A validation error indicates the slug is taken |
| Business Owner | To be warned if no staff are visible | The booking page is functional | No staff have visibility enabled | I try to publish | A warning suggests enabling at least one staff member |
| Business Owner | To be warned if no services are visible | The booking page is functional | No services have online booking enabled | I try to publish | A warning suggests enabling at least one service |

---

## 11. Public Booking Page (Customer-Facing)

### Overview
The public booking page allows customers to self-schedule appointments without logging into the system.

### Features
- View business information
- Browse available services
- View staff profiles
- Check real-time availability
- Select date and time slots
- Enter customer information
- Confirm booking
- Receive booking confirmation

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Customer | To access the public booking page | I can book an appointment | I have the booking URL | I visit /book/[business-slug] | The booking page loads with business information |
| Customer | To view business information | I know I'm at the right place | I am on the booking page | The page loads | Business name, logo, description, and contact info are displayed |
| Customer | To view available services | I can choose what I need | Services are published | I view the booking page | A list of services with descriptions, prices, and durations is displayed |
| Customer | To select a service | I can proceed with booking | I am on the booking page | I click on a service | The service is selected and I'm prompted to choose staff |
| Customer | To view staff profiles | I can choose a provider | Staff are published | I view available staff | Staff profiles with photos, bios, and specialties are displayed |
| Customer | To select a staff member or choose "Any Available" | I can specify preferences | I have selected a service | I choose a staff member or "Any Available" | The selection is saved and I proceed to date selection |
| Customer | To view a calendar with available dates | I can see when appointments are possible | Availability slots exist | I view the date picker | Dates with availability are highlighted |
| Customer | To select a date | I can narrow down time options | I am viewing the calendar | I click on a date | Available time slots for that date are displayed |
| Customer | To view available time slots | I can choose a convenient time | Availability slots exist for the selected date | I view time slot options | Slots are displayed in 15-minute or appropriate intervals |
| Customer | To select a time slot | I can specify when I want the appointment | Available slots are displayed | I click on a time slot | The slot is selected |
| Customer | To enter my name | The business knows who I am | I have selected service, staff, date, and time | I fill in the customer information form | My name is captured |
| Customer | To enter my email | I can receive confirmation | I am filling customer info | I enter my email address | The email is validated and captured |
| Customer | To optionally enter my phone number | The business can contact me | I am filling customer info | I enter my phone number | The phone is captured |
| Customer | To add notes or special requests | I can communicate preferences | I am filling customer info | I enter notes in a text area | The notes are saved with the booking |
| Customer | To review my booking details | I can verify everything is correct | I have completed the form | I view a summary section | Service, staff, date, time, and my info are displayed |
| Customer | To confirm my booking | I can complete the reservation | I have reviewed details | I click "Confirm Booking" | The booking is submitted to the system |
| Customer | To receive a booking confirmation | I have proof of my appointment | My booking is confirmed | The submission succeeds | A confirmation page displays with booking reference and details |
| Customer | To receive a confirmation email | I can reference my booking later | My booking is confirmed | The email is sent | I receive an email with booking details and reference number |

### Negative Test Cases

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Customer | To be informed if no availability exists | I understand I need to try different options | No slots are available for my selections | I attempt to book | A message explains no availability and suggests alternatives |
| Customer | To see validation errors for incomplete information | I provide all necessary details | I am filling customer info | I submit without required fields | Validation errors highlight missing information |
| Customer | To be notified of booking conflicts | I can choose a different time | A slot becomes unavailable between my selection and submission | I submit the booking | An error message explains the conflict and asks me to choose again |
| Customer | To be shown an error page if the business doesn't exist | I know the URL is wrong | I visit an invalid business slug | The page loads | An error page explains the business wasn't found |
| Customer | To be informed if online booking is disabled | I understand I need to contact the business | Online booking is disabled | I visit the booking URL | A message explains online booking is unavailable with contact information |

---

## 12. Customer Engagement Module

### Overview
(Appears to be in development - placeholder for future features like loyalty programs, marketing campaigns, and customer communications)

### Planned Features
- Customer loyalty programs
- Marketing campaign management
- Automated customer communications
- Feedback and review collection
- Customer segmentation

---

## 13. Addons / Integrations Module

### Overview
The Addons module enables integration with third-party booking platforms for syncing customers, staff, services, and bookings.

### Features
- Integration configuration (API credentials)
- Sync customers from external platforms
- Sync staff from external platforms
- Sync services from external platforms
- Sync bookings (import external bookings)
- Sync logs and error tracking
- Supported integrations: Fresha, Treatwell, others

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To view available integrations | I know what platforms are supported | I am on the Addons page | The page loads | A grid displays available integration options |
| Business Owner | To enable an integration | I can connect to an external platform | I am on Addons | I click "Configure" on an integration | A configuration dialog opens |
| Business Owner | To enter API credentials | The integration can authenticate | I am configuring an integration | I enter API key and other credentials | The credentials are securely saved |
| Business Owner | To test the integration connection | I verify it's working | Credentials are entered | I click "Test Connection" | A success or error message is displayed |
| Business Owner | To sync customers from an integration | I import existing customer data | An integration is configured | I click "Sync Customers" | Customers are imported from the external platform |
| Business Owner | To sync staff from an integration | I import existing staff data | An integration is configured | I click "Sync Staff" | Staff members are imported |
| Business Owner | To sync services from an integration | I import service offerings | An integration is configured | I click "Sync Services" | Services are imported |
| Business Owner | To sync bookings from an integration | I see external bookings in my calendar | An integration is configured | I click "Sync Bookings" | External bookings are imported and displayed |
| Business Owner | To view sync logs | I can troubleshoot integration issues | Sync operations have occurred | I view sync logs | A log of sync operations with status and errors is displayed |
| Business Owner | To configure automatic sync schedules | Data stays up-to-date | An integration is configured | I set sync frequency (hourly, daily) | Automatic syncs occur on schedule |
| Business Owner | To disable an integration | I can disconnect from external platforms | An integration is enabled | I toggle it off | The integration is disabled and syncs stop |
| Administrator | To view external booking details | I can see source information | External bookings are imported | I view a booking | The source platform and external ID are shown |

### Negative Test Cases

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| Business Owner | To be notified of authentication failures | I can correct credentials | Invalid credentials are entered | I test the connection | An error message explains the authentication failed |
| Business Owner | To see detailed error logs | I can troubleshoot sync issues | A sync operation fails | I view sync logs | Error details are displayed with timestamps |
| Business Owner | To handle partial sync failures gracefully | Some data still imports | Some records fail during sync | The sync completes | Successful records are imported and failures are logged |
| Business Owner | To be prevented from saving without required credentials | Configuration is valid | I am configuring an integration | I try to save without all required fields | Validation errors are displayed |

---

## 14. Multi-Tenant Architecture

### Overview
The platform supports multiple independent businesses (tenants) with complete data isolation and separate user contexts.

### Features
- Tenant creation and management
- User-to-tenant associations
- Tenant context switching
- Data isolation via RLS policies
- Tenant-specific settings and configurations
- Tenant audit logging

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| New User | To create a new business account | I can start using the platform | I have signed up | I complete the tenant creation form | A new tenant is created and I'm assigned as owner |
| Business Owner | To select my active business | I can work with the correct data | I belong to multiple tenants | I select a tenant from the selector | The system switches to that tenant's context |
| Business Owner | To see only my tenant's data | Data is isolated | I am logged in | I view any page | Only data from my tenant is displayed |
| User | To be assigned to a tenant by an admin | I can access a business | A business owner invites me | The invitation is accepted | A user_tenant association is created |
| Administrator | To assign roles to users in my tenant | I can control access levels | I manage users | I assign a role (owner, admin, user) | The role is saved and permissions are applied |
| System | To enforce tenant isolation at the database level | Security is guaranteed | A user queries data | RLS policies are evaluated | Only data matching the user's tenant context is returned |
| System | To track tenant context | Multi-tenant access works correctly | A user is logged in | Actions are performed | The current tenant context is maintained and logged |
| System | To audit tenant operations | Compliance and security are maintained | Operations occur | Audit logs are created | Logs record user, tenant, action, and timestamp |

### Negative Test Cases

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| User | To be denied access to other tenants' data | Security is maintained | I attempt to access another tenant's data | RLS policies are evaluated | Access is denied and no data is returned |
| User | To be prevented from creating a tenant without required information | Data integrity is maintained | I am creating a tenant | I submit without business name | Validation errors are displayed |
| System | To handle tenant context expiration | Stale sessions are cleared | My tenant context expires | I attempt an action | I'm prompted to refresh or re-authenticate |

---

## 15. Authentication & Authorization

### Overview
The platform uses Supabase Auth for user authentication with role-based access control.

### Features
- Email/password authentication
- User registration
- Password reset
- Role-based permissions
- Session management
- Auth guards for protected routes

### User Stories & Acceptance Criteria

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| New User | To sign up with email and password | I can create an account | I am on the signup page | I enter email, password, and confirm | An account is created and I'm logged in |
| Returning User | To log in with my credentials | I can access my account | I have an account | I enter email and password | I'm authenticated and redirected to the dashboard |
| User | To log out | I can end my session securely | I am logged in | I click "Logout" | I'm logged out and redirected to the login page |
| User | To reset my password | I can recover access | I forgot my password | I request a password reset | I receive an email with a reset link |
| User | To change my password | I can update my credentials | I am logged in | I access account settings and change password | The new password is saved |
| System | To protect routes based on authentication | Only logged-in users access the app | A user is not authenticated | They try to access a protected route | They're redirected to the login page |
| System | To enforce role-based permissions | Users only access authorized features | A user has limited permissions | They try to access an admin feature | Access is denied or the feature is hidden |
| Administrator | To manage user roles | I can control access | I manage users | I assign or change roles | Permissions are updated accordingly |

### Negative Test Cases

| As A | I want | So that | Given | When | Then |
|------|--------|---------|-------|------|------|
| User | To be shown validation errors for invalid credentials | I know what's wrong | I attempt to log in | I enter incorrect email or password | An error message is displayed |
| User | To be prevented from signing up with an existing email | Accounts are unique | An account exists | I try to sign up with the same email | A validation error indicates the email is taken |
| User | To be prevented from accessing protected routes while logged out | Security is maintained | I am not authenticated | I try to directly access a protected URL | I'm redirected to login |
| System | To handle authentication failures gracefully | The system remains stable | A network error occurs during login | The login fails | An error message is displayed and the form remains filled |

---

## Non-Functional Requirements

### Performance
- Page load time < 2 seconds
- API response time < 500ms for 95% of requests
- Calendar rendering with 100+ bookings < 1 second
- Support 1000+ concurrent users per tenant

### Security
- HTTPS encryption for all traffic
- Row-Level Security (RLS) for all tenant data
- Password hashing with bcrypt
- API credential encryption
- CSRF protection
- Input validation and sanitization
- Regular security audits

### Scalability
- Horizontal scaling via Supabase infrastructure
- Database connection pooling
- Optimized queries with proper indexing
- Caching strategy for frequently accessed data

### Availability
- 99.9% uptime SLA
- Automated backups every 24 hours
- Point-in-time recovery capability
- Database replication for disaster recovery

### Usability
- Responsive design (mobile, tablet, desktop)
- Support for English and Indonesian languages
- Accessibility (WCAG 2.1 AA compliance)
- Intuitive navigation with < 3 clicks to any feature
- Inline help and tooltips

### Compatibility
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- iOS Safari, Android Chrome
- Minimum screen resolution: 320px width

### Maintainability
- Modular code architecture
- Comprehensive documentation
- Code comments for complex logic
- Automated testing suite
- Version control with Git

---

## Success Metrics

### Business Metrics
- Number of active tenants
- Monthly active users (MAU)
- Average bookings per tenant per month
- Customer retention rate (90-day)
- Net Promoter Score (NPS) > 50

### Technical Metrics
- Average API response time < 300ms
- Error rate < 0.5%
- Database query performance
- Uptime percentage
- Page load speed

### User Engagement
- Daily active users (DAU)
- Feature adoption rates
- Online booking conversion rate
- Average session duration
- User satisfaction score

---

## Future Roadmap

### Phase 2 (Q2 2025)
- Mobile app (iOS and Android)
- Advanced reporting and analytics
- Customer loyalty programs
- Marketing automation
- SMS notifications
- Payment processing integration

### Phase 3 (Q3 2025)
- AI-powered booking recommendations
- Inventory management
- Point of Sale (POS) integration
- Multi-location support
- Franchise management features

### Phase 4 (Q4 2025)
- API for third-party developers
- White-label solutions
- Advanced customization options
- Marketplace for plugins/extensions

---

## Appendix

### Glossary
- **Tenant**: An independent business entity using the platform
- **RLS**: Row-Level Security - database-level access control
- **Booking**: A scheduled appointment between a customer and staff member
- **Service**: A treatment or offering provided by the business
- **Commission**: Payment earned by staff for completed services
- **Roster**: Day-to-day staff work assignments
- **Schedule**: Recurring or one-time work hours for staff
- **Waitlist**: Queue of customers waiting for appointments

### Related Documents
- README2.md - Technical architecture and development guide
- testcases.md - Comprehensive test case documentation
- User Guide - End-user documentation

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2025 | AI Assistant | Initial PRD creation |

