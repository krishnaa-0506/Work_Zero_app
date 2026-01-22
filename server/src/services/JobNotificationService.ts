import { Server } from 'socket.io';

export class JobNotificationService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public async notifyNewJob(job: any) {
    this.io.to(`category:${job.category}`).emit('new job', job);
    this.io.to(`all jobs`).emit('new job', job);
  }

  public async notifyJobUpdate(job: any) {
    this.io.to(`category:${job.category}`).emit('job updated', job);
    this.io.to(`all jobs`).emit('job updated', job);
  }

  public async notifyJobRemoval(jobId: string, category: string) {
    this.io.to(`category:${category}`).emit('job removed', jobId);
    this.io.to(`all jobs`).emit('job removed', jobId);
  }

  public async notifyJobApplicationUpdate(userId: string, jobId: string, status: string) {
    this.io.to(`user:${userId}`).emit('application update', {
      jobId,
      status
    });
  }

  public async notifyJobExpiry(job: any) {
    this.io.to(`category:${job.category}`).emit('job expired', job.id);
    this.io.to(`all jobs`).emit('job expired', job.id);
  }
}
