```mermaid
sequenceDiagram
    participant user
    participant browser
    participant server

    user->>browser: Enters note content and clicks Save
    Note right of browser: e.preventDefault()
    Note right of browser: Create note object { "content": "XXXXXXXX", "date": "2024-06-08" }
    Note right of browser: Add note to notes array
    Note right of browser: The browser renders the notes
     
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa with JSON data { "content": "XXXXXXXX", "date": "2024-06-08" }
    activate server
    server-->>browser: 201 Created
    deactivate server

    Note right of server: The server starts processesing the new note

