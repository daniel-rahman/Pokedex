# Pokémon App - Build, Run & Packaging Instructions


## Notes and Observations

During the initial development phase, it was observed that the Pokémon list contained duplicate values in the number field, which serves as the ID for the list items. To address potential conflicts and ensure uniqueness across all entries, an additional field uuid was introduced. This unique identifier guarantees that each Pokémon entry can be distinctly referenced, even if the number value is duplicated.

## Prerequisites

Before running the project, make sure you have installed:

* **Python3** version 3 or higher
* **pip3** for installing Python packages
* **Git** (optional, for downloading the code)

---

## Client Side (React + TypeScript + Vite)

1. Navigate to the Frontend project folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   This project uses the following libraries:

   * `axios` ^1.11.0
   * `react` ^19.1.1
   * `react-dom` ^19.1.1
   * `react-router-dom` ^7.8.0

3. Run the development server:

   ```bash
   npm run dev
   ```

   By default, Vite runs on **port 5173** and communicates with the Backend on **port 8080**.

---

## Server Side (Python + Flask)

1. Navigate to the Backend project folder:

   ```bash
   cd backend
   ```

2. Install required Python packages:

   ```bash
   pip3 install flask flask-cors
   ```

3. Start the server:

   ```bash
   python3 app.py
   ```

   The server will run on **port 8080** and handle requests from the client.

---

## Running the Full Application

1. In the first terminal, start the Backend (Flask).
2. In the second terminal, start the Frontend (`npm run dev`).
3. Open the application in your browser:

   ```
   http://localhost:5173
   ```

---

