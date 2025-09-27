> **Note:** This document contains diagrams created using the [Mermaid](https://mermaid-js.github.io/mermaid/#/) syntax. To view them, please use a Markdown previewer with Mermaid support. For Visual Studio Code, it is recommended to install the [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) extension.

# Project Overview: Tarang Ocean Hazards Monitoring System

This document provides a comprehensive overview of the Tarang Ocean Hazards Monitoring System, including its architecture, technology stack, data flow, and key workflows.

## 1. System Architecture

The system is designed as a scalable, real-time platform that leverages modern cloud technologies to provide a responsive and reliable user experience.

```mermaid
graph TD
    subgraph "User Layer"
        WebApp["Web App (React)"]
        MobileApp["Mobile App (Capacitor)"]
    end

    subgraph "Backend Services"
        APIServer["API Server (Node/Express)"]
        Auth["Firebase Auth"]
        Functions["Cloud Functions"]
    end

    subgraph "Data & Storage"
        FirestoreDB[("Firestore DB")]
        Storage[("Cloud Storage")]
    end

    subgraph "Third-Party & Processing"
        GoogleMaps["Google Maps API"]
        SocialMedia["Twitter/FB APIs"]
        NLP["NLP Engine"]
    end

    %% Connections
    WebApp & MobileApp -- "API Requests" --> APIServer
    WebApp & MobileApp -- "Authentication" --> Auth
    WebApp & MobileApp -- "Map & Geolocation" --> GoogleMaps
    
    APIServer -- "CRUD Operations" --> FirestoreDB
    APIServer -- "Media Uploads" --> Storage
    
    Functions -- "Data Ingestion" --> SocialMedia
    Functions -- "Process & Store" --> FirestoreDB
    Functions -- "Analyze Text" --> NLP

    FirestoreDB -- "Real-time Updates" --> WebApp & MobileApp
```

## 2. Tech Stack

*   **Frontend:** React (for web), Capacitor/React (for mobile)
*   **Backend:** Node.js, Express.js
*   **Database:** Firestore (Real-time NoSQL)
*   **Authentication:** Firebase Authentication
*   **Serverless Functions:** Firebase Cloud Functions
*   **Storage:** Cloud Storage for Firebase
*   **Geolocation & Maps:** Google Maps API
*   **Deployment:** Vercel (for web)

## 3. Data Flow

The data flow is designed to be real-time and event-driven, ensuring that information is processed and disseminated as quickly as possible.

```mermaid
flowchart TD
    subgraph "1. Ingestion Sources"
        A["User Report (text, media, location)"]
        B["Social Media Post"]
    end

    subgraph "2. Processing Pipeline"
        C["API Server"]
        D["Cloud Function (Triggered)"]
        E["NLP Engine (Entity Extraction)"]
    end

    subgraph "3. Data Persistence"
        F[("Firestore")]
        G[("Cloud Storage")]
    end
    
    subgraph "4. Real-time Consumption"
        H["Real-time Dashboard"]
        I["Interactive Map"]
        J["Push Notifications"]
    end

    A -- "POST /api/reports" --> C
    B -- "Fetched by" --> D
    C -- "Validate & Store Metadata" --> F
    C -- "Store Media File" --> G
    D -- "Filter & Analyze" --> E
    E -- "Structured Data (JSON)" --> F
    
    F -- "Real-time Stream" --> H & I

    F -- "DB Trigger (on new report)" --> D
    D -- "If high-priority" --> J
```

## 4. Workflows

### User Registration Workflow

This diagram shows how a new user (either a citizen or a volunteer) is registered in the system.

```mermaid
sequenceDiagram
    actor User
    participant FE as "Frontend (React)"
    participant BE as "Backend (Node.js)"
    participant AUTH as "Firebase Auth"
    participant DB as "Firestore"

    User->>FE: Chooses registration type
    FE->>User: Renders appropriate form
    User->>FE: Fills form and submits

    FE->>FE: Validates form data

    alt Invalid Data
        FE->>User: Displays inline error messages
    else Valid Data
        FE->>BE: POST /api/register with user data
        activate BE
        BE->>AUTH: createUser(email, password)
        activate AUTH
        AUTH-->>BE: Returns auth UID
        deactivate AUTH
        
        BE->>DB: Save user profile in 'users' collection with UID and role
        activate DB
        DB-->>BE: Confirm profile creation
        deactivate DB

        BE-->>FE: { status: 'success' }
        deactivate BE
        FE->>User: Show success message & redirect to login
    end
```

### Hazard Reporting Workflow

This workflow outlines how a user submits a new hazard report.

```mermaid
sequenceDiagram
    actor User as "Citizen/Volunteer"
    participant FE as "Frontend"
    participant BE as "Backend API"
    participant Storage as "Cloud Storage"
    participant DB as "Firestore"
    participant Clients as "Other Users"

    User->>FE: Clicks "Create Report"
    FE->>User: Shows report form with map
    User->>FE: Fills details, uploads image

    alt Includes Image
        FE->>Storage: Uploads image file
        activate Storage
        Storage-->>FE: Returns image URL
        deactivate Storage
    end

    FE->>BE: POST /api/reports with report data & imageURL
    activate BE
    BE->>DB: Saves new document in 'hazards' collection
    activate DB
    DB-->>BE: Confirms creation
    deactivate DB
    BE-->>FE: { success: true }
    deactivate BE
    FE->>User: Shows "Report Submitted" message
    
    DB-->>Clients: Broadcasts real-time update to dashboards
    Clients->>Clients: Update map and report lists
```

### Alert Notification Workflow

This diagram shows how the system automatically sends alerts for high-priority events.

```mermaid
sequenceDiagram
    participant DB as "Firestore"
    participant FN as "Cloud Function"
    participant PUSH as "Push Notification Service (FCM)"
    participant User as "Nearby User"

    note over DB, FN: Triggered by a new document created in the 'hazards' collection.
    DB->>FN: onCreate(hazard_document)
    
    activate FN
    FN->>FN: Check if hazard is high-priority
    
    opt High-priority Event
        FN->>DB: Query 'users' collection for users in proximity
        activate DB
        DB-->>FN: Returns list of user device tokens
        deactivate DB
        
        FN->>PUSH: For each token, send push notification payload
        activate PUSH
        PUSH-->>User: Delivers alert to device
        deactivate PUSH
    end
    deactivate FN
```
