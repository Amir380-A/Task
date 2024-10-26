import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken : any = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; 

    console.log('Authorization header:', authHeader); 
    console.log('Extracted token:', token); 

    if (!token) return res.status(401).json({ message: 'Token not provided' }); 

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'secret', (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err); 
            return res.status(403).json({ message: 'Forbidden: Invalid token' }); 
        }

        console.log('Token verified successfully:', decoded); 
        next();
    });
};

export default verifyToken;
