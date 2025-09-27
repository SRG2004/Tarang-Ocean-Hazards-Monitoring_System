> **Note:** To view this diagram, use a Markdown previewer with Mermaid support, like the 'Markdown Preview Mermaid Support' extension in VS Code.

# System Architecture: Tarang Monitoring System

```mermaid
graph TD
    subgraph "User Clients"
        direction LR
        WebApp["Web Application (React)"]
        MobileApp["Mobile Application (Capacitor)"]
    end

    subgraph "API Gateway & Backend"
        direction TB
        APIServer["API Server (Node.js/Express)"]
        Auth["Authentication Service (Firebase Auth)"]
    end

    subgraph "Serverless & Asynchronous Processing"
        direction TB
        Functions["Cloud Functions (for background tasks)"]
        NLP["NLP Service (for text analysis)"]
    end

    subgraph "Data & Storage Layer"
        direction LR
        FirestoreDB[   "Real-time Database"   ]    
        Storage["File & Media Storage"]
    end
    
    subgraph "External Services"
        direction LR
        MapsAPI["Geolocation & Maps API"]
        SocialMediaAPI["Social Media Ingestion API"]
    end

    %% Connections
    WebApp & MobileApp -- "HTTPS/WSS" --> APIServer
    WebApp & MobileApp -- "Auth Tokens" --> Auth
    WebApp & MobileApp -- "Render Maps" --> MapsAPI

    APIServer -- "CRUD Operations" --> FirestoreDB
    APIServer -- "File URLs" --> Storage

    Functions -- "Triggered by Events" --> FirestoreDB
    Functions -- "Process Text" --> NLP
    Functions -- "Ingest Data" --> SocialMediaAPI

    FirestoreDB -- "Real-time Sync" --> WebApp & MobileApp
```
