import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Job } from '@/types/job';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const useJobSocket = (category?: string) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);

    // Join the 'all jobs' room
    socketInstance.emit('watch category', 'all jobs');

    // If a specific category is provided, join that room too
    if (category) {
      socketInstance.emit('watch category', category);
    }

    // Listen for new jobs
    socketInstance.on('new job', (job: Job) => {
      setJobs(prev => [job, ...prev]);
    });

    // Listen for job updates
    socketInstance.on('job updated', (updatedJob: Job) => {
      setJobs(prev => prev.map(job => 
        job.id === updatedJob.id ? updatedJob : job
      ));
    });

    // Listen for job removals
    socketInstance.on('job removed', (jobId: string) => {
      setJobs(prev => prev.filter(job => job.id !== jobId));
    });

    // Listen for job expiry
    socketInstance.on('job expired', (jobId: string) => {
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: 'closed' } : job
      ));
    });

    // Clean up function
    return () => {
      if (category) {
        socketInstance.emit('unwatch category', category);
      }
      socketInstance.emit('unwatch category', 'all jobs');
      socketInstance.disconnect();
    };
  }, [category]);

  // Function to search for jobs with geolocation
  const searchJobs = async (params: {
    lat?: number;
    lng?: number;
    radius?: number;
    category?: string;
    type?: string;
  }) => {
    if (socket) {
      setLoading(true);
      setError(null);
      
      socket.emit('search jobs', params);
      
      socket.once('jobs result', (result: Job[]) => {
        setJobs(result);
        setLoading(false);
      });

      socket.once('jobs error', (err: { message: string }) => {
        setError(err.message);
        setLoading(false);
      });
    }
  };

  return {
    jobs,
    loading,
    error,
    searchJobs
  };
};
