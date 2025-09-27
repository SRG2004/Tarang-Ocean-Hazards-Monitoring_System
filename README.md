# Taranga - Ocean Hazards Monitoring System

Welcome to Taranga, a web application for monitoring and reporting ocean-related hazards. This system allows users to view real-time data, submit hazard reports, and stay informed about the safety of our oceans.

## Features

*   **Interactive Map:** View hazard reports and other data on a live map.
*   **Hazard Reporting:** Submit detailed reports of ocean hazards, including location, type, severity, and photos/videos.
*   **Real-time Alerts:** (Future) Receive real-time alerts for your area of interest.
*   **Data Visualization:** (Future) View trends and statistics about ocean hazards.

## Getting Started

To run this project locally, you will need to have Node.js and npm installed. 

### 1. Clone the Repository

```bash
git clone https://github.com/SRG2004/Taraga-Ocean-Hazards-Monitoring_System.git
cd Taraga-Ocean-Hazards-Monitoring_System
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

This project uses environment variables to securely manage API keys and other secrets. You will need to create a `.env` file in the root of the project.

1.  **Copy the example file:**

    ```bash
    cp .env.example .env
    ```

2.  **Add your secret keys:**

    Open the newly created `.env` file and replace the placeholder values with your actual API keys from Firebase, Twitter, etc.

### 4. Run the Development Server

```bash
npm run dev
```

This will start the Vite development server, and you can view the application in your browser at the URL provided (usually `http://localhost:5173`). The server will automatically reload as you make changes to the code.

## Contributing

Contributions are welcome! If you have a feature request, bug report, or want to contribute to the code, please feel free to open an issue or submit a pull request.
