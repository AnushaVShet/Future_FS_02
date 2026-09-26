const express = require("express");
const Lead = require("../models/Lead");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware);
// Get all leads
router.get("/", async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });

        res.json(leads);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch leads",
            error: error.message
        });
    }
});
// Update a lead
router.put("/:id", async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedLead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        res.json({
            message: "Lead updated successfully",
            lead: updatedLead
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update lead",
            error: error.message
        });
    }
});
// Add a note to a lead
router.post("/:id/notes", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Note text is required"
            });
        }

        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        lead.notes.push({
            text: text.trim()
        });

        await lead.save();

        res.json({
            message: "Note added successfully",
            lead
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add note",
            error: error.message
        });
    }
});
// Add a new lead
router.post("/", async (req, res) => {
    try {
        const lead = new Lead(req.body);

        const savedLead = await lead.save();

        res.status(201).json({
            message: "Lead created successfully",
            lead: savedLead
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create lead",
            error: error.message
        });
    }
});
// Delete a lead
router.delete("/:id", async (req, res) => {
    try {
        const deletedLead = await Lead.findByIdAndDelete(req.params.id);

        if (!deletedLead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        res.json({
            message: "Lead deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete lead",
            error: error.message
        });
    }
});

module.exports = router;