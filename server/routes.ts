import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertParticipantSchema, loginSchema, adminLoginSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Participant Registration
  app.post("/api/register", async (req, res) => {
    try {
      // Remove pin from request body as it will be generated server-side
      const { pin, ...dataWithoutPin } = req.body;
      const validatedData = insertParticipantSchema.omit({ pin: true }).parse(dataWithoutPin);
      
      const participant = await storage.createParticipant(validatedData as InsertParticipant);
      
      res.json({ 
        success: true, 
        pin: participant.pin,
        message: "Registration successful" 
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          success: false, 
          message: fromZodError(error).toString() 
        });
      }
      console.error("Registration error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Registration failed" 
      });
    }
  });

  // Participant Login
  app.post("/api/login", async (req, res) => {
    try {
      const { pin } = loginSchema.parse(req.body);
      const participant = await storage.getParticipantByPin(pin);
      
      if (!participant) {
        return res.status(404).json({ 
          success: false, 
          message: "Invalid PIN" 
        });
      }
      
      res.json({ 
        success: true, 
        participant 
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          success: false, 
          message: fromZodError(error).toString() 
        });
      }
      console.error("Login error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Login failed" 
      });
    }
  });

  // Get Participant Data (by PIN)
  app.get("/api/participant/:pin", async (req, res) => {
    try {
      const { pin } = req.params;
      const participant = await storage.getParticipantByPin(pin);
      
      if (!participant) {
        return res.status(404).json({ 
          success: false, 
          message: "Participant not found" 
        });
      }
      
      res.json({ 
        success: true, 
        participant 
      });
    } catch (error) {
      console.error("Get participant error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to get participant data" 
      });
    }
  });

  // Draw Manito/Manita
  app.post("/api/draw", async (req, res) => {
    try {
      const { pin } = req.body;
      
      if (!pin) {
        return res.status(400).json({ 
          success: false, 
          message: "PIN is required" 
        });
      }
      
      const participant = await storage.getParticipantByPin(pin);
      
      if (!participant) {
        return res.status(404).json({ 
          success: false, 
          message: "Participant not found" 
        });
      }
      
      if (!participant.approved) {
        return res.status(403).json({ 
          success: false, 
          message: "You must be approved by admin to draw" 
        });
      }
      
      if (participant.hasDrawn) {
        return res.status(400).json({ 
          success: false, 
          message: "You have already drawn your Manito/Manita" 
        });
      }
      
      // Check if drawing is enabled
      const settings = await storage.getAdminSettings();
      if (!settings.drawEnabled) {
        return res.status(403).json({ 
          success: false, 
          message: "Drawing is currently disabled by admin" 
        });
      }
      
      // Get available participants
      const available = await storage.getAvailableForDraw(pin);
      
      if (available.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "No participants available for drawing" 
        });
      }
      
      // Random selection
      const randomIndex = Math.floor(Math.random() * available.length);
      const selected = available[randomIndex];
      
      // Assign match
      await storage.assignMatch(pin, selected.pin);
      
      // Return the matched participant (without PIN for security)
      res.json({ 
        success: true, 
        match: {
          fullName: selected.fullName,
          codename: selected.codename,
          gender: selected.gender,
          wishlist: selected.wishlist,
        }
      });
    } catch (error) {
      console.error("Draw error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to draw Manito/Manita" 
      });
    }
  });

  // Admin Login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { adminPin } = adminLoginSchema.parse(req.body);
      const isValid = await storage.verifyAdminPin(adminPin);
      
      if (!isValid) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid admin PIN" 
        });
      }
      
      res.json({ 
        success: true, 
        message: "Admin login successful" 
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          success: false, 
          message: fromZodError(error).toString() 
        });
      }
      console.error("Admin login error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Admin login failed" 
      });
    }
  });

  // Admin middleware
  const verifyAdmin = async (req: any, res: any, next: any) => {
    const adminPin = req.headers['x-admin-pin'];
    
    if (!adminPin) {
      return res.status(401).json({ 
        success: false, 
        message: "Admin authentication required" 
      });
    }
    
    const isValid = await storage.verifyAdminPin(adminPin as string);
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admin PIN" 
      });
    }
    
    next();
  };

  // Get All Participants (Admin)
  app.get("/api/admin/participants", async (req, res) => {
    try {
      const allParticipants = await storage.getAllParticipants();
      const pending = await storage.getPendingParticipants();
      const approved = await storage.getApprovedParticipants();
      
      res.json({ 
        success: true, 
        all: allParticipants,
        pending,
        approved 
      });
    } catch (error) {
      console.error("Get participants error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to get participants" 
      });
    }
  });

  // Approve/Reject Participant (Admin)
  app.post("/api/admin/approve", async (req, res) => {
    try {
      const { pin, action } = req.body;
      
      if (!pin || !action) {
        return res.status(400).json({ 
          success: false, 
          message: "PIN and action are required" 
        });
      }
      
      if (action === 'approve') {
        await storage.approveParticipant(pin);
        res.json({ 
          success: true, 
          message: "Participant approved" 
        });
      } else if (action === 'reject') {
        await storage.rejectParticipant(pin);
        res.json({ 
          success: true, 
          message: "Participant rejected" 
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: "Invalid action" 
        });
      }
    } catch (error) {
      console.error("Approve/reject error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process request" 
      });
    }
  });

  // Toggle Draw Enabled (Admin)
  app.post("/api/admin/toggle-draw", async (req, res) => {
    try {
      const newValue = await storage.toggleDrawEnabled();
      res.json({ 
        success: true, 
        drawEnabled: newValue 
      });
    } catch (error) {
      console.error("Toggle draw error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to toggle draw" 
      });
    }
  });

  // Get Admin Settings
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.getAdminSettings();
      res.json({ 
        success: true, 
        settings: {
          drawEnabled: settings.drawEnabled
        }
      });
    } catch (error) {
      console.error("Get settings error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to get settings" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
