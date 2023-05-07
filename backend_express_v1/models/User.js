const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           required: true
 *         email:
 *           type: string
 *           required: true
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - publisher
 *         password:
 *           type: string
 *           required: true
 *       additionalProperties: false
 *     Login:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           required: true
 *         password:
 *           type: string
 *           required: true
 *       additionalProperties: false
 *     UserDetails:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           required: true
 *         email:
 *           type: string
 *           required: true
 *     ForgotPassword:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           required: true
 *       additionalProperties: false
 *     ResetPassword:
 *       type: object
 *       properties:
 *         password:
 *           type: string
 *           required: true
 *       additionalProperties: false
 */
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email address'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email address',
    ],
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  // will skip and proceed to generate salt if password is not modified
  if (!this.isModified('password')) {
    next();
  }
  // higher genSalt Number, higher the load on system; 10 is recommended in documentation
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// sign JSON web token and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// generate & hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // hash token & set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // set expiration time to 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // return the original token (un-hashed)
  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
