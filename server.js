
const express = require("express");

const app = express();
app.use(express.json());

let tickets = [];
let nextId = 1;

const priorities = ["LOW", "MEDIUM", "HIGH"];
const statuses = ["OPEN", "IN_PROGRESS", "CLOSED"];

function validateTicket(data) {
  if (
    !data ||
    typeof data.title !== "string" ||
    !data.title.trim() ||
    typeof data.description !== "string" ||
    !data.description.trim() ||
    !priorities.includes(data.priority) ||
    !statuses.includes(data.status) ||
    typeof data.category !== "string" ||
    !data.category.trim()
  ) {
    return false;
  }
  return true;
}

// Create a ticket
app.post("/api/tickets", (req, res) => {
  if (!validateTicket(req.body)) {
    return res.status(400).json({
      message: "Invalid ticket data. Check all required fields."
    });
  }

  const ticket = {
    id: nextId++,
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    priority: req.body.priority,
    status: req.body.status,
    category: req.body.category.trim()
  };

  tickets.push(ticket);
  res.status(201).json(ticket);
});

// Get all tickets
app.get("/api/tickets", (req, res) => {
  res.status(200).json(tickets);
});

// Get one ticket
app.get("/api/tickets/:id", (req, res) => {
  const ticket = tickets.find(
    (t) => t.id === Number(req.params.id)
  );

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  res.status(200).json(ticket);
});

// Update a ticket
app.put("/api/tickets/:id", (req, res) => {
  const ticket = tickets.find(
    (t) => t.id === Number(req.params.id)
  );

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  if (!validateTicket(req.body)) {
    return res.status(400).json({
      message: "Invalid ticket data. Check all required fields."
    });
  }

  ticket.title = req.body.title.trim();
  ticket.description = req.body.description.trim();
  ticket.priority = req.body.priority;
  ticket.status = req.body.status;
  ticket.category = req.body.category.trim();

  res.status(200).json(ticket);
});

// Delete a ticket
app.delete("/api/tickets/:id", (req, res) => {
  const index = tickets.findIndex(
    (t) => t.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  tickets.splice(index, 1);
  res.status(200).json({ message: "Ticket deleted successfully" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Ticket API running on port ${PORT}`);
});
