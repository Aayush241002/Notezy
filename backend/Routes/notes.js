const express = require('express');
const router = express.Router();
const Notes = require('../Models/Notes');
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
router.post("/summarize", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: "No text provided" });
        }
        const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.SUMMARIZETOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: text })
        });
        const data = await response.json();
        if (Array.isArray(data) && data[0]?.summary_text) {
            return res.json({ summary: data[0].summary_text });
        } else {
            return res.status(400).json({ error: "No summaries generated", details: data });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
router.post("/generatetitle", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: "No text provided" });
        }
        const fetchRes = await fetch("https://openrouter.ai/api/v1/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GENERATETITLE}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                prompt: `Create a short, catchy title for the following description: ${text}`,
                max_tokens: 30
            }),
        });
        const data = await fetchRes.json(); // parse once
        return res.json({ title: data.choices[0].text });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
})
router.get('/getnotes', fetchuser, async (req, res) => {

    const notes = await Notes.find({ user: req.user.id });

    res.json(notes)
});

router.post('/addnote', fetchuser, [
    body('title', 'Title should be of atleast 3 characters').isLength({ min: 3 }),
    body('description', 'Description should have atleast 5 characters').isLength({ min: 5 }),

], async (req, res) => {
    const { title, description, tag, pinned, favourite } = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const notes = new Notes({ title, description, tag, pinned, favourite, user: req.user.id });
        await notes.save();
        res.status(201).json({ success: true, note: notes });
    } catch (err) {
        res.status(500).json({ error: "Server Error occured" });
    }
});
router.put('/updatenote/:id', fetchuser, [
    body('title', 'Title should be of atleast 3 characters').isLength({ min: 3 }),
    body('description', 'Description should have atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    const { title, description, tag, pinned, favourite } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // build newnote object from request
        const newnote = {};
        if (title) newnote.title = title;
        if (description) newnote.description = description;
        if (tag) newnote.tag = tag;
        if (pinned !== undefined) newnote.pinned = pinned;
        if (favourite !== undefined) newnote.favourite = favourite;

        // fetch original note
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not Found");
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // check if any field has actually changed
        let isChanged = false;
        if (title && title !== note.title) isChanged = true;
        if (description && description !== note.description) isChanged = true;
        if (tag && tag !== note.tag) isChanged = true;
        if (pinned !== undefined && pinned !== note.pinned) isChanged = true;
        if (favourite !== undefined && favourite !== note.favourite) isChanged = true;

        // only update lastUpdated if something changed
        const updateData = { ...newnote };
        if (isChanged) {
            updateData.lastUpdated = Date.now();
        }

        note = await Notes.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error occured');
    }
});


router.delete('/removenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("notfound");

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }

        note = await Notes.findByIdAndUpdate(
            req.params.id,
            { $set: { deleted: true } },  // mark deleted
            { new: true }
        );

        res.json({ success: true, message: "Note moved to trash", note });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error occured");
    }
});


router.put('/restorenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("notfound");

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }

        note = await Notes.findByIdAndUpdate(
            req.params.id,
            { $set: { deleted: false } },  // mark restored
            { new: true }
        );

        res.json({ success: true, message: "Note restored", note });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error occured");
    }
});


// ✅ Hard delete (permanent delete)
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("notfound");

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }

        await Notes.findByIdAndDelete(req.params.id);  // permanent delete

        res.json({ success: true, message: "Note permanently deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error occured");
    }
});

module.exports = router 