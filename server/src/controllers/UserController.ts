import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from '../config';
import User, { IUser } from '../models/User';

// Auth Controllers
export const verifyAadhaar = async (req: Request, res: Response) => {
  try {
    const { aadhaarNumber } = req.body;
    // In production, integrate with actual UIDAI API
    // For demo, we'll simulate verification
    const isValid = aadhaarNumber.length === 12;
    
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid Aadhaar number' });
    }

    res.json({
      success: true,
      data: {
        name: 'Demo User',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        address: 'Sample Address, City, State - 123456'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyFace = async (req: Request, res: Response) => {
  try {
    const { selfieImage, aadhaarPhoto } = req.body;
    // In production, integrate with face verification API
    // For demo, we'll simulate verification
    
    res.json({
      success: true,
      confidence: 0.95
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, aadhaarNumber, phoneNumber, gender, dateOfBirth, address } = req.body;
    
    const existingUser = await User.findOne({ aadhaarNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      aadhaarNumber,
      phoneNumber,
      gender,
      dateOfBirth,
      address,
      isVerified: true,
      verifiedAt: new Date()
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { aadhaarNumber } = req.body;
    
    const user = await User.findOne({ aadhaarNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Profile Controllers
export const getProfile = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const user = await User.findById(req.userId)
      .select('-aadhaarNumber')
      .populate('applications');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true }
    ).select('-aadhaarNumber');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Skills Controllers
export const addSkills = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { skills } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { skills: { $each: skills } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeSkills = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { skills } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pullAll: { skills } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Experience Controllers
export const addExperience = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const experience = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $push: { experience } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateExperience = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const user = await User.findOneAndUpdate(
      { _id: req.userId, 'experience._id': id },
      { $set: { 'experience.$': updates } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json(user.experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteExperience = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { experience: { _id: id } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
