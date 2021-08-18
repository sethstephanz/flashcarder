module.exports = function (app) {
  app.get("/testRoute", (req, res) => {
    res.render("testRoute");
  });
};
