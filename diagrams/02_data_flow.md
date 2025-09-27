> **Note:** To view this diagram, use a Markdown previewer with Mermaid support, like the 'Markdown Preview Mermaid Support' extension in VS Code.

# Data Flow Diagram

```mermaid
flowchart TD
    subgraph "Ingestion"
        direction LR
        A["User Report (UI)"]
        B["Social Media (API)"]
    end

    subgraph "Processing & Validation"
        C["API Server: Validates & Structures Data"]
        D["Cloud Function: Fetches & Filters Social Posts"]
        E["NLP Service: Extracts Entities (Location, Hazard)"]
    end

    subgraph "Storage"
        F[   "Firestore: Stores structured report data"   ]
        G["Cloud Storage: Saves images/videos"]
    end
    
    subgraph "Real-time Consumption"
        H["Dashboard: Real-time map & list updates"]
        I["Notifications: Push alerts to specific users"]
    end

    A -- "HTTP POST" --> C
    B -- "Scheduled Fetch" --> D
    
    C -- "Save Metadata" --> F
    C -- "Upload Media" --> G
    
    D -- "Analyze Text" --> E
    E -- "Save Analyzed Data" --> F
    
    F -- "Real-time Listener" --> H
    F -- "Database Trigger" --> I
```
