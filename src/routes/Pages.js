const urlSlug = require('url-slug');

module.exports = function (app, db, config) {

  app.get("/blog/pages", (req, res, next) => {
    db.collection('pages')
      .get()
      .then(snapshot => {
        const results = [];
        snapshot.forEach(postRef => {
          let post = postRef.data();

          post.id = postRef.id;

          post.slug = urlSlug(post.title);

          results.push(post);
        });
        res
          .set('content-type', 'application/json')
          .status(200)
          .send(results);
      })
      .catch(next);
  });
  return app;
};