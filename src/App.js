import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State management
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Function to validate and submit JSON input
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate JSON format
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data) {
        setError('Invalid JSON: Missing "data" field');
        return;
      }
      setError('');

      // Make API call
      const response = await fetch('http://localhost:8081/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedInput),
      });

      const result = await response.json();
      setResponseData(result);
      setShowDropdown(true); // Show dropdown after successful submission
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  // Handle dropdown selection
  const handleOptionChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOptions(value);
  };

  // Render filtered response based on selected options
  const renderResponse = () => {
    if (!responseData) return null;

    const { alphabets, numbers, highest_lowercase_alphabet } = responseData;
    let displayData = {};

    if (selectedOptions.includes('Alphabets')) {
      displayData.alphabets = alphabets;
    }
    if (selectedOptions.includes('Numbers')) {
      displayData.numbers = numbers;
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      displayData.highestLowercaseAlphabet = highest_lowercase_alphabet;
    }

    return (
      <div>
        <h3>Response Data</h3>
        <pre>{JSON.stringify(displayData, null, 2)}</pre>
      </div>
    );
  };

  // Update document title (roll number)
  useEffect(() => {
    document.title = 'RA2111003040027'; // Set your roll number as title
  }, []);

  return (
    <div className="App">
      <h1>JSON Input Processor</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON here, e.g., { "data": ["A", "B", "z", "1"] }'
          rows="10"
          cols="50"
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showDropdown && (
        <div>
          <h3>Filter Response</h3>
          <select multiple={true} value={selectedOptions} onChange={handleOptionChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
        </div>
      )}

      {renderResponse()}
    </div>
  );
}

export default App;
