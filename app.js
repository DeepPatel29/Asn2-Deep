/**********************************
 * ITE5315 – Assignment 2
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source (including web sites) or distributed to other students.
 *
 * Name: Deep Patel Student ID: N01679203 Date: 28/10/2025
 *
 **********************************/

const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const fs = require("fs").promises;

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure Handlebars
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
      // Custom helper to format price (remove $ and trim)
      formatPrice: function (price) {
        if (!price) return "N/A";
        return price.toString().replace("$", "").trim();
      },
      // Custom helper to check if value is empty
      isEmpty: function (value) {
        return !value || value.toString().trim() === "";
      },
      // Helper to get first photo or default
      getFirstPhoto: function (photos) {
        if (photos && photos.length > 0) {
          return photos[0];
        }
        return "/images/no-image.jpg";
      },
      // Helper to truncate description
      truncateDescription: function (description, length) {
        if (!description) return "No description available";
        if (description.length <= length) return description;
        return description.substring(0, length) + "...";
      }
    },
  })
);
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, 'views'));

// Sample data fallback (in case JSON file fails to load)
const sampleData = [
  {
    _id: "1",
    NAME: "Sample Property 1",
    price: "$100",
    neighbourhood: "Sample Area",
    property_type: "Apartment",
    description: "This is a sample property description.",
    photos: []
  },
  {
    _id: "2",
    NAME: "Sample Property 2",
    price: "$150",
    neighbourhood: "Another Area",
    property_type: "House",
    description: "Another sample property for testing.",
    photos: []
  }
];

// Load Airbnb data with better error handling
let airbnbData = [];

async function loadData() {
  try {
    console.log('Current directory:', process.cwd());
    console.log('Files in directory:', await fs.readdir(process.cwd()));
    
    const filePath = path.join(process.cwd(), 'airbnb_with_photos.json');
    console.log('Looking for file at:', filePath);
    
    const data = await fs.readFile(filePath, 'utf8');
    airbnbData = JSON.parse(data);
    console.log(`Successfully loaded ${airbnbData.length} records from JSON file`);
  } catch (error) {
    console.error("Error loading JSON data file:", error.message);
    console.log("Using sample data instead");
    airbnbData = sampleData;
  }
}

// Initialize data
loadData();

// Home route
app.get("/", function (req, res) {
  res.render("index", { 
    title: "Airbnb Property Explorer",
    featuredCount: airbnbData.length > 2 ? airbnbData.length : 2
  });
});

// Users route
app.get("/users", function (req, res) {
  res.send("respond with a resource");
});

// Step 8: View all data route
app.get("/viewData", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 100;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const dataToShow = airbnbData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(airbnbData.length / limit);
  
  res.render("viewData", {
    title: "All Airbnb Properties",
    data: dataToShow,
    currentPage: page,
    totalPages: totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page + 1,
    prevPage: page - 1
  });
});

// Step 9: Clean data route (remove empty names)
app.get("/viewData/clean", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 100;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const cleanData = airbnbData.filter((item) => item.NAME && item.NAME.trim() !== "");
  const dataToShow = cleanData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(cleanData.length / limit);
  
  res.render("viewData", {
    title: "Cleaned Airbnb Data",
    data: dataToShow,
    currentPage: page,
    totalPages: totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page + 1,
    prevPage: page - 1,
    isClean: true
  });
});

// Step 11: Price range search form
app.get("/viewData/price", (req, res) => {
  res.render("priceSearch", {
    title: "Search by Price Range",
  });
});

// Price search results
app.post("/viewData/price/results", (req, res) => {
  const minPrice = parseFloat(req.body.minPrice) || 0;
  const maxPrice = parseFloat(req.body.maxPrice) || 10000;
  const page = parseInt(req.query.page) || 1;
  const limit = 100;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const results = airbnbData.filter((item) => {
    const price = parseFloat(item.price?.toString().replace("$", "").replace(",", "")) || 0;
    return price >= minPrice && price <= maxPrice;
  });

  const paginatedResults = results.slice(startIndex, endIndex);
  const totalPages = Math.ceil(results.length / limit);

  res.render("priceResults", {
    title: "Price Range Results",
    results: paginatedResults,
    minPrice: minPrice,
    maxPrice: maxPrice,
    currentPage: page,
    totalPages: totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page + 1,
    prevPage: page - 1,
    totalResults: results.length
  });
});

// Assignment 1 routes recreated with Handlebars
app.get("/allData", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 100;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const dataToShow = airbnbData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(airbnbData.length / limit);

  res.render("allData", {
    title: "All Data - Assignment 1",
    data: dataToShow,
    currentPage: page,
    totalPages: totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page + 1,
    prevPage: page - 1
  });
});

// Search form page
app.get("/search/propertyLine", (req, res) => {
  res.render("searchForm", {
    title: "Search Properties",
  });
});

// Search results
app.get("/search/propertyLine/results", (req, res) => {
  const searchTerm = req.query.searchTerm?.toLowerCase() || "";
  const page = parseInt(req.query.page) || 1;
  const limit = 100;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const results = airbnbData.filter(
    (item) =>
      item.NAME?.toLowerCase().includes(searchTerm) ||
      item.neighbourhood?.toLowerCase().includes(searchTerm) ||
      item.property_type?.toLowerCase().includes(searchTerm)
  );

  const paginatedResults = results.slice(startIndex, endIndex);
  const totalPages = Math.ceil(results.length / limit);

  res.render("searchResults", {
    title: "Search Results",
    searchTerm,
    results: paginatedResults,
    currentPage: page,
    totalPages: totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page + 1,
    prevPage: page - 1,
    totalResults: results.length
  });
});

// Debug route to check data loading
app.get("/debug", async (req, res) => {
  try {
    const files = await fs.readdir(process.cwd());
    let fileInfo = {};
    
    try {
      const stats = await fs.stat(path.join(process.cwd(), 'airbnb_with_photos.json'));
      fileInfo = {
        exists: true,
        size: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        lastModified: stats.mtime
      };
    } catch (error) {
      fileInfo = {
        exists: false,
        error: error.message
      };
    }
    
    res.json({
      currentDir: process.cwd(),
      files: files,
      jsonFile: fileInfo,
      dataLoaded: airbnbData.length,
      isSampleData: airbnbData === sampleData,
      nodeVersion: process.version
    });
  } catch (error) {
    res.json({
      error: error.message,
      dataLoaded: airbnbData.length,
      isSampleData: airbnbData === sampleData
    });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    dataCount: airbnbData.length,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Error",
    message: "Page Not Found",
    error: { status: 404 }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "Error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});