export const ownershipMiddleware = (req, res, next) => {
  const loggedInUser = req.user.id;
  const loggedInRole = req.user.role;
  const requestedUser = req.params.userId;

   if (loggedInRole === "admin" || loggedInRole === "coach") {
    return next();
  }

   if (loggedInUser !== requestedUser) {
    return res.status(403).json({
      message: "Forbidden: You cannot access another user's data",
    });
  }

  next();
};
