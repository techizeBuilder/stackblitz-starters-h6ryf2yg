const validateUser = (req, res, next) => {
  const { username, email } = req.body;

  if (!username || username.length < 3) {
    return res.status(400).json({
      message: 'Username is required and should be at least 3 characters long'
    });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      message: 'Valid email is required'
    });
  }

  next();
};

module.exports = validateUser;