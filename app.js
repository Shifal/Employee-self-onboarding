const express = require ("express");
require("dotenv").config();
require("./config/db").connent();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const Adminmodule = require('./routes/adminroute');
app.use('/admin', Adminmodule);

const Fieldagentmodule = require('./routes/fieldagentroute');
app.use('/fieldagent', Fieldagentmodule);

const Hrmodule = require('./routes/hrexceroute');
app.use('/hrexc', Hrmodule);

module.exports = app;