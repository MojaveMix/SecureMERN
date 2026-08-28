const getHealthStatus = (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'SecureMERN API is running'
  });
};

module.exports = {
  getHealthStatus
};
