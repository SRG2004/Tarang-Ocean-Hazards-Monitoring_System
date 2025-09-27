> **Note:** To view this diagram, use a Markdown previewer with Mermaid support, like the 'Markdown Preview Mermaid Support' extension in VS Code.

# Alert Notification Workflow (Technical)

```mermaid
sequenceDiagram
    participant FirestoreTrigger as "Firestore Trigger"
    participant CloudFunc as "Cloud Function"
    participant DB as "Firestore (Query)"
    participant FCM as "Firebase Cloud Messaging API"
    participant UserDevice as "User's Device"

    Note over FirestoreTrigger, CloudFunc: Triggered on new document creation in `/hazards/{reportId}`

    FirestoreTrigger->>CloudFunc: Event: onDocumentCreated(event)
Payload: { reportId, hazardData }
    activate CloudFunc

    CloudFunc->>CloudFunc: if (hazardData.priority < HIGH_THRESHOLD) then skip

    alt High-Priority Hazard
        CloudFunc->>DB: executeGeoQuery(`users`, near: hazardData.location, radius: ALERT_RADIUS_KM)
        activate DB
        DB-->>CloudFunc: Returns Promise<QuerySnapshot> (list of user documents)
        deactivate DB

        CloudFunc->>CloudFunc: Extract device tokens from user documents

        Note right of CloudFunc: Construct FCM message payload
        CloudFunc->>FCM: POST /v1/projects/.../messages:send (for each batch of tokens)
        activate FCM
        Note left of FCM: Payload:
{
  "message": {
    "tokens": [...],
    "notification": {
      "title": "High-Priority Hazard Alert",
      "body": "A new hazard has been reported near you."
    },
    "data": {
      "reportId": "{reportId}" 
    }
  }
}

        FCM-->>UserDevice: Delivers push notification
        deactivate FCM
    end

    CloudFunc-->>FirestoreTrigger: Function execution completes
    deactivate CloudFunc
```
