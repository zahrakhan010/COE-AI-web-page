const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

// Function to scrape the paper details from the given URL
async function scrapePaper(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const title = $('h1.title').text().trim();
        const authors = [];
        $('a.author').each((index, element) => {
            authors.push($(element).text().trim());
        });
        const abstract = $('blockquote.abstract.mathjax').text().trim();

        return {
            title,
            authors,
            abstract,
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error: 'Failed to scrape the paper details.' };
    }
}

// Define an endpoint for the preview button to call
app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }

    const paperDetails = await scrapePaper(url);
    res.send(paperDetails);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
