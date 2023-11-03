# Leave Management System

This is a [Next.js](https://nextjs.org/) project that provides a comprehensive leave management system for organizations. It is designed to streamline the process of applying for and approving leave requests within a company.

## Features

- **Leave Application**: Employees can apply for leave directly to their assigned supervisor.
- **Leave Approval**: Supervisors can approve or reject leave applications, with updates being reflected in real-time.
- **Leave Planner**: A calendar view that allows employees to plan their leave based on the availability and leave requests of their colleagues within the same division.
- **Division Management**: Admins can create and manage divisions within the organization.
- **Leave Type Management**: Admins can define and manage different types of leave.
- **Employee Management**: Admins can add new employees, assign supervisors, and manage employee details.

## Built With

- **Next.js 13**: The core framework that powers the application, providing both server-side and client-side functionality.
- **React Server Components**: Leveraged for improved performance and seamless data fetching.
- **Tailwind CSS**: Utilized for styling, ensuring a responsive and modern user interface.
- **ShadcnUI**: A React component library used for crafting the user interface components.

## Application Structure

The application's routes are organized into admin-specific and common routes:

- Admin routes allow for the management of divisions, leave types, and employees.
- Common routes include dashboards, leave applications, leave history, and leave planning.

## Database Schemas

- `DepartmentSchema`: Defines the departments within the organization.
- `EmployeeSchema`: Stores employee information and their relationships within the company, such as direct supervisors.
- `LeaveSchema`: Records details about leave applications, including type, duration, and status.
- `LeaveBalanceSchema`: Keeps track of the leave balance for each employee.
- `LeaveTypeSchema`: Outlines the various types of leaves that are available.

## Getting Started

### Prerequisites

Before running the project, ensure that you have the following environment variables set up:

\```env
MONGODB_URL=
APP_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=
SMTP_SECURE=false
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
\```

### Installation

\```sh
git clone [your-repo-link]
cd [your-repo-directory]
npm install

# or

yarn install

# or

pnpm install

# or

bun install
\```

Then run the development server:

\```sh
npm run dev

# or

yarn dev

# or

pnpm dev

# or

bun dev
\```

Open `http://localhost:3000` with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
