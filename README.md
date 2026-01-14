# Story Arc - Your Personal Library Companion

Story Arc is a modern book tracking application that empowers readers to catalog their journeys, set reading goals, and discover their next favorite story. With a sleek dark-themed UI and powerful features, it's designed for book lovers who want a premium digital library experience.

## Table of Contents

- [Key Features](#key-features)
- [Technology Used](#technology-used)
- [Run it Locally](#run-it-locally)
- [Live URL](#live-url)
- [Project Dependencies](#project-dependencies)
- [Connect With Me](#connect-with-me)

## Key Features

- **User Authentication**: Secure login and registration using NextAuth (Google & Credentials).
- **Personal Library**: Organize books into "Reading", "Completed", and "Wishlist" shelves.
- **Reading Challenges**: Set yearly reading goals and track progress with visual charts.
- **Admin Dashboard**: Comprehensive admin panel for managing books, users, and moderating reviews.
- **Review Moderation**: Robust system for submitting, approving, and verifying user reviews.
- **Dark Mode UI**: A premium, eye-friendly dark interface built with Tailwind CSS and Shadcn UI.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.
- **Interactive Charts**: Visualize reading stats and genre distribution using Recharts.
- **Image Optimization**: High-performance image serving with Cloudinary and Next.js Image.

## Technology Used

- **Frontend**: React.js, Next.js 16
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Run it Locally

Please follow the below instructions to run this project in your machine:

1. Clone this repository

   ```sh
   git clone git clone https://github.com/sagormajomder/story-arc.git
   ```

2. Open the directory "game-matrix" into visual studio code
3. Open Terminal and run `npm i` to install all dependencies
4. Set up environment variables:

   Create a .env.local file in the root directory and add the following environment variables:

   ```
      // Example .env file
      NEXT_PUBLIC_IMGBB_HOST_KEY=<get from imgbb>
      NEXTAUTH_URL=http://localhost:3000
      NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
      NEXTAUTH_SECRET=<your-secret>
      GOOGLE_CLIENT_ID=<your-google-id>
      GOOGLE_CLIENT_SECRET=<your-google-secret>
      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<get your preset from cloudinary>
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   ```

5. Run `npm run dev` to run the project into browser.

   The project will be available on http://localhost:3000/ by default.

6. goto **[story arc backend repository](https://github.com/sagormajomder/story-arc-backend)** for run the backend

## Live URL

#### 🚀 Live Project URL: https://story-arc-sm.vercel.app/

## Project Dependencies

#### Dependencies List

```
  "dependencies": {
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.13",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.562.0",
    "next": "16.1.1",
    "next-auth": "^4.24.13",
    "next-cloudinary": "^6.17.5",
    "next-themes": "^0.4.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-hook-form": "^7.71.0",
    "react-hot-toast": "^2.6.0",
    "react-icons": "^5.5.0",
    "recharts": "^3.6.0",
    "tailwind-merge": "^3.4.0"
  }
```

#### Dev Dependencies List

```
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "16.1.1",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.4.0"
  }
```

## Connect with Me

✨ Let's connect on different platforms! Feel free to reach out.

🐦 **Twitter:** [@sagormajomder](https://twitter.com/sagormajomder)

🐙 **GitHub:** [@sagormajomder](https://github.com/sagormajomder)

📘 **Facebook:** [@sagormajomder](https://facebook.com/sagormajomder)

🔗 **LinkedIn:** [@sagormajomder](https://www.linkedin.com/in/sagormajomder/)
