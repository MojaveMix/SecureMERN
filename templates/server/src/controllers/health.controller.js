const getHealthStatus = (req, res) => {
  res.json({
    status: 'ok',
    message: 'SecureMERN API is running'
  });
};

module.exports = {
  getHealthStatus
};
