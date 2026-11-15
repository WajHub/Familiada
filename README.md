# Familiada

## Installation & Setup

1. Install **Node.js** and **npm**.

2. Go to the `app` directory and install dependencies:

   ```bash
   cd app
   npm install
   ```

3. Run database migrations (required to create the local SQLite database schema):

   ```bash
   npx sequelize db:migrate
   ```

4. Start the application in development mode (requires two terminals):

   - **Terminal 1: Webpack Dev Server**
     ```bash
     npm start
     ```

   - **Terminal 2: Electron runtime**
     ```bash
     npm run electron
     ```

5. Build for Production:

   ```bash
   npm run make
   ```

   The packaged app will be available in the `app/out/` directory.

## Technologies

- Electron
- Sequelize
- SQLite
- React
- Tailwind CSS
- Lucide Icons
