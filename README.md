# Vibex

A modern React-based notice board application built with Vite, featuring real-time updates through Supabase. Create, filter, and manage notices with an intuitive user interface.

## Features

- ✨ **Real-time Updates** - Automatic synchronization with Supabase database
- 🔍 **Advanced Filtering** - Filter notices by category
- 🔎 **Search Functionality** - Quickly find notices by keyword
- ➕ **Create Notices** - Add new notices with title, content, category, and author
- 👁️ **Detail View** - View complete notice information in a modal
- 📱 **Responsive Design** - Works seamlessly on different screen sizes
- ⚡ **Fast Development** - Hot Module Replacement (HMR) with Vite

## Tech Stack

- **React** 19.2.0 - UI library
- **Vite** 7.2.4 - Build tool and dev server
- **Supabase** 2.95.3 - Backend and real-time database
- **ESLint** 9.39.1 - Code quality and linting
- **CSS3** - Styling

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vibex-neww
```

2. Install dependencies:
```bash
npm install
```

3. Configure Supabase credentials in [src/App.jsx](src/App.jsx):
   - Replace `supabaseUrl` with your Supabase project URL
   - Replace `supabaseKey` with your Supabase anon key

### Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173` with hot module replacement enabled.

### Building for Production

Build the project for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Create optimized production build
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Project Structure

```
vibex-neww/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # React entry point
│   └── assets/          # Static assets
├── public/              # Public static files
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── eslint.config.js     # ESLint configuration
└── package.json         # Project dependencies and scripts
```

## Usage

### Creating a Notice

1. Click the "New Notice" button
2. Fill in the notice form:
   - **Title** - Brief title for the notice
   - **Content** - Detailed message
   - **Category** - Select from available categories
   - **Author** - Author name (default: Alex Rivera)
3. Click "Post Notice" to save

### Filtering and Searching

- Use the **Category Filter** dropdown to filter by category
- Use the **Search Box** to find notices by title or content
- View notice details by clicking on any notice in the list

## Database Setup (Supabase)

The application expects a `notices` table with the following columns:
- `id` - UUID primary key
- `title` - Text
- `content` - Text
- `category` - Text
- `author_name` - Text
- `created_at` - Timestamp
- `updated_at` - Timestamp

## ESLint Configuration

This project uses ESLint for code quality with React-specific rules. Run the linter:
```bash
npm run lint
```

## License

This project is open source and available for use.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests to improve the project.
