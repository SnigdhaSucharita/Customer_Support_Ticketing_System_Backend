let express = require("express");
let { ticket } = require("./models/ticket.model");
let { customer } = require("./models/customer.model");
let { agent } = require("./models/agent.model");
let { sequelize } = require("./lib/index");
let app = express();

app.use(express.json());

let tickets = [
    { title: 'Login Issue', description: 'Cannot login to account', status: 'open', priority: 1, customerId: 1, agentId: 1 },
    { title: 'Payment Failure', description: 'Payment not processed', status: 'closed', priority: 2, customerId: 2, agentId: 2 },
    { title: 'Bug Report', description: 'Found a bug in the system', status: 'open', priority: 3, customerId: 1, agentId: 1 }
  ];

let customers = [
    { customerId: 1, name: 'Alice', email: 'alice@example.com' },
    { customerId: 2, name: 'Bob', email: 'bob@example.com' }
  ];

let agents = [
    { agentId: 1, name: 'Charlie', email: 'charlie@example.com' },
    { agentId: 2, name: 'Dave', email: 'dave@example.com' }
  ];


app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await ticket.bulkCreate(tickets);
    await customer.bulkCreate(customers);
    await agent.bulkCreate(agents);

    res.status(200).json({ message: "Database Seeding successful" });
  } catch(error) {
    res.status(500).json({ message: "Error seeding the data", error: error.message });
  }
});

async function fetchAllTickets() {
  let tickets = await ticket.findAll();
  return { tickets };
}

app.get("/tickets", async(req, res) => {
  try {
    let response = await fetchAllTickets();
    if(response.tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found" });
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function getTicketById(id) {
  let ticketData = await ticket.findOne({ where: { id } });
  if(!ticketData) return {};
  return { ticket: ticketData }; 
}

app.get("/tickets/details/:id", async(req, res) => {
  try {
    let id = req.params.id;
    let response = await getTicketById(id);
    if(response.ticket === undefined) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function getTicketsByStatus(status) {
  let tickets = await ticket.findAll({ where: { status } });
  
  return { tickets }; 
}

app.get("/tickets/status/:status", async(req, res) => {
  try {
    let status = req.params.status;
    let response = await getTicketsByStatus(status);
    if(response.tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found" });
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function fetchTicketsSortedByPriority() {
  let tickets = await ticket.findAll({ order: [["priority", "ASC"]] });
  return { tickets };
}

app.get("/tickets/sort-by-priority", async(req, res) => {
  try {
    let response = await fetchTicketsSortedByPriority();
    if(response.tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found" });
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function addNewTicket(newTicket) {
  await ticket.create(newTicket);
  let tickets = await ticket.findAll();
  return { tickets };
}

app.post("/tickets/new", async(req, res) => {
  try {
    let newTicket = req.body;
    let response = await addNewTicket(newTicket);
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function updateTicketById(id, updatedTicketData) {
  let ticketData = await ticket.findOne({ where: { id } });
  if(!ticketData) return {};
  ticketData.set(updatedTicketData);
  await ticketData.save();
  let tickets = await ticket.findAll();
  return { tickets };
}

app.post("/tickets/update/:id", async(req, res) => {
  try {
    let id = req.params.id;
    let updatedTicketData = req.body;
    let response = await updateTicketById(id, updatedTicketData);
    if(response.tickets === undefined) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    if(response.tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found" });
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function deleteTicketById(id) {
  let destroyedTicket = await ticket.destroy({ where: { id } });
  if(!destroyedTicket) return {};
  return { message: `Ticket with ID ${id} deleted successfully` }
}

app.post("/tickets/delete", async(req, res) => {
  try {
    let id = req.body.id;
    let response = await deleteTicketById(id);
    if(!response.message) {
      return res.status(404).json({message: "Ticket not found"});
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function getTicketsByCustomerId(customerId) {
  let tickets = await ticket.findAll({ where: { customerId } });

  return { tickets }; 
}

app.get("/tickets/customer/:customerId", async(req, res) => {
  try {
    let customerId = req.params.customerId;
    let response = await getTicketsByCustomerId(customerId);
    if(response.tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found" });
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function getTicketsByAgentId(agentId) {
  let tickets = await ticket.findAll({ where: { agentId } });

  return { tickets }; 
}

app.get("/tickets/agent/:agentId", async(req, res) => {
  try {
    let agentId = req.params.agentId;
    let response = await getTicketsByAgentId(agentId);
    if(response.tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found" });
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});