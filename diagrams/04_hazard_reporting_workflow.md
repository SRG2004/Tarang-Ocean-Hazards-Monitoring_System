> **Note:** To view this diagram, use a Markdown previewer with Mermaid support, like the 'Markdown Preview Mermaid Support' extension in VS Code.

# Hazard Reporting Workflow (Technical)

```mermaid
sequenceDiagram
    actor User
    participant FE as "Frontend (React)"
    participant BE as "Backend (Node/Express)"
    participant Storage as "Cloud Storage"
    participant DB as "Database (Firestore)"

    User->>FE: Fills out and submits hazard report form (details, file)

    alt File is attached
        FE->>BE: POST /api/v1/reports/initiate-upload (Authorization: Bearer <JWT>)
        activate BE
        BE->>Storage: generateSignedUploadUrl(fileName, contentType)
        activate Storage
        Storage-->>BE: Returns { signedUrl, publicUrl }
        deactivate Storage
        BE-->>FE: 200 OK with { signedUrl, publicUrl }
        deactivate BE

        FE->>Storage: PUT file to signedUrl with headers (Content-Type)
        activate Storage
        Storage-->>FE: 200 OK
        deactivate Storage
    end

    FE->>BE: POST /api/v1/reports (Authorization: Bearer <JWT>)
    Note right of FE: Payload: { details, location, priority, imageUrl: publicUrl }
    activate BE
    BE->>BE: Validate report data and user permissions from JWT
    BE->>DB: addDoc('hazards', {reporterId, details, location, priority, imageUrl, status: 'new', createdAt})
    activate DB
    DB-->>BE: Success: returns new document ID
    deactivate DB

    BE-->>FE: 201 Created with { reportId: newId, status: "submitted" }
    deactivate BE
    FE->>User: Display "Report submitted successfully" message

    and Error Handling
        alt Upload fails
            Storage-->>FE: 4xx/5xx Error
            FE->>User: Display "Image upload failed. Please try again."
        end
        alt Report submission fails (e.g., validation error)
            BE-->>FE: 400 Bad Request with { error: "Invalid data provided." }
            FE->>User: Display specific error message
        end
```
