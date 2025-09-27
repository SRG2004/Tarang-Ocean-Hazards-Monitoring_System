/**
 * Volunteer Management Routes  
 * Handles volunteer registration, task assignment, and coordination
 */

import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { firestore } from '../config/database.js';

const router = express.Router();

/**
 * POST /api/volunteers/register
 * Register as a volunteer
 */
router.post('/register', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const {
      skills,
      availability,
      experience,
      emergencyContact,
      medicalInfo,
      transportation,
      languagesSpoken,
      certifications,
      motivation,
      commitment
    } = req.body;
    
    // Generate unique volunteer ID
    const volunteerId = `volunteer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create volunteer profile
    const volunteerData = {
      id: volunteerId,
      userId,
      userInfo: {
        name: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone || '',
        location: req.user.location || {}
      },
      profile: {
        skills: skills || [],
        availability: availability || 'weekends',
        experience: experience || 'beginner',
        languagesSpoken: languagesSpoken || ['english'],
        transportation: transportation || 'none',
        commitment: commitment || 'occasional'
      },
      contacts: {
        emergency: emergencyContact || {},
        medical: medicalInfo || {}
      },
      certifications: certifications || [],
      motivation: motivation || '',
      status: 'active',
      verificationStatus: 'pending',
      rating: 0,
      stats: {
        tasksCompleted: 0,
        hoursContributed: 0,
        reliabilityScore: 100,
        lastActive: new Date().toISOString()
      },
      assignedTasks: [],
      taskHistory: [],
      preferences: {
        taskTypes: [],
        maxTasksPerWeek: 3,
        notificationSettings: {
          email: true,
          sms: false,
          push: true
        }
      },
      registrationDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save volunteer profile
    await setDoc(doc(firestore, 'volunteers', volunteerId), volunteerData);
    
    // Update user record to include volunteer status
    await updateDoc(doc(firestore, 'users', userId), {
      role: 'volunteer',
      'volunteer.id': volunteerId,
      'volunteer.status': 'active',
      updatedAt: new Date().toISOString()
    });
    
    // Emit real-time event
    req.io?.emit('new-volunteer-registration', {
      volunteer: {
        id: volunteerId,
        name: volunteerData.userInfo.name,
        skills: volunteerData.profile.skills,
        location: volunteerData.userInfo.location
      }
    });
    
    res.status(201).json({
      message: 'Volunteer registration successful',
      volunteer: volunteerData
    });
    
  } catch (error) {
    console.error('Volunteer registration error:', error);
    res.status(500).json({
      error: 'Failed to register volunteer',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/volunteers
 * Get volunteers with filtering
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      status = 'active',
      skills,
      availability,
      location,
      verificationStatus,
      limit: queryLimit = 50
    } = req.query;
    
    let q = collection(firestore, 'volunteers');
    const constraints = [];
    
    // Apply filters
    constraints.push(where('status', '==', status));
    
    if (verificationStatus) {
      constraints.push(where('verificationStatus', '==', verificationStatus));
    }
    
    if (availability) {
      constraints.push(where('profile.availability', '==', availability));
    }
    
    // Add ordering and limit
    constraints.push(orderBy('registrationDate', 'desc'));
    constraints.push(limit(parseInt(queryLimit)));
    
    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    const volunteers = [];
    
    querySnapshot.forEach((doc) => {
      const volunteer = doc.data();
      
      // Filter by skills if specified
      if (skills) {
        const requiredSkills = skills.split(',').map(s => s.trim().toLowerCase());
        const volunteerSkills = volunteer.profile.skills.map(s => s.toLowerCase());
        const hasRequiredSkills = requiredSkills.some(skill => 
          volunteerSkills.includes(skill)
        );
        if (!hasRequiredSkills) return;
      }
      
      volunteers.push({
        id: doc.id,
        ...volunteer,
        joinedAgo: getTimeAgo(volunteer.registrationDate)
      });
    });
    
    res.json({
      volunteers,
      total: volunteers.length,
      filters: { status, skills, availability, verificationStatus }
    });
    
  } catch (error) {
    console.error('Get volunteers error:', error);
    res.status(500).json({
      error: 'Failed to retrieve volunteers',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/volunteers/tasks
 * Create a new volunteer task
 */
router.post('/tasks',
  authenticateToken,
  authorizeRoles('official', 'admin', 'analyst'),
  async (req, res) => {
    try {
      const {
        title,
        description,
        type,
        priority = 'medium',
        requiredSkills = [],
        location,
        estimatedHours = 2,
        deadline,
        maxVolunteers = 1,
        urgency = 'normal'
      } = req.body;
      
      if (!title || !description || !type) {
        return res.status(400).json({
          error: 'Title, description, and type are required'
        });
      }
      
      // Generate unique task ID
      const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create task
      const taskData = {
        id: taskId,
        title,
        description,
        type: type.toLowerCase(),
        priority: priority.toLowerCase(),
        urgency: urgency.toLowerCase(),
        requiredSkills,
        location: location || {},
        estimatedHours: parseInt(estimatedHours),
        maxVolunteers: parseInt(maxVolunteers),
        deadline: deadline || null,
        status: 'open',
        assignedVolunteers: [],
        applicants: [],
        completedBy: [],
        createdBy: {
          id: req.user.userId || req.user.id,
          name: req.user.fullName,
          role: req.user.role
        },
        metadata: {
          source: 'web_dashboard',
          autoAssign: false,
          publicTask: true
        },
        timeline: [{
          action: 'created',
          timestamp: new Date().toISOString(),
          userId: req.user.userId || req.user.id,
          details: 'Task created and published'
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Auto-escalate critical/urgent tasks
      if (priority === 'critical' || urgency === 'urgent') {
        taskData.status = 'urgent';
        taskData.autoAssign = true;
        taskData.timeline.push({
          action: 'escalated',
          timestamp: new Date().toISOString(),
          details: 'Auto-escalated due to critical priority/urgency'
        });
      }
      
      // Save task
      await setDoc(doc(firestore, 'volunteerTasks', taskId), taskData);
      
      // Find and notify suitable volunteers
      const suitableVolunteers = await findSuitableVolunteers(taskData);
      
      // Emit real-time notifications
      req.io?.emit('new-volunteer-task', {
        task: taskData,
        suitableVolunteers: suitableVolunteers.length
      });
      
      suitableVolunteers.forEach(volunteer => {
        req.io?.to(`user-${volunteer.userId}`).emit('task-opportunity', {
          task: {
            id: taskId,
            title,
            type,
            priority,
            estimatedHours,
            location
          }
        });
      });
      
      res.status(201).json({
        message: 'Volunteer task created successfully',
        task: taskData,
        suitableVolunteers: suitableVolunteers.length
      });
      
    } catch (error) {
      console.error('Create volunteer task error:', error);
      res.status(500).json({
        error: 'Failed to create volunteer task',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * GET /api/volunteers/tasks
 * Get volunteer tasks
 */
router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const {
      status,
      type,
      priority,
      assignedTo,
      available = false,
      limit: queryLimit = 50
    } = req.query;
    
    const userId = req.user.userId || req.user.id;
    const userRole = req.user.role || 'citizen';
    
    let q = collection(firestore, 'volunteerTasks');
    const constraints = [];
    
    // Apply filters
    if (status) {
      constraints.push(where('status', '==', status));
    }
    
    if (type) {
      constraints.push(where('type', '==', type));
    }
    
    if (priority) {
      constraints.push(where('priority', '==', priority));
    }
    
    if (assignedTo) {
      constraints.push(where('assignedVolunteers', 'array-contains', assignedTo));
    }
    
    // Show only available tasks for volunteers
    if (available === 'true' || userRole === 'volunteer') {
      constraints.push(where('status', 'in', ['open', 'urgent']));
    }
    
    // Add ordering and limit
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(parseInt(queryLimit)));
    
    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    const tasks = [];
    
    querySnapshot.forEach((doc) => {
      const task = doc.data();
      
      // Add computed fields
      tasks.push({
        id: doc.id,
        ...task,
        timeAgo: getTimeAgo(task.createdAt),
        spotsRemaining: task.maxVolunteers - task.assignedVolunteers.length,
        isExpired: task.deadline ? new Date(task.deadline) < new Date() : false,
        urgencyScore: calculateTaskUrgency(task)
      });
    });
    
    res.json({
      tasks,
      total: tasks.length,
      filters: { status, type, priority, available }
    });
    
  } catch (error) {
    console.error('Get volunteer tasks error:', error);
    res.status(500).json({
      error: 'Failed to retrieve volunteer tasks',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/volunteers/tasks/:taskId/apply
 * Apply for a volunteer task
 */
router.post('/tasks/:taskId/apply', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.user.userId || req.user.id;
    const { message, availability } = req.body;
    
    // Get task details
    const taskDoc = await getDoc(doc(firestore, 'volunteerTasks', taskId));
    
    if (!taskDoc.exists()) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }
    
    const task = taskDoc.data();
    
    // Check if task is still available
    if (!['open', 'urgent'].includes(task.status)) {
      return res.status(400).json({
        error: 'Task is no longer available for applications'
      });
    }
    
    // Check if already applied
    const alreadyApplied = task.applicants?.some(app => app.userId === userId);
    if (alreadyApplied) {
      return res.status(400).json({
        error: 'Already applied for this task'
      });
    }
    
    // Check if spots available
    if (task.assignedVolunteers.length >= task.maxVolunteers) {
      return res.status(400).json({
        error: 'Task is fully assigned'
      });
    }
    
    // Get volunteer profile
    const volunteerQuery = query(
      collection(firestore, 'volunteers'),
      where('userId', '==', userId)
    );
    const volunteerSnapshot = await getDocs(volunteerQuery);
    
    if (volunteerSnapshot.empty) {
      return res.status(400).json({
        error: 'Volunteer profile not found. Please register as volunteer first.'
      });
    }
    
    const volunteer = volunteerSnapshot.docs[0].data();
    
    // Create application
    const application = {
      userId,
      volunteerInfo: {
        name: req.user.fullName,
        email: req.user.email,
        skills: volunteer.profile.skills,
        rating: volunteer.rating,
        completedTasks: volunteer.stats.tasksCompleted
      },
      message: message || '',
      availability: availability || '',
      appliedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    // Update task with application
    const updatedApplicants = [...(task.applicants || []), application];
    const newTimelineEntry = {
      action: 'application_received',
      timestamp: new Date().toISOString(),
      userId,
      details: `${req.user.fullName} applied for the task`
    };
    
    await updateDoc(doc(firestore, 'volunteerTasks', taskId), {
      applicants: updatedApplicants,
      timeline: [...task.timeline, newTimelineEntry],
      updatedAt: new Date().toISOString()
    });
    
    // Auto-assign if suitable and task is urgent
    if (task.urgency === 'urgent' && task.assignedVolunteers.length === 0) {
      await assignVolunteerToTask(taskId, userId, volunteer, req.io);
    }
    
    // Notify task creator
    req.io?.to(`user-${task.createdBy.id}`).emit('task-application', {
      taskId,
      taskTitle: task.title,
      applicant: {
        name: req.user.fullName,
        skills: volunteer.profile.skills
      }
    });
    
    res.json({
      message: 'Application submitted successfully',
      taskId,
      status: 'pending'
    });
    
  } catch (error) {
    console.error('Apply for task error:', error);
    res.status(500).json({
      error: 'Failed to apply for task',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/volunteers/statistics
 * Get volunteer program statistics
 */
router.get('/statistics', 
  authenticateToken,
  authorizeRoles('official', 'admin', 'analyst'),
  async (req, res) => {
    try {
      const { timeRange = '30d' } = req.query;
      
      // Get volunteers
      const volunteersSnapshot = await getDocs(collection(firestore, 'volunteers'));
      const volunteers = [];
      volunteersSnapshot.forEach(doc => volunteers.push(doc.data()));
      
      // Get tasks
      const tasksSnapshot = await getDocs(collection(firestore, 'volunteerTasks'));
      const tasks = [];
      tasksSnapshot.forEach(doc => tasks.push(doc.data()));
      
      // Calculate statistics
      const stats = {
        volunteers: {
          total: volunteers.length,
          active: volunteers.filter(v => v.status === 'active').length,
          verified: volunteers.filter(v => v.verificationStatus === 'verified').length,
          byAvailability: {},
          bySkills: {},
          averageRating: 0
        },
        tasks: {
          total: tasks.length,
          open: tasks.filter(t => t.status === 'open').length,
          assigned: tasks.filter(t => t.status === 'assigned').length,
          completed: tasks.filter(t => t.status === 'completed').length,
          byType: {},
          byPriority: {}
        },
        engagement: {
          totalHoursContributed: 0,
          averageTasksPerVolunteer: 0,
          completionRate: 0
        }
      };
      
      // Process volunteer statistics
      let totalRating = 0;
      let ratedVolunteers = 0;
      
      volunteers.forEach(volunteer => {
        // Availability breakdown
        const availability = volunteer.profile?.availability || 'unknown';
        stats.volunteers.byAvailability[availability] = 
          (stats.volunteers.byAvailability[availability] || 0) + 1;
        
        // Skills breakdown
        (volunteer.profile?.skills || []).forEach(skill => {
          stats.volunteers.bySkills[skill] = 
            (stats.volunteers.bySkills[skill] || 0) + 1;
        });
        
        // Rating calculation
        if (volunteer.rating > 0) {
          totalRating += volunteer.rating;
          ratedVolunteers++;
        }
        
        // Hours contributed
        stats.engagement.totalHoursContributed += volunteer.stats?.hoursContributed || 0;
      });
      
      stats.volunteers.averageRating = ratedVolunteers > 0 ? totalRating / ratedVolunteers : 0;
      
      // Process task statistics
      tasks.forEach(task => {
        // By type
        const type = task.type || 'unknown';
        stats.tasks.byType[type] = (stats.tasks.byType[type] || 0) + 1;
        
        // By priority
        const priority = task.priority || 'medium';
        stats.tasks.byPriority[priority] = (stats.tasks.byPriority[priority] || 0) + 1;
      });
      
      // Calculate engagement metrics
      stats.engagement.averageTasksPerVolunteer = volunteers.length > 0 
        ? volunteers.reduce((sum, v) => sum + (v.stats?.tasksCompleted || 0), 0) / volunteers.length
        : 0;
      
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const totalAssignedTasks = tasks.filter(t => ['assigned', 'completed'].includes(t.status)).length;
      stats.engagement.completionRate = totalAssignedTasks > 0 
        ? (completedTasks / totalAssignedTasks) * 100
        : 0;
      
      res.json({
        statistics: stats,
        timeRange,
        generatedAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Get volunteer statistics error:', error);
      res.status(500).json({
        error: 'Failed to retrieve volunteer statistics',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Utility functions
async function findSuitableVolunteers(task) {
  try {
    const volunteersSnapshot = await getDocs(
      query(
        collection(firestore, 'volunteers'),
        where('status', '==', 'active'),
        where('verificationStatus', '==', 'verified')
      )
    );
    
    const suitableVolunteers = [];
    
    volunteersSnapshot.forEach((doc) => {
      const volunteer = doc.data();
      
      // Check skill match
      const hasRequiredSkills = task.requiredSkills.length === 0 || 
        task.requiredSkills.some(skill => 
          volunteer.profile.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
        );
      
      // Check availability
      const availabilityMatch = task.urgency === 'urgent' || 
        volunteer.profile.availability !== 'emergency_only';
      
      // Check current workload
      const currentTasks = volunteer.assignedTasks?.length || 0;
      const maxTasks = volunteer.preferences?.maxTasksPerWeek || 3;
      const hasCapacity = currentTasks < maxTasks;
      
      if (hasRequiredSkills && availabilityMatch && hasCapacity) {
        suitableVolunteers.push({
          ...volunteer,
          matchScore: calculateVolunteerMatchScore(volunteer, task)
        });
      }
    });
    
    // Sort by match score
    suitableVolunteers.sort((a, b) => b.matchScore - a.matchScore);
    
    return suitableVolunteers.slice(0, 5); // Return top 5 matches
    
  } catch (error) {
    console.error('Error finding suitable volunteers:', error);
    return [];
  }
}

function calculateVolunteerMatchScore(volunteer, task) {
  let score = 0;
  
  // Skill match score
  const skillMatches = task.requiredSkills.filter(skill =>
    volunteer.profile.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
  ).length;
  score += skillMatches * 25;
  
  // Rating score
  score += volunteer.rating * 2;
  
  // Experience score
  score += volunteer.stats.tasksCompleted;
  
  // Reliability score
  score += (volunteer.stats.reliabilityScore || 100) / 10;
  
  // Recent activity bonus
  const daysSinceActive = (new Date() - new Date(volunteer.stats.lastActive)) / (1000 * 60 * 60 * 24);
  if (daysSinceActive < 7) score += 10;
  
  return Math.round(score);
}

async function assignVolunteerToTask(taskId, userId, volunteer, io) {
  try {
    const taskDoc = await getDoc(doc(firestore, 'volunteerTasks', taskId));
    const task = taskDoc.data();
    
    const assignment = {
      userId,
      volunteerInfo: {
        name: volunteer.userInfo.name,
        email: volunteer.userInfo.email,
        skills: volunteer.profile.skills
      },
      assignedAt: new Date().toISOString(),
      status: 'assigned'
    };
    
    // Update task
    const updatedAssignedVolunteers = [...task.assignedVolunteers, assignment];
    const newTimelineEntry = {
      action: 'assigned',
      timestamp: new Date().toISOString(),
      userId,
      details: `${volunteer.userInfo.name} assigned to task`
    };
    
    await updateDoc(doc(firestore, 'volunteerTasks', taskId), {
      assignedVolunteers: updatedAssignedVolunteers,
      status: updatedAssignedVolunteers.length >= task.maxVolunteers ? 'assigned' : 'open',
      timeline: [...task.timeline, newTimelineEntry],
      updatedAt: new Date().toISOString()
    });
    
    // Update volunteer
    await updateDoc(doc(firestore, 'volunteers', volunteer.id), {
      assignedTasks: [...volunteer.assignedTasks, taskId],
      'stats.lastActive': new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Emit real-time events
    io?.to(`user-${userId}`).emit('task-assigned', {
      taskId,
      taskTitle: task.title,
      assignedAt: assignment.assignedAt
    });
    
  } catch (error) {
    console.error('Error assigning volunteer to task:', error);
  }
}

function calculateTaskUrgency(task) {
  let score = 0;
  
  // Priority scoring
  const priorityScores = { critical: 100, high: 75, medium: 50, low: 25 };
  score += priorityScores[task.priority] || 50;
  
  // Urgency scoring
  if (task.urgency === 'urgent') score += 50;
  
  // Deadline factor
  if (task.deadline) {
    const hoursToDeadline = (new Date(task.deadline) - new Date()) / (1000 * 60 * 60);
    if (hoursToDeadline < 24) score += 30;
    else if (hoursToDeadline < 72) score += 15;
  }
  
  // Unassigned tasks get higher urgency
  if (task.assignedVolunteers.length === 0) score += 25;
  
  return Math.round(score);
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return 'Just now';
}

export default router;