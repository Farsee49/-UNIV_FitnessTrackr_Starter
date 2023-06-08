const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try{
     const {rows: [routineActivity]} = await client.query(`

      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES($1, $2, $3, $4)
      ON CONFLICT("routineId", "activityId") DO Nothing
      RETURNING *;
     `,[routineId, activityId, count, duration]);

    //  console.log(results)
    return routineActivity;
  }catch(error){
    console.error('ERROR Adding Activities to Routines !!!',error);
    throw error;
  }
};

async function getRoutineActivityById(id) {
  
};

async function getRoutineActivitiesByRoutine({ id }) {
  
};

async function updateRoutineActivity({ id, ...fields }) {
//   const setString = Object.keys(fields).map(
//     (key, index) => `"${key}"=$${index + 1}`
// ).join(',');

//   try {
//     if (setString.length > 0) {
//    const { rows: [ routine_activity ] } = await client.query(`
//   UPDATE routine_activities
//   SET ${setString}
//   WHERE id=${id}
//   RETURNING *;
// `, Object.values(fields)); 

//   return routine_activity;
//   }
   
//   } catch (error) {
//       throw error;
//   }
};

async function destroyRoutineActivity(id) {
 
};

async function canEditRoutineActivity(routineActivityId, userId) {
  
};

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
