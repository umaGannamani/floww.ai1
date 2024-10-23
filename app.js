const express = require('express');
const bodyParser = require('body-parser');
const transactionsRoutes = require('./routes/transactions');
const app = express();

app.use(bodyParser.json());

// Routes
app.use('/transactions', transactionsRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
