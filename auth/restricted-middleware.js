module.exports = (req, res, next) => {
  try {
    req.session && req.user
      ? next()
      : res.status(401).json({ message: "Invalid Credentials." });
  } catch (err) {
    res.status(500).json(err);
  }
}
