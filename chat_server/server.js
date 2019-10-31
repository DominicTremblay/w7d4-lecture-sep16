const express = require('express');
const PORT = process.env.port || 3001;
const app = express();
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
