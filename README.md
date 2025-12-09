# Gamebridge Admin Panel

A React-based admin panel for managing courses, modules, videos, and content for the Gamebridge Flutter learning platform.

## Features

- Course Management (CRUD operations)
- Module Management with video uploads
- Question/Quiz Management
- Markdown Editor for module descriptions
- File Upload (Images & Videos)
- Dark Mode Support
- Responsive Design

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Running on Mobile Device

To access the admin panel from your phone on the same network:

1. **Find your computer's IP address:**
   - **Windows**: Open Command Prompt and run `ipconfig`, look for "IPv4 Address"
   - **Mac/Linux**: Open Terminal and run `ifconfig` or `ip addr`, look for your local IP (usually starts with 192.168.x.x or 10.x.x.x)

2. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The server is already configured to accept network connections.

3. **Access from your phone:**
   - Make sure your phone is on the same Wi-Fi network as your computer
   - Open your phone's browser and go to: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

4. **Alternative method (if the above doesn't work):**
   ```bash
   npm run dev:network
   ```

**Note:** Make sure your firewall allows connections on port 3000, and both devices are on the same network.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/services` - API and file services
- `/src/hooks` - Custom React hooks
- `/src/utils` - Utility functions and constants
- `/src/styles` - Global styles and theme

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router
- React Query
- Zustand
- React Markdown
- React Dropzone

