require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

const PORT = process.env.PORT || 5000;

const start = async () => {
    await connectDB();

  // create default admin if not exists
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
    const existing = await Admin.findOne({ email: adminEmail });
    if (!existing) {
        await Admin.create({ email: adminEmail, password: adminPassword });
        console.log('Default admin created');
    } else {
        console.log('Admin exists');
    }
}

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

start();
