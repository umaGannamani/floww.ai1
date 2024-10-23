const db = require("../database/database");

// Add a new transaction
exports.createTransaction = (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const query = `INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [type, category, amount, date, description], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(201)
      .json({ id: this.lastID, type, category, amount, date, description });
  });
};

// Get all transactions
exports.getAllTransactions = (req, res) => {
  db.all(`SELECT * FROM transactions`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Get a transaction by ID
exports.getTransactionById = (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM transactions WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(row);
  });
};

// Update a transaction by ID
exports.updateTransaction = (req, res) => {
  const { id } = req.params;
  const { type, category, amount, date, description } = req.body;
  const query = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`;

  db.run(
    query,
    [type, category, amount, date, description, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json({ message: "Transaction updated successfully" });
    }
  );
};

// Delete a transaction by ID
exports.deleteTransaction = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM transactions WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  });
};

// Get summary of transactions
exports.getSummary = (req, res) => {
  db.all(
    `SELECT type, SUM(amount) as total FROM transactions GROUP BY type`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const summary = rows.reduce(
        (acc, { type, total }) => {
          acc[type] = total;
          return acc;
        },
        { income: 0, expense: 0 }
      );
      summary.balance = summary.income - summary.expense;
      res.json(summary);
    }
  );
};
