import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL, 
});
redisClient.connect().catch(console.error); 

const generateAccessToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '40m' });
};

const generateRefreshToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
};

export const signup: any = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

export const signin: any = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());
        console.log('Access Token:', accessToken); 
        console.log('Refresh Token:', refreshToken); 

        return res.status(200).json({
            message: 'Signin successful',
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message || 'Internal server error' });
    }
};

export const refreshToken: any = async (req: Request, res: Response) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        const data = await redisClient.get(refresh_token);
        if (data === 'revoked') {
            return res.status(403).json({ message: 'Refresh token has been revoked' });
        }

        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET!, (err:any, decoded : any) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired refresh token' });
            }

            const userId = (decoded as any).id;
            const newAccessToken = generateAccessToken(userId);
            const newRefreshToken = generateRefreshToken(userId);

            return res.status(200).json({
                message: 'Token refreshed successfully',
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
            });
        });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message || 'Internal server error' });
    }
};

export const revokeRefreshToken : any = async (req: Request, res: Response) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    await redisClient.set(refresh_token, 'revoked', { EX: 7 * 24 * 60 * 60 });

    return res.status(200).json({ message: 'Refresh token revoked successfully' });
};
