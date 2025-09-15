class RSVP {
  constructor({
    id = null,
    guest_id,
    response_status = 'PENDING',
    notes = null,
    response_date = null,
    created_at = null,
    updated_at = null
  }) {
    this.id = id;
    this.guest_id = guest_id;
    this.response_status = response_status.toUpperCase();
    this.notes = notes;
    this.response_date = response_date;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Validate RSVP data
  validate() {
    const errors = [];

    // Validate guest_id
    if (!this.guest_id || isNaN(parseInt(this.guest_id))) {
      errors.push('Guest ID is required and must be a valid number');
    }

    // Validate response_status
    const validStatuses = ['PENDING', 'ACCEPTED', 'DECLINED'];
    if (!validStatuses.includes(this.response_status)) {
      errors.push('Response status must be one of: PENDING, ACCEPTED, DECLINED');
    }

    // Validate notes length
    if (this.notes && this.notes.length > 500) {
      errors.push('Notes cannot exceed 500 characters');
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
      responseStatus: this.response_status,
      notes: this.notes,
      responseDate: this.response_date,
      createdAt: this.created_at,
      updatedAt: this.updated_at
    };
  }

  // Create from database row
  static fromRow(row) {
    return new RSVP({
      id: row.id,
      guest_id: row.guest_id,
      response_status: row.response_status,
      notes: row.notes,
      response_date: row.response_date,
      created_at: row.created_at,
      updated_at: row.updated_at
    });
  }

  // Get response status display name
  getStatusDisplayName() {
    const statusMap = {
      'PENDING': 'Chờ phản hồi',
      'ACCEPTED': 'Tham dự',
      'DECLINED': 'Không tham dự'
    };
    return statusMap[this.response_status] || this.response_status;
  }

  // Check if response is late (after event date)
  isLateResponse(eventDate) {
    if (!this.response_date || !eventDate) return false;
    return new Date(this.response_date) > new Date(eventDate);
  }
}

module.exports = RSVP;