const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname + '/../config.env') });
const app = require('./app');

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'))
  .catch((err) => console.log(err));

app.set('port', process.env.PORT || 8000);

const server = app.listen(app.get('port'), () => {
  console.log(`Server live at port ${app.get('port')}`);
});

process.on('SIGTERM', () => {
  console.log('Sigterm received, shutting down');
  server.close();
});
