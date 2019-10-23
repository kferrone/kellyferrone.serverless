const urlSlug = require('url-slug');
const excerptHtml = require('excerpt-html');

module.exports = function (app, db, config) {

  app.get("/blog/posts", (req, res, next) => {
    db.collection('posts')
      .get()
      .then(snapshot => {
        const results = [];
        snapshot.forEach(postRef => {
          let post = postRef.data();
          console.log('The post id is ', post);

          post.id = postRef.id;

          post.exerpt = excerptHtml(post.content, {
            moreRegExp: /\s*<!--\s*more\s*-->/i, // Search for the slug
            stripTags: true, // Set to false to get html code
            pruneLength: 140, // Amount of characters that the excerpt should contain
            pruneString: '...', // Character that will be added to the pruned string
            pruneSeparator: ' ', // Separator to be used to separate words
          });

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

  app.post("/blog/post", (req, res) => {
	res
          .set('content-type', 'application/json')
          .status(200)
          .send({
			  msg: "Something posted!"
		  });
  });

  app.get("/blog/posts/:postID/comments", (req, res, next) => {
    db.collection('posts')
      .doc(req.params.postID)
      .collection('comments')
      .get()
      .then((snapshot) => {
        const results = [];
        snapshot.forEach(commentRef => {
          results.push(commentRef.data());
        });
      })
      .catch(next);
  });

  return app;
};