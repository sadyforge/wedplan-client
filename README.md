# WedPlan – Wedding Planning & Service Management Platform

WedPlan is a wedding planning platform where customers can discover and book wedding services, vendors can manage their services and bookings, and administrators can manage users, services, and platform activities.

## Features

- **Authentication & Authorization:** Secure authentication with role-based access for Customers, Vendors, and Admins.
- **Service Management:** Vendors can create, update, delete, and manage their wedding services.
- **Service Approval:** Admins can review, approve, or reject vendor services.
- **Booking System:** Customers can book wedding services and manage their bookings.
- **Vendor Dashboard:** Vendors can manage their services, bookings, and subscription status.
- **Premium Subscription:** Vendors can upgrade to Premium using Stripe payments.
- **Service Limit:** Free vendors can add up to 3 services, while Premium vendors can add unlimited services.
- **Payment Management:** Stripe Checkout, payment verification, webhook integration, and transaction history.
- **Admin Dashboard:** Admins can manage users, update user roles, block or unblock accounts, and manage services.
- **Responsive Design:** User-friendly interface for desktop, tablet, and mobile devices.
- **Loading & Error Handling:** Meaningful loading states, error handling, and toast notifications.

## User Roles

| Role | Permissions |
|---|---|
| Customer | Browse services, book services, manage bookings |
| Vendor | Manage services, manage bookings, upgrade subscription |
| Admin | Manage users, roles, services, approvals, and transactions |

## Premium Subscription

WedPlan provides a subscription system for vendors.

- Free vendors can add a maximum of 3 services.
- Premium vendors can add unlimited services.
- Vendors can upgrade through Stripe Checkout.
- Payment status is verified through the backend.
- Stripe webhooks handle payment events and subscription updates.

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB

### Authentication & Payment
- Better Auth
- JWT
- Stripe

### Tools
- Git & GitHub
- Postman
- npm / pnpm

## Project Structure

```text
WedPlan/
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── services/
│   └── package.json
│
├── server/
│   ├── index.js
│   ├── middleware/
│   ├── routes/
│   └── package.json
│
└── README.md
```



## Payment Integration

WedPlan uses Stripe Checkout to process Premium subscription payments.

1. Vendor selects the Premium subscription.
2. Backend creates a Stripe Checkout session.
3. Vendor completes payment through Stripe.
4. Stripe sends payment events through a webhook.
5. Backend verifies the payment and updates subscription status.
6. Vendor receives Premium access after successful verification.

## Future Improvements

- Advanced service filtering and searching.
- Improved booking management.
- Enhanced dashboard analytics.
- Email notifications.
- More subscription management options.

## License

This project is developed for educational and portfolio purposes.