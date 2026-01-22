import { Request, Response } from 'express';
import Job from '../models/Job';

// Job Controllers
export const createJob = async (req: Request, res: Response) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { 
      search, 
      lat, 
      lng, 
      radius = 10, // Default 10km radius
      category, 
      type, 
      experience, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    const query: any = { status: 'open' };
    
    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Geospatial search
    if (lat && lng) {
      query.coordinates = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(radius) * 1000 // Convert km to meters
        }
      };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (experience) {
      query.experience = experience;
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      total,
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
