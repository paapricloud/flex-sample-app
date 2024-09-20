const express = require('express');

const routes = require('./baseRoutes.json');

// Routers
const router = express.Router();

// Dynamically set up routes
routes.forEach(({ path, module }) => {
    const routesModule = require(module);
    router.use(path, routesModule);
});


module.exports = router;