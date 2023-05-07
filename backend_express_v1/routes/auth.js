const express = require('express');

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
  getLogin,
  getRegister,
  getForgotPassword,
  getResetPassword,
} = require('../controllers/auth');

const router = express.Router();

// use protect
const { protect } = require('../middleware/auth');

/**
 * @openapi
 * tags:
 *   name: Authorization
 *   description: APIs to perform authorization operations on users
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authorization
 *     description: Register a new user. User needs to login (under "Authorization") before executing this endpoint.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/User'
 *     responses:
 *       200:
 *         description: Success
 *       401: 
 *         description: User not authorized to access this route
 */
router
  .route('/register')
  .get(getRegister)
  .post(register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authorization
 *     description: Login a new user. User needs to login (under "Authorization") before executing this endpoint.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/Login'
 *     responses:
 *       200:
 *         description: Success
 */
router
  .route('/login')
  .get(getLogin)
  .post(login);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   get:
 *     tags:
 *       - Authorization
 *     description: Logout the currently logged in user.
 *     responses:
 *       200:
 *         description: Success
 */
router
  .route('/logout')
  .get(logout);

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     tags:
 *       - Authorization
 *     description: Retrieve the details of the currently logged in user from the database.
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         User not authorized to access this route
 */
router
  .route('/me')
  .get(protect, getMe);

/**
 * @openapi
 * /api/v1/auth/forgotpassword:
 *   post:
 *     tags:
 *       - Authorization
 *     description: Send the email for resetting the password to the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPassword'
 *     responses:
 *       201:
 *         description: Success
 */
router
  .route('/forgotpassword')
  .get(getForgotPassword)
  .post(forgotPassword);

router
  .route('/resetpassword')
  .get(getResetPassword);

/**
 * @openapi
 * /api/v1/auth/resetpassword/{resettoken}:
 *   put:
 *     tags:
 *       - Authorization
 *     description: Send the email for resetting the password to the database.
 *     parameters:
 *       - in: path
 *         name: resettoken
 *         description: Password reset token
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Success
 */
router
  .route('/resetpassword/:resettoken')
  .put(resetPassword);

/**
 * @openapi
 * /api/v1/auth/updatedetails:
 *   put:
 *     tags:
 *       - Authorization
 *     description: Update the details of the currently logged in user.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDetails'
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       401: 
 *         description: User not authorized to access this route
 */
router
  .route('/updatedetails')
  .put(protect, updateDetails);

/**
 * @openapi
 * /api/v1/auth/updatepassword:
 *   put:
 *     tags:
 *       - Authorization
 *     description: Update the details of the currently logged in user.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDetails'
 *     responses:
 *       200:
 *         description: Success
 *       401: 
 *         description: User not authorized to access this route
 */
router
  .route('/updatepassword')
  .put(protect, updatePassword);

module.exports = router;
