class QRCode {
  constructor(id, guestId, token, qrImagePath, isActive, expiresAt, createdAt, updatedAt) {
    this.id = id;
    this.guestId = guestId;
    this.token = token;
    this.qrImagePath = qrImagePath;
    this.isActive = isActive;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDatabase(row) {
    return new QRCode(
      row.id,
      row.guest_id,
      row.token,
      row.qr_image_path,
      Boolean(row.is_active),
      row.expires_at,
      row.created_at,
      row.updated_at
    );
  }

  toJSON() {
    return {
      id: this.id,
      guestId: this.guestId,
      token: this.token,
      url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invitation/${this.token}`,
      qrImageUrl: `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/v1/qr/image/${this.token}`,
      qrImagePath: this.qrImagePath,
      isActive: this.isActive,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = QRCode;