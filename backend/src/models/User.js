class User {
  constructor(id, username, email, passwordHash, role, isActive, createdAt, updatedAt) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDatabase(row) {
    return new User(
      row.id,
      row.username,
      row.email,
      row.password_hash,
      row.role,
      Boolean(row.is_active),
      row.created_at,
      row.updated_at
    );
  }

  toJSON(includePassword = false) {
    const user = {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    if (includePassword) {
      user.passwordHash = this.passwordHash;
    }

    return user;
  }

  toPublicJSON() {
    return {
      id: this.id,
      username: this.username,
      role: this.role
    };
  }
}

module.exports = User;