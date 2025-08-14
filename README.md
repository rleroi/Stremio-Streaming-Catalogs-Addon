# Stremio Streaming Catalogs Addon

![image](https://user-images.githubusercontent.com/6817390/216839228-f0d09dfd-e76b-4d23-bf4f-cab09febd1ef.png)

A Stremio addon that provides streaming catalogs from various popular streaming services including Netflix, Disney+, HBO Max, Prime Video, Apple TV+, and many more. This addon allows users to browse and discover content from multiple streaming platforms directly within Stremio.

## Features

- **Multiple Streaming Services**: Support for 20+ streaming platforms
- **Country-based Filtering**: Filter providers by country/region
- **Web Interface**: Modern Vue.js web interface for configuration
- **Real-time Catalogs**: Live streaming catalogs from various services
- **Easy Installation**: Simple addon installation process

## Supported Streaming Services

- Netflix & Netflix Kids
- Disney+
- HBO Max
- Prime Video
- Apple TV+
- Paramount+
- Peacock Premium
- Hulu
- Curiosity Stream
- MagellanTV
- Crunchyroll
- Hayu
- Clarovideo
- Globoplay
- And many more...

## Local Development Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rleroi/Stremio-Streaming-Catalogs-Addon.git
   cd Stremio-Streaming-Catalogs-Addon
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd vue
   npm install
   cd ..
   ```

### Running Locally

#### Option 1: Development Mode (Recommended)

1. **Start the backend server**
   ```bash
   npm run dev
   ```
   This will start the backend server with nodemon for auto-reloading on changes.

2. **In a new terminal, start the frontend development server**
   ```bash
   cd vue
   npm run dev
   ```
   This will start the Vue development server (typically on http://localhost:5173).

3. **Build the frontend for production**
   ```bash
   cd vue
   npm run build
   cd ..
   ```
   This creates the `vue/dist` folder that the backend serves.

#### Option 2: Production Mode

1. **Build the frontend**
   ```bash
   cd vue
   npm run build
   cd ..
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

### Accessing the Application

- **Backend API**: http://localhost:7700
- **Frontend (dev)**: http://localhost:5173 (when running `npm run dev` in vue folder)
- **Production**: http://localhost:7700 (serves the built frontend)

### Environment Variables

The project uses environment variables for configuration. You'll need to set up the following:

#### Backend Environment Variables (Optional)

Create a `.env` file in the root directory for backend configuration:

```env
# Optional: Mixpanel analytics key for tracking
MIXPANEL_KEY=your_mixpanel_key_here

# Optional: Port for the server (default: 7700)
PORT=7700

# Optional: Refresh interval for catalogs in milliseconds (default: 21600000 = 6 hours)
REFRESH_INTERVAL=21600000

# Optional: Set to 'production' for production mode
NODE_ENV=development
```

#### Frontend Environment Variables

The project includes pre-configured environment files in the `vue` directory:

- `vue/.env.development` - Development configuration (points to localhost:7700)
- `vue/.env` - Production configuration

**Note**: The `VITE_APP_URL` is used by the frontend to generate the correct addon installation URL. The included files are already configured for both development and production environments.

### Troubleshooting

#### Server Crashes on Startup

If the backend server crashes during startup (especially during `loadNewCatalog()`), this is likely due to:

1. **Network connectivity issues** - The addon fetches catalogs from external APIs
2. **Rate limiting** - Some APIs may have rate limits
3. **API changes** - External APIs may have changed their endpoints

**Solutions:**
- Check your internet connection
- Wait a few minutes and try again (rate limiting)
- The server will automatically restart with nodemon when you make changes
- For development, you can comment out some of the catalog loading calls in `index.js` to reduce API calls

#### Environment File Issues

- The project includes pre-configured environment files
- If you need to modify the configuration, edit the existing `.env` files
- Restart the servers after changing environment variables

### Development Scripts

#### Backend (Root Directory)
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

#### Frontend (vue Directory)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
Stremio-Streaming-Catalogs-Addon/
├── index.js              # Main Express server
├── addon.js              # Stremio addon logic
├── package.json          # Backend dependencies
├── vue/                  # Frontend Vue.js application
│   ├── src/
│   │   ├── App.vue       # Main Vue component
│   │   ├── components/   # Vue components
│   │   └── main.js       # Vue app entry point
│   ├── public/           # Static assets
│   ├── dist/             # Built frontend (generated)
│   └── package.json      # Frontend dependencies
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

- **Discord**: [Join our Discord server](https://discord.gg/uggmYJ7jVX)
- **Ko-fi**: [Support the project](https://ko-fi.com/rab1t)
