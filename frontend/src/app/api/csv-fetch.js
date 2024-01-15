export default async function handler(req, res) {
  try {
    // Replace the URL with the actual CSV file URL
    const { csvURL } = req.query;
    console.log("CSV URL is =", csvURL);
    // Fetch the CSV data from the URL
    const response = await fetch(csvURL);
    
    // Check if the response is successful
    if (response.ok) {
      // Convert the CSV data to text
      const csvData = await response.text();
      
      // Send the CSV data as the API response
      res.status(200).json({ csvData });
    } else {
      // Handle the case when the response is not successful
      res.status(500).json({ error: 'Failed to fetch the CSV file' });
    }
  } catch (error) {
    // Handle any errors that occur during the fetching and processing
    res.status(500).json({ error: 'An error occurred' });
  }
}