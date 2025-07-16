var http = require('http');
var express = require("express");
var RED = require("node-red");

// Create an Express app
var app = express();

// Add a simple route for static content served from 'public'
// app.use("/",express.static("public"));

// Create a server
var server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
var settings = {
    httpAdminRoot: process.env.RED_ADMIN_ROOT || "/red",
    httpNodeRoot: process.env.RED_NODE_ROOT || "/red/node",
    userDir: process.env.RED_USER_DIR || ".tmp/.nodered/",
    functionGlobalContext: { },
    editorTheme:{
        page: {
            title: "RED",
            favicon: "/admin/favicon.png",
        },
        header: {
            title: "RED",
            image: "/admin/favicon.png", // or null to remove image
        }, 
    }
   
};

// Initialise the runtime with a server and settings
RED.init(server,settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);

server.listen(process.env.RED_PORT || 8000);

// Start the runtime
RED.start();
