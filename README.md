# **CookieNotes - Note Editor**

A full-stack web application built using NestJS (backend) and Vue.js (frontend). The project includes CRUD operations for notes with features like tagging, archiving, and filtering.

---

## **Prerequisites**

Ensure the following are installed on your system:

1. **Node.js**: Version 18.17 or higher.

2. **npm**: Version 9 or higher.

3. **SQLite**:  
   SQLite is used as the database engine for this project. It is lightweight and should work out of the box.

4. **Bash Shell**:  
   The provided script is written for Linux/macOS environments. For Windows, use Git Bash or WSL.

---

### **Folder Structure**

```plaintext
project-root/
├── backend/       # NestJS backend application
├── frontend/      # Vue.js frontend application
├── run.sh         # Bash script to set up and run the app
└── README.md      # Project documentation
```

---

### **Setup and Run**

To start the application, follow these steps:

1. Clone the repository and navigate to the project root directory.
2. Ensure the `run.sh` script is executable:

   ```bash
   chmod +x run.sh
   ```

3. Run the app:

   ```bash
   ./run.sh
   ```

---

### **How It Works**

The `run.sh` script handles the following:

1. **Backend Setup**:
   - Installs dependencies using `npm install`.
   - Runs database migrations to set up the SQLite schema.
   - Starts the NestJS development server on `http://localhost:3000`.

2. **Frontend Setup**:
   - Installs dependencies using `npm install`.
   - Starts the Vue.js development server on `http://localhost:5173`.

3. **Parallel Execution**:
   - Both the backend and frontend run in the background.
   - The script monitors for termination signals to gracefully stop the servers.

4. **Confirmation and Cleanup**:
   - If the script is stopped (`Ctrl+C`), it automatically stops the backend and frontend servers.

---

### **Endpoints**

#### Backend (NestJS)

- Base URL: `http://localhost:3000`
- API Endpoints:
  - `GET /notes`: Fetch all notes with optional filters.
  - `POST /notes`: Create a new note.
  - `PATCH /notes/:id`: Update an existing note.
  - `DELETE /notes/:id`: Delete a note.
  - `PATCH /notes/:id/tags`: Update tags for a note.
  - `PATCH /notes/:id/archive`: Archive a note.
  - `PATCH /notes/:id/unarchive`: Unarchive a note.

#### Frontend (Vue.js)

- Base URL: `http://localhost:5173`
- Features:
  - View, create, edit, and delete notes.
  - Tag management with add/delete capabilities.
  - Filter notes by tag or archive status.
  - Responsive user interface.

---

### **Database**

- **Engine**: SQLite
- **Setup**: The database is automatically initialized when the backend starts, using TypeORM's migration system.
