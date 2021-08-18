module.exports = function (app) {
  app.get("/cards/new", async (req, res) => {
    const user = req.token;
    const { id } = req.params;
    const userId = await User.findById(id);
    res.render("products/new", { userId });
  });
};
