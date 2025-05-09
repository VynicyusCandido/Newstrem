const express = require('express');
const router = express.Router();

router.get('/tema', (req, res) => {
  res.render('tema');  // chama o tema.ejs na pasta views
});

module.exports = router;
