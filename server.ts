import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Initializing database...");
const db = new Database("production.db");

// Initialize database
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_number TEXT UNIQUE NOT NULL,
      project_name TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      contact_number TEXT,
      order_type TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      sizes TEXT,
      design_proof_image TEXT,
      order_date TEXT NOT NULL,
      due_date TEXT,
      assigned_staff TEXT,
      status TEXT DEFAULT 'Design',
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Database table 'projects' verified/created.");
} catch (error) {
  console.error("Failed to initialize database table:", error);
}

// Seed sample data if empty
try {
  const count = db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
  if (count.count === 0) {
    console.log("Seeding sample data...");
    const sampleProjects = [
      {
        tracking_number: 'SUB-A1B2C3',
        project_name: 'Team Alpha Jerseys 2024',
        customer_name: 'John Smith',
        contact_number: '555-0123',
        order_type: 'Jersey',
        quantity: 25,
        sizes: 'S: 5, M: 10, L: 10',
        design_proof_image: 'https://picsum.photos/seed/jersey1/400/300',
        order_date: '2024-03-01',
        due_date: '2024-03-15',
        assigned_staff: 'Sarah Miller',
        status: 'Design',
        created_by: 'Byron Boyd Ausan'
      },
      {
        tracking_number: 'SUB-D4E5F6',
        project_name: 'Corporate Event T-Shirts',
        customer_name: 'TechCorp Inc.',
        contact_number: '555-9876',
        order_type: 'T-shirt',
        quantity: 100,
        sizes: 'M: 40, L: 40, XL: 20',
        design_proof_image: 'https://picsum.photos/seed/tshirt1/400/300',
        order_date: '2024-03-02',
        due_date: '2024-03-10',
        assigned_staff: 'Mike Ross',
        status: 'Print',
        created_by: 'Byron Boyd Ausan'
      },
      {
        tracking_number: 'SUB-G7H8I9',
        project_name: 'High School Basketball Hoodies',
        customer_name: 'Westside High',
        contact_number: '555-4433',
        order_type: 'Hoodie',
        quantity: 50,
        sizes: 'S: 10, M: 20, L: 20',
        design_proof_image: 'https://picsum.photos/seed/hoodie1/400/300',
        order_date: '2024-03-05',
        due_date: '2024-03-20',
        assigned_staff: 'Jane Doe',
        status: 'Quality Check',
        created_by: 'Byron Boyd Ausan'
      }
    ];

    const insert = db.prepare(`
      INSERT INTO projects (
        tracking_number, project_name, customer_name, contact_number, 
        order_type, quantity, sizes, design_proof_image, 
        order_date, due_date, assigned_staff, status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of sampleProjects) {
      insert.run(
        p.tracking_number, p.project_name, p.customer_name, p.contact_number,
        p.order_type, p.quantity, p.sizes, p.design_proof_image,
        p.order_date, p.due_date, p.assigned_staff, p.status, p.created_by
      );
    }
    console.log("Sample data seeded.");
  }
} catch (error) {
  console.error("Failed to seed database:", error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode...`);

  app.use(express.json({ limit: '50mb' }));

  // Request logging middleware
  app.use((req, res, next) => {
    if (!req.url.startsWith('/@vite') && !req.url.startsWith('/src')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
  });

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API Routes
  app.get("/api/projects", (req, res) => {
    console.log("GET /api/projects requested");
    try {
      const projects = db.prepare("SELECT * FROM projects ORDER BY created_at DESC").all();
      res.json(projects);
    } catch (error) {
      console.error("Error in GET /api/projects:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/projects", (req, res) => {
    const {
      project_name,
      customer_name,
      contact_number,
      order_type,
      quantity,
      sizes,
      design_proof_image,
      order_date,
      due_date,
      assigned_staff,
      created_by
    } = req.body;

    const tracking_number = `SUB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    try {
      const info = db.prepare(`
        INSERT INTO projects (
          tracking_number, project_name, customer_name, contact_number, 
          order_type, quantity, sizes, design_proof_image, 
          order_date, due_date, assigned_staff, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        tracking_number, project_name, customer_name, contact_number,
        order_type, quantity, sizes, design_proof_image,
        order_date, due_date, assigned_staff, created_by
      );
      
      const newProject = db.prepare("SELECT * FROM projects WHERE id = ?").get(info.lastInsertRowid);
      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.patch("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const values = Object.values(updates);

    try {
      db.prepare(`UPDATE projects SET ${fields} WHERE id = ?`).run(...values, id);
      const updatedProject = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM projects WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  console.log("Vite middleware initialized. Starting listener...");
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("Ready to handle requests.");
  });

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global error handler caught:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  });
}

startServer();
