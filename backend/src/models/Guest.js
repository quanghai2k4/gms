class Guest {
  constructor({
    id = null,
    full_name,
    position = null,
    organization = null,
    phone_number = null,
    email = null,
    created_at = null,
    updated_at = null
  }) {
    this.id = id;
    this.full_name = full_name;
    this.position = position;
    this.organization = organization;
    this.phone_number = phone_number;
    this.email = email;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.full_name || this.full_name.trim() === '') {
      errors.push('Full name is required');
    }

    if (this.phone_number && !this.isValidPhoneNumber(this.phone_number)) {
      errors.push('Invalid phone number format');
    }

    if (this.email && !this.isValidEmail(this.email)) {
      errors.push('Invalid email format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidPhoneNumber(phone) {
    // Vietnamese phone number format: 0xxxxxxxxx or +84xxxxxxxxx
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Convert to JSON for API response
  toJSON() {
    return {
      id: this.id,
      fullName: this.full_name,
      position: this.position,
      organization: this.organization,
      phoneNumber: this.phone_number,
      email: this.email,
      createdAt: this.created_at,
      updatedAt: this.updated_at
    };
  }

  // Create from database row
  static fromRow(row) {
    if (!row) return null;
    return new Guest(row);
  }
}

module.exports = Guest;