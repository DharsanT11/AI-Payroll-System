const app = require('./app');
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Campus Payroll API Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
