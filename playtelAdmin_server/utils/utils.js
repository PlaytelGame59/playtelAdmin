// utils page
// utils.js
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Configure nodemailer transporter (replace with your email service credentials)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_email_password',
    },
});

exports.sendPasswordResetEmail = async (userId, newPassword) => {
    try {
        // Fetch user's email from the database (replace with your own logic)
        const user = await Admin.findById(userId);
        const userEmail = user.email;

        // Create email content
        const mailOptions = {
            from: 'your_email@gmail.com',
            to: userEmail,
            subject: 'Password Reset',
            text: `Your password has been reset. Your new password is: ${newPassword}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

exports.generateRandomPassword = () => {
    // Generate a random temporary password (adjust as needed)
    const length = 10;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newPassword = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        newPassword += charset[randomIndex];
    }

    return newPassword;
};
