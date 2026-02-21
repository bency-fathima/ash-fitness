export const validate=(schema)=> {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) { 
      return res.status(400).json({
        message: err.message ?? "Validation Failed Check all data",
        errors: err.issues,
      });
    }
  };
}
