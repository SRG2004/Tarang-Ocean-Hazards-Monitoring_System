import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  query,
  orderBy,
  where,
  limit 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const volunteerService = {
  // Register volunteer
  async registerVolunteer(volunteerData) {
    try {
      const volunteer = {
        ...volunteerData,
        id: `volunteer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        registrationDate: new Date().toISOString(),
        status: 'active',
        verificationStatus: 'pending',
        assignedTasks: [],
        completedTasks: 0,
        rating: 0,
        availability: volunteerData.availability || 'weekends',
        skills: volunteerData.skills || '',
        emergencyContact: volunteerData.emergencyContact || {},
        location: volunteerData.location || {}
      };

      const docRef = await addDoc(collection(db, 'volunteers'), volunteer);
      return { success: true, volunteerId: docRef.id, data: volunteer };
    } catch (error) {
      console.error('Error registering volunteer:', error);
      throw error;
    }
  },

  // Get volunteers
  async getVolunteers(filters = {}) {
    try {
      let q = collection(db, 'volunteers');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.availability) {
        q = query(q, where('availability', '==', filters.availability));
      }
      if (filters.verificationStatus) {
        q = query(q, where('verificationStatus', '==', filters.verificationStatus));
      }

      q = query(q, orderBy('registrationDate', 'desc'));

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const volunteers = [];
      querySnapshot.forEach((doc) => {
        volunteers.push({ id: doc.id, ...doc.data() });
      });

      return volunteers;
    } catch (error) {
      console.error('Error getting volunteers:', error);
      throw error;
    }
  },

  // Create task
  async createTask(taskData) {
    try {
      const task = {
        ...taskData,
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        status: 'open',
        priority: taskData.priority || 'medium',
        assignedVolunteers: [],
        requiredSkills: taskData.requiredSkills || [],
        location: taskData.location || {},
        deadline: taskData.deadline,
        estimatedHours: taskData.estimatedHours || 1,
        description: taskData.description || '',
        completedAt: null
      };

      const docRef = await addDoc(collection(db, 'volunteerTasks'), task);
      return { success: true, taskId: docRef.id, data: task };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Assign task to volunteer
  async assignTask(taskId, volunteerId) {
    try {
      // Update task
      const taskRef = doc(db, 'volunteerTasks', taskId);
      await updateDoc(taskRef, {
        status: 'assigned',
        assignedVolunteers: [volunteerId],
        assignedAt: new Date().toISOString()
      });

      // Update volunteer
      const volunteerRef = doc(db, 'volunteers', volunteerId);
      const volunteer = await this.getVolunteerById(volunteerId);
      const updatedTasks = [...(volunteer.assignedTasks || []), taskId];
      
      await updateDoc(volunteerRef, {
        assignedTasks: updatedTasks,
        lastTaskAssigned: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      console.error('Error assigning task:', error);
      throw error;
    }
  },

  // Complete task
  async completeTask(taskId, completionData = {}) {
    try {
      const taskRef = doc(db, 'volunteerTasks', taskId);
      await updateDoc(taskRef, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        completionNotes: completionData.notes || '',
        completionRating: completionData.rating || 5
      });

      // Update volunteer completion count
      const task = await this.getTaskById(taskId);
      if (task.assignedVolunteers && task.assignedVolunteers.length > 0) {
        const volunteerId = task.assignedVolunteers[0];
        const volunteer = await this.getVolunteerById(volunteerId);
        
        const volunteerRef = doc(db, 'volunteers', volunteerId);
        await updateDoc(volunteerRef, {
          completedTasks: (volunteer.completedTasks || 0) + 1,
          lastTaskCompleted: new Date().toISOString()
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },

  // Get tasks
  async getTasks(filters = {}) {
    try {
      let q = collection(db, 'volunteerTasks');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.priority) {
        q = query(q, where('priority', '==', filters.priority));
      }
      if (filters.assignedTo) {
        q = query(q, where('assignedVolunteers', 'array-contains', filters.assignedTo));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });

      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  },

  // Get volunteer by ID
  async getVolunteerById(volunteerId) {
    try {
      const volunteers = await this.getVolunteers();
      return volunteers.find(v => v.id === volunteerId) || null;
    } catch (error) {
      console.error('Error getting volunteer by ID:', error);
      return null;
    }
  },

  // Get task by ID
  async getTaskById(taskId) {
    try {
      const tasks = await this.getTasks();
      return tasks.find(t => t.id === taskId) || null;
    } catch (error) {
      console.error('Error getting task by ID:', error);
      return null;
    }
  },

  // Get volunteer statistics
  async getVolunteerStats() {
    try {
      const volunteers = await this.getVolunteers();
      const tasks = await this.getTasks();

      const stats = {
        totalVolunteers: volunteers.length,
        activeVolunteers: volunteers.filter(v => v.status === 'active').length,
        pendingVerification: volunteers.filter(v => v.verificationStatus === 'pending').length,
        totalTasks: tasks.length,
        openTasks: tasks.filter(t => t.status === 'open').length,
        assignedTasks: tasks.filter(t => t.status === 'assigned').length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        availabilityBreakdown: {
          weekends: 0,
          weekdays: 0,
          fullTime: 0,
          emergency: 0
        }
      };

      // Calculate availability breakdown
      volunteers.forEach(volunteer => {
        const availability = volunteer.availability?.toLowerCase() || 'weekends';
        if (stats.availabilityBreakdown.hasOwnProperty(availability)) {
          stats.availabilityBreakdown[availability]++;
        } else if (availability.includes('weekend')) {
          stats.availabilityBreakdown.weekends++;
        } else if (availability.includes('weekday')) {
          stats.availabilityBreakdown.weekdays++;
        } else if (availability.includes('full')) {
          stats.availabilityBreakdown.fullTime++;
        } else {
          stats.availabilityBreakdown.emergency++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting volunteer stats:', error);
      return {
        totalVolunteers: 0,
        activeVolunteers: 0,
        pendingVerification: 0,
        totalTasks: 0,
        openTasks: 0,
        assignedTasks: 0,
        completedTasks: 0,
        availabilityBreakdown: { weekends: 0, weekdays: 0, fullTime: 0, emergency: 0 }
      };
    }
  },

  // Find suitable volunteers for a task
  async findSuitableVolunteers(taskData) {
    try {
      const volunteers = await this.getVolunteers({ 
        status: 'active', 
        verificationStatus: 'verified' 
      });

      const suitable = volunteers.filter(volunteer => {
        // Check availability match
        const taskUrgency = taskData.priority === 'critical' ? 'emergency' : 'normal';
        const volunteerAvailable = volunteer.availability?.toLowerCase() || 'weekends';
        
        if (taskUrgency === 'emergency' && !volunteerAvailable.includes('emergency')) {
          return false;
        }

        // Check skill match
        if (taskData.requiredSkills && taskData.requiredSkills.length > 0) {
          const volunteerSkills = (volunteer.skills || '').toLowerCase();
          const hasRequiredSkills = taskData.requiredSkills.some(skill => 
            volunteerSkills.includes(skill.toLowerCase())
          );
          if (!hasRequiredSkills) return false;
        }

        // Check current workload
        const currentTasks = volunteer.assignedTasks?.length || 0;
        if (currentTasks >= 3) return false; // Max 3 concurrent tasks

        return true;
      });

      // Sort by rating and completion rate
      suitable.sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        const completionA = a.completedTasks || 0;
        const completionB = b.completedTasks || 0;
        
        return (ratingB + completionB) - (ratingA + completionA);
      });

      return suitable.slice(0, 5); // Return top 5 candidates
    } catch (error) {
      console.error('Error finding suitable volunteers:', error);
      return [];
    }
  }
};