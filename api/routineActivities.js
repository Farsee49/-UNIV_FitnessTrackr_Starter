const express = require("express");
const client = require("../db/client");
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  canEditRoutineActivity,
  destroyRoutineActivity,
} = require("../db");
const { requireUser } = require("./utils");
const routineActivitiesRouter = express.Router();
//=====================================================================
// PATCH /api/routine_activities/:routineActivityId

  
//=====================================================================
// DELETE /api/routine_activities/:routineActivityId


module.exports = routineActivitiesRouter;