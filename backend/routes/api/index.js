// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require('./session');
const usersRouter = require('./users');
const vehiclesRouter = require('./vehicles');
const invoicesRouter = require('./invoices');
const imagesRouter = require('./images');
const { restoreUser } = require('../../utils/auth');

// GET /api/set-token-cookie
// const { setTokenCookie, restoreUser } = require("../../utils/auth.js");
// const { User } = require("../../db/models");
// router.get("/set-token-cookie", async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: "JJpdez13",
//     },
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

router.use(restoreUser);

// router.get("/restore-user", (req, res) => {
//   return res.json(req.user);
// });

// GET /api/require-auth
// const { requireAuth } = require("../../utils/auth.js");
// router.get("/require-auth", requireAuth, (req, res) => {
//   return res.json(req.user);
// });

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/vehicles', vehiclesRouter);
router.use('/invoices', invoicesRouter);
router.use('/images', imagesRouter);

/************ TEST ROUTE ******************************/

// // POST /api/test
// router.post("/test", function (req, res) {
//     res.json({ requestBody: req.body });
// });

/*********** FETCH FOR TEST ***************************

fetch('/api/test', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "XSRF-TOKEN": `fOB1YgVF-vCL0cRauzGaPVQGoSmUOcyM7IGk`
    },
    body: JSON.stringify({ hello: 'world' })
}).then(res => res.json()).then(data => console.log(data));

/******************************************************/

module.exports = router;
