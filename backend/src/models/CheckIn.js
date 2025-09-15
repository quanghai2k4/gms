class CheckIn {
  constructor({
    id = null,
    guest_id,
    check_in_time = null,
    check_in_by = null,
    notes = null,
    created_at = null,
    updated_at = null
  }) {
    this.id = id;
    this.guest_id = guest_id;
    this.check_in_time = check_in_time;
    this.check_in_by = check_in_by;
    this.notes = notes;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Validate check-in data
  validate() {
    const errors = [];

    // Validate guest_id
    if (!this.guest_id || isNaN(parseInt(this.guest_id))) {
      errors.push('Guest ID is required and must be a valid number');
    }

    // Validate check_in_by if provided
    if (this.check_in_by && (isNaN(parseInt(this.check_in_by)) || parseInt(this.check_in_by) <= 0)) {
      errors.push('Checked in by must be a valid user ID');
    }

    // Validate notes length
    if (this.notes && this.notes.length > 500) {
      errors.push('Notes cannot exceed 500 characters');
    }

    // Validate check_in_time format
    if (this.check_in_time && isNaN(Date.parse(this.check_in_time))) {
      errors.push('Check-in time must be a valid date');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to JSON format for API responses
  toJSON() {
    return {
      id: this.id,
      guestId: this.guest_id,
      checkInTime: this.check_in_time,
      checkedInBy: this.check_in_by,
      notes: this.notes,
      createdAt: this.created_at,
      updatedAt: this.updated_at
    };
  }

  // Create from database row
  static fromRow(row) {
    return new CheckIn({
      id: row.id,
      guest_id: row.guest_id,
      check_in_time: row.check_in_time,
      check_in_by: row.check_in_by,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at
    });
  }

  // Check if check-in is on time (within event timeframe)
  isOnTime(eventStartTime, eventEndTime) {
    if (!this.check_in_time || !eventStartTime) return false;
    
    const checkInDate = new Date(this.check_in_time);
    const startDate = new Date(eventStartTime);
    const endDate = eventEndTime ? new Date(eventEndTime) : new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Default 24h event
    
    return checkInDate >= startDate && checkInDate <= endDate;
  }

  // Get formatted check-in time
  getFormattedCheckInTime(locale = 'vi-VN') {
    if (!this.check_in_time) return null;
    
    return new Date(this.check_in_time).toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}

module.exports = CheckIn;