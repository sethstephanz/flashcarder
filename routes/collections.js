module.exports = function (app) {
  app.get("/collections", (req, res) => {
    res.render("collections");
  });
};
