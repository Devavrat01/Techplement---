import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quote = () => {
  const [quote, setQuote] = useState({});
  const [search, setSearch] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [backendUrl, setBackendUrl] = useState('http://localhost:5001/api');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  const fetchRandomQuote = async () => {
    try {
      const response = await axios.get(`${backendUrl}/quote/random`);
      setQuote(response.data);
    } catch (error) {
      setError('Error fetching random quote');
      console.error('Error fetching random quote:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${backendUrl}/quote/search/${search}`);
      setQuotes(response.data);
      if (response.data.length === 0) {
        setError(`No quotes found for ${search}`);
      } else {
        setError(null);
      }
    } catch (error) {
      setError('Error searching quotes');
      console.error('Error searching quotes:', error);
    }
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h1 style={{ fontSize: 36, marginBottom: 10 }}>Quote of the Day</h1>
      <button
        onClick={fetchRandomQuote}
        style={{ backgroundColor: '#4CAF50', color: 'white', padding: 10, borderRadius: 5 }}
      >
        Get Random Quote
      </button>
      <div style={{ marginTop: 20 }}>
        <p>
          <strong style={{ fontSize: 24 }}>{quote.author}</strong>: "{quote.content}"
        </p>
      </div>
      <input
        type="text"
        value={search}
        onChange={handleInputChange}
        placeholder="Search by author"
        style={{ width: 300, height: 30, padding: 10, fontSize: 18 }}
      />
      <button
        onClick={handleSearch}
        style={{ backgroundColor: '#4CAF50', color: 'white', padding: 10, borderRadius: 5, marginLeft: 10 }}
      >
        Search
      </button>
      <div style={{ marginTop: 20 }}>
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          quotes.map((q, index) => (
            <p key={index}>
              <strong style={{ fontSize: 24 }}>{q.author}</strong>: "{q.text}"
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default Quote;