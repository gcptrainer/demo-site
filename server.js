const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const path = require('path');

const app = express();
const port = 3000;

// Initialize express session
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: 'my-session-secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Initialize Keycloak
const keycloak = new Keycloak({ store: memoryStore });

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (e.g., CSS, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Keycloak middleware to protect routes
app.use(keycloak.middleware());

// Home route 
app.get('/home', (req, res) => {
  res.render('home');
});

// Login route
app.get('/orders', (req, res) => {
  res.render('orders');
});

// Logout route
app.get('/logout', (req, res) => {
  keycloak.logout(req, res, 'http://localhost:3000');
});

// Keycloak token callback (Keycloak Redirect)
app.get('/callback', (req, res) => {
  res.redirect('/home');
});

// Default route
app.get('/', (req, res) => {
  res.redirect('/home');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});