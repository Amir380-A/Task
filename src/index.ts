import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB, connectRedis } from './config/database';
import routes from './routes';

dotenv.config(); 


console.log('Loaded environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('REDIS_HOST:', process.env.REDIS_HOST);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET);
const app = express();
const port = process.env.PORT || 8080;

connectMongoDB();
const redisClient = connectRedis();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use((req, res) => {
    res.status(404).send('Route not found');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export { app }; 