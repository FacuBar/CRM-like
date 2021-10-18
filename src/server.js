const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

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
