import express from 'express';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// Use routes
app.use('/users', userRoutes);
app.use('/admins', adminRoutes);

// Other configurations...

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});