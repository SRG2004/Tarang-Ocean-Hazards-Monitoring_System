/**
 * Real-time Services
 * Handles Socket.IO connections and real-time data streaming
 */

export const initializeRealTimeServices = (io) => {
  console.log('Initializing real-time services...');

  // Set up real-time event handlers
  io.on('connection', (socket) => {
    console.log('Client connected for real-time services:', socket.id);

    // Handle user room joins
    socket.on('join-user-room', (userId) => {
      if (userId) {
        socket.join(`user-${userId}`);
        console.log(`User ${userId} joined personal room`);
      }
    });

    // Handle location-based room joins
    socket.on('join-location-room', (coordinates) => {
      if (coordinates && coordinates.lat && coordinates.lng) {
        const locationRoom = `location-${Math.floor(coordinates.lat)}-${Math.floor(coordinates.lng)}`;
        socket.join(locationRoom);
        console.log(`Client joined location room: ${locationRoom}`);
      }
    });

    // Handle hazard report real-time updates
    socket.on('new-hazard-report', (reportData) => {
      const locationRoom = `location-${Math.floor(reportData.coordinates.lat)}-${Math.floor(reportData.coordinates.lng)}`;
      socket.to(locationRoom).emit('hazard-alert', {
        type: 'new-report',
        data: reportData,
        timestamp: new Date().toISOString()
      });
    });

    // Handle volunteer status updates
    socket.on('volunteer-status-update', (data) => {
      socket.broadcast.emit('volunteer-update', data);
    });

    // Handle donation updates
    socket.on('new-donation', (donationData) => {
      socket.broadcast.emit('donation-update', donationData);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from real-time services:', socket.id);
    });
  });

  console.log('Real-time services initialized successfully');
};

/**
 * Broadcast real-time updates to connected clients
 */
export const broadcastUpdate = (io, event, data, room = null) => {
  if (room) {
    io.to(room).emit(event, data);
  } else {
    io.emit(event, data);
  }
};

/**
 * Send notification to specific user
 */
export const sendUserNotification = (io, userId, notification) => {
  io.to(`user-${userId}`).emit('notification', notification);
};

/**
 * Send location-based alert
 */
export const sendLocationAlert = (io, coordinates, alert) => {
  const locationRoom = `location-${Math.floor(coordinates.lat)}-${Math.floor(coordinates.lng)}`;
  io.to(locationRoom).emit('location-alert', alert);
};
