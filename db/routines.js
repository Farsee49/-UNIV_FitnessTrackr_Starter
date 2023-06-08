const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");



async function createRoutine({ creatorId, isPublic, name, goal }) {
  try{
    const { rows: [routine] } = await client.query(`

    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `,[creatorId, isPublic, name, goal]);

  //console.log(results)
    return routine;
  }catch(error){
    console.error('ERROR Creating Routine!!!',error);
    throw error;
  }
};

async function getRoutineById(id) {
  try{
    const { rows: [routine] } = await client.query(`

    SELECT * 
    FROM routines
    WHERE id = $1;
    `,[id]);
    //console.log(results)
    return routine;
  }catch(error){
    console.error('ERROR Getting Routine by Id!!!',error);
    throw error;
  }
};

async function getRoutinesWithoutActivities() {
  try{
    const {rows} = await client.query(`

     SELECT * FROM routines;
    `);

    //console.log(results)
    return rows;

  }catch(error){
    console.error('ERROR Getting Routines Without Activities!!!',error);
    throw error;
  }
};

async function getAllRoutines() {
  try {
		const { rows: routines } = await client.query(`

      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id;
      `);

    //console.log(results)
		return attachActivitiesToRoutines(routines);
	} catch (error) {
		console.error("ERROR Getting All Routines!!!", error);
		throw error;
	}
 
};


async function getAllPublicRoutines() {
  try {
		const { rows: routines } = await client.query(`

      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE "isPublic" = true;
      `);

    // console.log(results)
		return attachActivitiesToRoutines(routines);
	} catch (error) {
		console.error("ERROR Getting Public Routines!!!", error);
		throw error;
	}
};

async function getAllRoutinesByUser({ username }) {
  try{
    const { rows: routines } = await client.query(`

    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users on routines."creatorId" = users.id
    WHERE username = $1;
    `,[username]);

    //console.log(results)
  return attachActivitiesToRoutines(routines);
  }catch(error){
    console.error('ERROR Getting All Public Routines!!!',error);
  }
};

async function getPublicRoutinesByUser({ username }) {
  try{
    const { rows: routines } = await client.query(`

    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users on routines."creatorId" = users.id
    WHERE username = $1 AND "isPublic" = true;
    `,[username]);

    // console.log(results)
  return attachActivitiesToRoutines(routines);
  }catch(error){
    console.error('ERROR Getting All Routines By User!!!',error)
  }
};

async function getPublicRoutinesByActivity({ id }) {
  try{
    const { rows: routines } = await client.query(`

    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    JOIN routine_activities ON routine_activities."routineId" = routines.id
    WHERE routines."isPublic" = true AND routine_activities."activityId" = $1;
    `,[id]);

     //console.log(results)
  return attachActivitiesToRoutines(routines);
  }catch(error){
    console.error('ERROR Getting Public Routines by ACTIVITY!!!',error)
  }
};

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
    ).join(',') 
    try {
    if (setString.length > 0){
      await client.query(`
      UPDATE routines
      SET ${setString}
      WHERE id = ${id}
      RETURNING *;
      `, Object.values(fields)) 
    }
 
     return await getRoutineById(id)
  }catch(error){
    console.error('ERROR Updating Routine!!!',error);
    throw error;
  }
};

async function destroyRoutine(id) {
  try {
		await client.query(
			`
      DELETE FROM routine_activities
      WHERE "routineId" = $1
      RETURNING *;
      `,[id]);
  
		const {rows: [routine] } = await client.query(`

       DELETE FROM routines
       WHERE id = $1
       RETURNING *;
       `,[id]);
  
		return routine;
	} catch (error) {
		console.error("ERROR Destroying Routine!!!", error);
		throw error;
	}
};


module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
