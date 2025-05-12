# Virtual Wardrobe & Outfit Generator

A web application that helps users manage their wardrobe and generate outfit suggestions using AI.

## Features

- Upload and manage clothing items
- View your virtual wardrobe
- Generate outfit suggestions based on your existing clothes
- Categorize items by type, color, and season

## Tech Stack

- Frontend: React, TypeScript, Material-UI
- Backend: Node.js, Express, TypeScript
- Database: MongoDB
- File Storage: Local file system

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/virtual-wardrobe
```

4. Start the development servers:

```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Upload your clothing items by clicking the "Upload" button
2. Fill in the details for each item (name, type, color, season)
3. View your wardrobe on the home page
4. Click "Generate Outfit" to get AI-powered outfit suggestions

## Project Structure

```
virtual-wardrobe/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   └── App.tsx            # Main App component
├── server/                # Backend source code
│   ├── src/              # Server source code
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   └── index.ts      # Server entry point
│   └── .env              # Environment variables
└── README.md             # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 