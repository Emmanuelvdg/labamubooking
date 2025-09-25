# Test Cases - Booking Platform

## Overview
This document outlines the acceptance criteria for all modules within the booking platform. Each test case follows the Given-When-Then format to ensure comprehensive coverage of both positive and negative scenarios.

## Test Case Format
- **Module**: The system component being tested
- **Description**: Brief description of the test case
- **Given**: Initial conditions or setup
- **When**: The action or event that occurs
- **Then**: Expected outcome or result

---

## Authentication & Multi-Tenancy

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Authentication | Successful login with valid credentials | A user with valid email and password exists | User enters correct credentials and clicks login | User is authenticated and redirected to dashboard |
| Authentication | Failed login with invalid credentials | A user account exists | User enters incorrect email or password | Error message is displayed and user remains on login page |
| Authentication | Successful registration | Registration form is displayed | User enters valid details and submits | Account is created, user is logged in, and redirected to tenant creation |
| Authentication | Registration with existing email | An account with email already exists | User tries to register with the same email | Error message indicates email is already in use |
| Multi-Tenancy | Tenant context switching | User belongs to multiple tenants | User selects different tenant from dropdown | System switches context and displays selected tenant's data |
| Multi-Tenancy | Unauthorized tenant access | User does not belong to tenant X | User tries to access tenant X's data directly | Access is denied and user sees appropriate error |
| Authentication | Session expiry | User is logged in with active session | Session expires after timeout period | User is automatically logged out and redirected to login |
| Authentication | Password reset request | User exists in system | User requests password reset with valid email | Reset email is sent with instructions |

---

## Staff Management

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Staff Management | Create new staff member | User has staff creation permissions | User fills staff form with valid data and submits | New staff member is created and appears in staff list |
| Staff Management | Create staff with duplicate email | Staff member with email exists | User tries to create staff with existing email | Error message indicates email already in use |
| Staff Management | Edit existing staff member | Staff member exists | User updates staff information and saves | Staff information is updated successfully |
| Staff Management | Delete staff member | Staff member exists with no active bookings | User confirms staff deletion | Staff member is marked as inactive |
| Staff Management | Delete staff with active bookings | Staff member has future bookings | User attempts to delete staff | Warning message about active bookings is shown |
| Staff Management | Upload staff avatar | Staff member exists | User uploads valid image file | Avatar is uploaded and displayed |
| Staff Management | Upload invalid avatar format | Staff member exists | User uploads non-image file | Error message about invalid file format |
| Staff Management | Assign role to staff | Staff member and roles exist | User assigns role to staff member | Role is assigned and permissions are updated |
| Staff Management | Create staff role | User has role management permissions | User creates role with specific permissions | New role is created and available for assignment |

---

## Services Management

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Services | Create new service | User has service management permissions | User creates service with valid details | Service is created and appears in services list |
| Services | Create service with invalid duration | Service form is open | User enters negative or zero duration | Validation error prevents service creation |
| Services | Edit service pricing | Service exists | User updates service price and saves | Service price is updated across all references |
| Services | Delete service without bookings | Service exists with no bookings | User confirms service deletion | Service is deleted successfully |
| Services | Delete service with active bookings | Service has future bookings | User attempts to delete service | Warning about active bookings prevents deletion |
| Services | Create service category | Categories management is open | User creates new category with valid name | Category is created and available for services |
| Services | Assign service to category | Service and category exist | User assigns service to category | Service is categorized correctly |
| Services | Bulk import services | CSV file with valid service data | User uploads CSV file | Services are imported successfully |
| Services | Import invalid service data | CSV file with invalid data | User uploads malformed CSV | Import fails with detailed error messages |

---

## Customer Management

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Customers | Create new customer | User has customer management access | User creates customer with valid information | Customer is created and appears in customer list |
| Customers | Create customer with duplicate email | Customer with email exists | User tries to create customer with existing email | Error prevents duplicate customer creation |
| Customers | Edit customer information | Customer exists | User updates customer details and saves | Customer information is updated successfully |
| Customers | Delete customer without bookings | Customer exists with no booking history | User confirms customer deletion | Customer is deleted from system |
| Customers | Delete customer with booking history | Customer has past/future bookings | User attempts to delete customer | Warning prevents deletion or offers anonymization |
| Customers | Search customers by name | Multiple customers exist | User searches by partial name | Relevant customers are filtered and displayed |
| Customers | Search with no results | Customers exist but none match | User searches for non-existent customer | "No results found" message is displayed |
| Customers | Bulk import customers | CSV file with valid customer data | User uploads customer CSV | Customers are imported successfully |

---

## Internal Bookings Management

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Bookings | Create new booking | Customer, staff, and service exist | User creates booking with valid details | Booking is created and appears in calendar |
| Bookings | Create booking with conflict | Staff has existing booking at same time | User tries to create overlapping booking | Conflict warning prevents double booking |
| Bookings | Edit booking time | Booking exists | User changes booking time to available slot | Booking time is updated successfully |
| Bookings | Edit booking to conflicting time | Booking exists | User changes time to conflicting slot | Conflict error prevents the change |
| Bookings | Cancel booking | Confirmed booking exists | User cancels booking with reason | Booking status changes to cancelled |
| Bookings | Mark booking as completed | Booking is in progress or confirmed | User marks booking as completed | Status changes to completed, triggers commission |
| Bookings | Mark booking as no-show | Booking time has passed | User marks booking as no-show | Status changes to no-show |
| Bookings | Create recurring booking | Valid booking details provided | User creates booking with recurrence pattern | Multiple bookings are created according to pattern |
| Bookings | Delete booking | Booking exists | User confirms booking deletion | Booking is permanently removed from system |

---

## Online Bookings (Public Portal)

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Public Booking | Access booking portal | Business has public profile active | Customer visits booking URL | Public booking form is displayed |
| Public Booking | Select service and staff | Services and staff are available | Customer selects service and preferred staff | Available time slots are displayed |
| Public Booking | Select available time slot | Available slots exist for selection | Customer clicks on available time slot | Time slot is selected and highlighted |
| Public Booking | Complete booking form | Time slot selected | Customer fills contact details and submits | Booking is created and confirmation is shown |
| Public Booking | Submit booking with missing details | Booking form is open | Customer submits form with missing required fields | Validation errors highlight missing fields |
| Public Booking | Book unavailable slot | Slot becomes unavailable | Customer tries to book slot that's no longer available | Error message indicates slot is no longer available |
| Public Booking | Access booking with confirmation token | Booking exists with valid token | Customer uses confirmation link | Booking details are displayed with cancel option |
| Public Booking | Cancel booking via public link | Confirmed booking exists | Customer cancels via confirmation link | Booking is cancelled and confirmation is shown |
| Public Booking | Access expired booking link | Booking confirmation token expired | Customer uses old confirmation link | Error message about expired or invalid link |

---

## Availability & Scheduling

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Availability | Generate availability slots | Staff schedules and roster exist | System runs slot generation | Available time slots are created for booking |
| Availability | Automatic slot regeneration | Roster assignment is modified | System detects roster change | Availability slots are automatically updated |
| Availability | View calendar with bookings | Bookings exist for selected date range | User opens calendar view | All bookings are displayed in correct time slots |
| Availability | Filter calendar by staff | Multiple staff have bookings | User filters calendar by specific staff | Only selected staff's bookings are shown |
| Availability | Filter calendar by service | Multiple services have bookings | User filters calendar by specific service | Only bookings for selected service are shown |
| Availability | Create staff schedule | Staff member exists | User creates recurring schedule for staff | Schedule is saved and generates availability |
| Availability | Edit recurring schedule | Recurring schedule exists | User modifies schedule pattern | Changes apply to future instances only |
| Availability | Add schedule exception | Recurring schedule exists | User adds one-time exception | Exception overrides regular schedule for that date |

---

## Roster Management

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Roster | Create roster assignment | Staff member exists | User creates roster assignment with valid times | Assignment is created and appears in roster view |
| Roster | Create conflicting assignment | Staff has existing assignment | User tries to create overlapping assignment | Conflict warning prevents creation |
| Roster | Edit roster assignment | Assignment exists | User modifies assignment times | Assignment is updated successfully |
| Roster | Delete roster assignment | Assignment exists with no dependencies | User confirms assignment deletion | Assignment is removed from roster |
| Roster | Generate from template | Roster template exists | User applies template to date range | Multiple assignments are created from template |
| Roster | Create roster template | User has template permissions | User creates template with assignment patterns | Template is saved for future use |
| Roster | View roster conflicts | Conflicting assignments exist | User opens roster management | Conflicts are highlighted with resolution options |
| Roster | Resolve roster conflict | Conflict exists | User selects conflict resolution option | Conflict is resolved and assignments are adjusted |

---

## Waitlist Management

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Waitlist | Add customer to waitlist | No available slots for desired time | Customer requests to join waitlist | Customer is added to waitlist queue |
| Waitlist | Automatic queue position assignment | Waitlist entries exist | New customer joins waitlist | Customer gets next available position number |
| Waitlist | Convert waitlist to booking | Slot becomes available | Staff converts waitlist entry to booking | Entry is removed from waitlist, booking is created |
| Waitlist | Notify waitlist customer | Available slot matches waitlist criteria | System detects matching availability | Notification is sent to customer |
| Waitlist | Remove customer from waitlist | Customer is in waitlist | Customer or staff removes from waitlist | Entry is removed and queue positions are updated |
| Waitlist | View waitlist queue | Waitlist entries exist | User opens waitlist management | Entries are displayed in correct queue order |
| Waitlist | Priority waitlist positioning | VIP customer joins waitlist | System applies priority rules | Customer gets higher queue position |

---

## Commission Management

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Commissions | Create commission scheme | Staff member exists | User creates commission scheme with rate | Scheme is saved and ready for application |
| Commissions | Automatic commission calculation | Commission scheme exists for staff/service | Booking is marked as completed | Commission record is automatically created |
| Commissions | View commission reports | Commission records exist | User opens commission reports | Commission data is displayed with totals |
| Commissions | Edit commission scheme | Scheme exists | User modifies commission rate | Changes apply to future bookings only |
| Commissions | Delete commission scheme | Scheme exists with no dependencies | User confirms scheme deletion | Scheme is deleted and won't apply to new bookings |
| Commissions | Percentage-based commission | Percentage scheme exists | Booking completion triggers calculation | Commission amount equals percentage of service price |
| Commissions | Fixed amount commission | Fixed amount scheme exists | Booking completion triggers calculation | Commission equals fixed amount regardless of price |
| Commissions | Service-specific commission | Service-specific scheme exists | Booking for that service is completed | Service-specific rate is applied instead of general rate |

---

## Integration & Add-ons

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Integrations | Configure calendar sync | Integration settings are accessible | User enables calendar integration with credentials | External calendar sync is activated |
| Integrations | Sync external bookings | Calendar integration is active | System performs sync operation | External bookings appear in system |
| Integrations | Handle sync conflicts | Conflicting external booking exists | Sync process detects conflict | Conflict is flagged for manual resolution |
| Integrations | Disable integration | Active integration exists | User disables integration | Sync stops, existing synced data remains |
| Integrations | Invalid API credentials | Integration form is open | User enters invalid API credentials | Connection test fails with error message |
| Integrations | Successful API connection test | Integration form is open | User enters valid API credentials | Connection test passes with success message |
| Integrations | View sync logs | Integration has run sync operations | User opens integration logs | Sync history and status are displayed |
| Integrations | Failed sync operation | Integration encounters error | Sync operation fails | Error is logged and admin is notified |

---

## Settings & Configuration

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Settings | Update business information | Business profile exists | User updates business details | Information is saved and reflected across system |
| Settings | Configure booking rules | Booking settings are accessible | User sets advance booking limits | Rules are applied to all new bookings |
| Settings | Enable online booking | Public booking is disabled | User enables online booking feature | Public booking portal becomes accessible |
| Settings | Configure notification settings | Notification settings exist | User enables/disables email notifications | Settings are saved and applied to future events |
| Settings | Update booking policy | Cancellation policy exists | User modifies cancellation policy | New policy is displayed in public booking |
| Settings | Set business hours | Business hours configuration is open | User sets operating hours | Hours are used for availability calculations |
| Settings | Configure reminder settings | Reminder system is available | User sets reminder timing and content | Reminders are sent according to configuration |
| Settings | Invalid configuration values | Settings form is open | User enters invalid values (negative numbers, etc.) | Validation prevents saving invalid configuration |

---

## Security & Access Control

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Security | Row Level Security enforcement | User belongs to Tenant A | User tries to access Tenant B data | Access is denied, no data is returned |
| Security | Permission-based access | User lacks specific permission | User tries to perform restricted action | Action is blocked with permission error |
| Security | Public booking data isolation | Multiple tenants have public bookings | Public user accesses booking portal | Only relevant tenant's data is accessible |
| Security | Staff role permissions | Staff member has limited role | Staff user attempts admin action | Action is prevented based on role restrictions |
| Security | Session security | User session exists | User is inactive for extended period | Session expires and user must re-authenticate |
| Security | API endpoint protection | Unauthenticated request | External system tries to access protected endpoint | Request is rejected with authentication error |
| Security | Data validation | Booking form is submitted | User submits form with malicious input | Input is sanitized and validated before processing |

---

## Performance & Reliability

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Performance | Availability slot generation | Large dataset of schedules exists | System generates availability slots | Process completes within acceptable time limits |
| Performance | Calendar loading | Month view with many bookings | User opens calendar for busy month | Calendar loads within 3 seconds |
| Performance | Search functionality | Large customer database exists | User performs customer search | Results are returned within 2 seconds |
| Performance | Concurrent booking attempts | Multiple users book same slot simultaneously | Two users submit booking at same time | Only one booking succeeds, other gets conflict error |
| Reliability | Database connection failure | System is running normally | Database becomes temporarily unavailable | Graceful error handling, user sees friendly message |
| Reliability | Email service failure | Booking confirmation should be sent | Email service is down | Booking still succeeds, email retry is scheduled |
| Performance | Large file upload | Staff avatar upload form is open | User uploads very large image file | System handles upload gracefully or shows size limit error |

---

## Edge Cases & Error Handling

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Edge Cases | Timezone handling | User is in different timezone | User creates booking | Times are correctly converted and stored in UTC |
| Edge Cases | Daylight saving transition | Booking spans DST transition | System processes time change | Booking times are adjusted appropriately |
| Edge Cases | Leap year booking | Recurring booking includes Feb 29 | System processes leap year date | Booking is created correctly for leap year |
| Edge Cases | Very long customer name | Customer has unusually long name | System stores customer information | Name is stored completely or truncated gracefully |
| Error Handling | Network timeout | User submits form | Network request times out | User sees timeout error with retry option |
| Error Handling | Unexpected system error | Normal operation is expected | Unhandled exception occurs | Error is logged, user sees generic error message |
| Error Handling | Invalid date input | Date field is available | User enters invalid date format | Validation error guides user to correct format |
| Edge Cases | Booking at midnight | Staff works past midnight | User books service crossing midnight | Booking spans correct dates and times |

---

## Mobile & Responsive Design

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Mobile | Public booking on mobile | Customer uses mobile device | Customer accesses booking portal | Interface is responsive and fully functional |
| Mobile | Touch interactions | User is on touch device | User interacts with calendar/time slots | Touch gestures work appropriately |
| Mobile | Form input on mobile | User fills booking form on mobile | User enters information using mobile keyboard | Form is usable and validates correctly |
| Mobile | Navigation on small screens | User accesses admin portal on mobile | User navigates through different sections | Navigation is accessible and functional |
| Responsive | Calendar view adaptation | Calendar is displayed | Screen size changes or is small | Calendar adapts layout while maintaining functionality |
| Responsive | Table responsiveness | Data tables are displayed | Screen width is limited | Tables scroll horizontally or stack appropriately |

---

## Data Integrity & Consistency

| Module | Description | Given | When | Then |
|--------|-------------|-------|------|------|
| Data Integrity | Booking reference uniqueness | Multiple bookings exist | New booking is created | Booking reference is guaranteed to be unique |
| Data Integrity | Commission calculation accuracy | Booking with commission scheme exists | Booking is completed | Commission amount is calculated correctly |
| Data Integrity | Availability slot consistency | Roster changes are made | Availability slots are regenerated | Slots accurately reflect current staff schedules |
| Data Integrity | Queue position consistency | Waitlist entry is removed | Queue positions are updated | All remaining entries have correct sequential positions |
| Consistency | Cross-module data sync | Staff member information is updated | Staff data is referenced in bookings | All references show updated information |
| Consistency | Audit trail completeness | Any data modification occurs | System logs the change | Audit log contains complete change information |

---

## Testing Guidelines

### Positive Test Cases
- Test the happy path for each major workflow
- Verify all required functionality works as designed
- Confirm proper data validation and storage
- Test user interface responsiveness and usability

### Negative Test Cases
- Test invalid input handling and validation
- Verify proper error messages are displayed
- Test boundary conditions and edge cases
- Confirm unauthorized access is properly blocked

### Performance Test Cases  
- Test with realistic data volumes
- Verify response times meet requirements
- Test concurrent user scenarios
- Monitor resource usage during peak operations

### Security Test Cases
- Verify authentication and authorization
- Test input sanitization and SQL injection protection
- Confirm data isolation between tenants
- Test session management and timeout handling

## Test Data Requirements

For comprehensive testing, ensure the following test data is available:
- Multiple tenant accounts with different configurations
- Staff members with various roles and permissions
- Services across different categories and price ranges
- Customers with diverse profile information
- Bookings in various states (pending, confirmed, completed, cancelled)
- Historical data for reporting and analytics testing
- Integration test accounts for external services

## Automation Recommendations

Priority areas for test automation:
1. Authentication and session management
2. Booking creation and modification workflows
3. Availability slot generation and updates
4. Commission calculation accuracy
5. Data validation and error handling
6. Multi-tenant data isolation
7. Public booking portal functionality
8. Performance benchmarks for critical operations