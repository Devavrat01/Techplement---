const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const DB_URI  = 'mongodb+srv://howareyou:howareyou@cluster0.tysxevl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'      // Update if using a different MongoDB URI

// Connect to MongoDB
mongoose.connect(DB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Add an error handler for MongoDB connection errors
mongoose.connection.on('error', err => {
  console.log(err);
});

// Define Quote Schema
const quoteSchema = new mongoose.Schema({
  author: String,
  text: String
});

const Quote = mongoose.model('Quote', quoteSchema);

// Fetch Random Quote and add to database
app.get('/api/quote/random', async (req, res) => {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    const quoteData = response.data;
    const quote = new Quote({
      author: quoteData.author,
      text: quoteData.content
    });
    await quote.save();
    res.json(quoteData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch and save quote' });
  }
});

// Search Quotes by Author
app.get('/api/quote/search/:author', async (req, res) => {
  try {
    const quotes = await Quote.find({ author: new RegExp(req.params.author, 'i') });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search quotes' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});