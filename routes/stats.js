module.exports = function (app) {
  app.get("/stats", (req, res) => {
    res.render("stats");
  });
};
