const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const {
    getUserById
  } = require("../db");
  
//=====================================================================
// GET /api/health
router.get('/health', async (req, res, next) => {
  res.send(
    { message: "Server Online" }
  );
});


//=====================================================================
// JSON TOKEN
router.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});


//=====================================================================
// ROUTERS 
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

//=====================================================================
//ERRORS

router.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message
  });
  next()
});



router.use("*", (req, res, next) => {
  res.status(404).send(
    { message: 'Error, can not find that page!' }
  )
});

module.exports = router;