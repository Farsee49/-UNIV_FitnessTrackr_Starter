const express = require('express');
const routinesRouter = express.Router();
const {requireUser} = require("./utils")

const {getRoutineById,
    addActivityToRoutine,
    getAllPublicRoutines,
    createRoutine,
    updateRoutine,
    destroyRoutine,
    getRoutineActivitiesByRoutine
} = require("../db");

const { 
    UnauthorizedError,
    UnauthorizedUpdateError,
    UnauthorizedDeleteError
     } = require('../errors');

//=====================================================================
// GET /api/routines
routinesRouter.get('/', async(req, res, next) => {
    try {
        const routines = await getAllPublicRoutines();

        if(routines){
            res.send(routines)
        }
    } catch ({name, message}) {
        next({name, message})
    }
});

//=====================================================================
// POST /api/routines
routinesRouter.post('/', async (req, res, next) => {
    const { isPublic, name, goal } = req.body;
    user = req.user;
    //console.log(user)
    if (!user) {
      res.send({
        error: "No user found",
        message: UnauthorizedError(),
        name: "Unauthorized Error"
      })
    }
    try {
      const newRoutine = await createRoutine({
        creatorId: req.user.id, 
        isPublic: isPublic,
        name: name,
        goal: goal
      });
      res.send(newRoutine);
    }catch ({name, message}) {
      next({name, message})
    }
  });

//=====================================================================
// PATCH /api/routines/:routineId
routinesRouter.patch('/:routineId', async (req, res, next) => {
    const user = req.user;
    const { routineId } = req.params;
    const { isPublic, name, goal } = req.body;
    const updateFields = { id: routineId };
  
    if (!user) {
     res.send({
        error: "No user found",
        message: UnauthorizedError(),
        name: "Unauthorized Error"
      })};
      if (!isPublic  ||  isPublic) { 
        updateFields.isPublic = isPublic;
      }
    
    if (name) {
      updateFields.name = name;
    }
    if (goal) {
      updateFields.goal = goal;
    }
    try {
      const routine = await getRoutineById(routineId);
      if (user.id !== routine.creatorId) {
        res.status(403);
        res.send({
          error: "Unauthorized to update this routine",
          message: UnauthorizedUpdateError(req.user.username, routine.name),
          name: "Unauthorized Update Error"
        });
    };
  
      const updatedRoutine = await updateRoutine(updateFields);
      res.send(updatedRoutine);
  
    } catch ({name, message}) {
        next({name, message})
    }
  }); 

//=====================================================================
// DELETE /api/routines/:routineId
routinesRouter.delete('/:routineId', async (req, res, next) => {
  const creatorId = req.user.id;
  const { routineId } = req.params;
  try {
    const routine = await getRoutineById(routineId);
    if (creatorId !== routine.creatorId) {
      res.status(403)
      res.send({
        error: "Unauthorized to delete this routine",
        message: UnauthorizedDeleteError(req.user.username, routine.name),
        name: "Unauthorized Delete Error"
      });
    }
    await destroyRoutine(routineId);
    res.send(routine);
  } catch (error) {
    next(error);
  }
});

//=====================================================================
// POST /api/routines/:routineId/activities
routinesRouter.post("/:routineId/activities", async (req, res, next) => {
    const {routineId} = req.params
    const {activityId, count, duration} = req.body
    
    try {
        const routine = await getRoutineById(routineId);
        
        if (routine.creatorId === req.user.id) {
            const updatedActivity = await addActivityToRoutine({ routineId, activityId, count, duration });
            res.send(updatedActivity);
        } else {
            res.status(403);
            res.send({
                error: "error posting routine_activities",
                message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
                name: DuplicateRoutineActivityError(routineId, activityId)
            })
        }
    }  catch ({name, message}) {
        next({name, message})
    }
})

module.exports = routinesRouter;
