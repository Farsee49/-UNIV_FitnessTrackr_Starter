const express = require("express");
const activitiesRouter = express.Router();
const { requireUser } = require('./utils');

const { ActivityExistsError,
  ActivityNotFoundError } = require('../errors');

const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getActivityById,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db");



//=====================================================================
// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;

  try {
    const publicRoutines = await getPublicRoutinesByActivity({ id: activityId });

    if (publicRoutines && publicRoutines.length) {
      res.send(publicRoutines);
      
    } else {
    res.send({
        message: ActivityNotFoundError(activityId),
        name: "Activity Not Found Error",
        error: "Not found"
      });
  }
  } catch ({name, message}) {
    next({name, message})
  }
});


//=====================================================================
// GET /api/activities
activitiesRouter.get('/', async (req, res, next) => {
  try {
    const activities = await getAllActivities()

    if(activities){
      res.send(activities)
  }
    
  } catch ({name, message}) {
    next({name, message})
  }
});


//=====================================================================
// POST /api/activities
activitiesRouter.post('/', async (req, res, next) => {
  const request = req.body;
  try {
    const existingActivity = await getActivityByName(request.name);
    if (!existingActivity) {
      const { name, description } = await createActivity(request);    
      res.send({ name, description });
    } else {
     res.send({
        error: "Duplicates",
        name: "Activity",
        message: ActivityExistsError(req.body.name)
      })
    }
  }catch ({name, message}) {
    next({name, message})
  }
});


//=====================================================================
// PATCH /api/activities/:activityId
activitiesRouter.patch('/:activityId',  async (req, res, next) => {
  const { activityId } = req.params;
 
 try {
  const { name, description } = req.body;
  const updateFields = {};

  if (activityId) {
    updateFields.id = activityId;
  }
  if (name) {
    updateFields.name = name;
  }
  if (description) {
    updateFields.description = description;
  }

  const activityById = await getActivityById(activityId);
  const activityByName = await getActivityByName(name);

  if (!activityById) {
    res.send({
      error: 'ActivityDoesNotExists',
      name: 'Activity does not exists',
      message: ActivityNotFoundError(activityId),
    });
  } else if (activityByName) {
    res.send({
      error: 'ActivityAlreadyExists',
      name: 'Activity already exists',
      message: ActivityExistsError(activityByName.name),
    });
  } else {
    const updateAllActivity = await updateActivity(updateFields);
    res.send(updateAllActivity);
  }
} catch ({ name, message }) {
  next({ name, message });
}
});

module.exports = activitiesRouter;