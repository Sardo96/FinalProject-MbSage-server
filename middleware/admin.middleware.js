const isAdmin = (req, res, next) => {
  const userRole = req.payload.role;

  if (userRole !== 'admin') {
    return res
      .status(403)
      .json({ message: 'You are not authorized as an admin' });
  }

  next();
};

module.exports = {
  isAdmin
};
