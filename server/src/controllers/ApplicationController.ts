import { Request, Response } from 'express';
import JobApplication from '../models/JobApplication';
import Job from '../models/Job';
import User from '../models/User';

export const submitApplication = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { jobId } = req.body;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user has already applied
    const existingApplication = await JobApplication.findOne({
      job: jobId,
      applicant: req.userId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new JobApplication({
      job: jobId,
      applicant: req.userId,
      status: 'pending',
      ...req.body
    });

    await application.save();

    // Update user's applications
    await User.findByIdAndUpdate(req.userId, {
      $push: { applications: application._id }
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getApplications = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query: any = { applicant: req.userId };
    
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const applications = await JobApplication.find(query)
      .populate('job')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await JobApplication.countDocuments(query);

    res.json({
      applications,
      total,
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getApplication = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const application = await JobApplication.findOne({
      _id: req.params.id,
      applicant: req.userId
    }).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const withdrawApplication = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const application = await JobApplication.findOneAndUpdate(
      {
        _id: req.params.id,
        applicant: req.userId,
        status: 'pending'
      },
      { $set: { status: 'withdrawn' } },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found or cannot be withdrawn' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
