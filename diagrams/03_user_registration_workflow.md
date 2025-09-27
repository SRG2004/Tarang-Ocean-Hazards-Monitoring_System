> **Note:** To view this diagram, use a Markdown previewer with Mermaid support, like the 'Markdown Preview Mermaid Support' extension in VS Code.

# User Registration Workflow (Technical)

```mermaid
sequenceDiagram
    actor User
    participant FE as "Frontend (React)"
    participant BE as "Backend (Node/Express)"
    participant AUTH as "Auth Service (Firebase)"
    participant DB as "Database (Firestore)"

    User->>FE: Submits registration form (email, password, name)
    FE->>FE: Client-side validation (e.g., password strength)

    alt Form is invalid
        FE->>User: Renders form with validation error messages
    else Form is valid
        FE->>BE: POST /api/v1/auth/register with user credentials
        activate BE

        BE->>AUTH: createUser({email, password})
        activate AUTH
        AUTH-->>BE: Success: returns Auth User Record (uid)
        deactivate AUTH

        BE->>DB: setDoc(`users/${uid}`, {email, name, role: 'citizen', createdAt})
        activate DB
        DB-->>BE: Success: document written
        deactivate DB

        BE-->>FE: 201 Created with { status: "success", userId: uid }
        deactivate BE

        FE->>User: Redirect to /login with success message
    end

    and Error Handling

    alt Email already exists
        AUTH-->>BE: Error: auth/email-already-in-use
        BE-->>FE: 409 Conflict with { error: "Email already registered." }
    end

    alt Other backend error
        BE-->>FE: 500 Internal Server Error with { error: "An unexpected error occurred." }
    end
```
