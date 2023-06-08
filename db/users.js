const client = require("./client");
const bcrypt = require("bcrypt");
// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;

  const hashedPwd = await bcrypt.hash(password, SALT_COUNT)
  try {
      const { rows: [ user ]} = await client.query(`
      INSERT INTO users(username, password)
      VALUES($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
      `, [username, hashedPwd]);

      delete user.password; 
     //console.log(result)
      return user;
  } catch (error) {
    console.error('ERROR Creating User!!!',error);
      throw error;
  }
};

async function getUser({ username, password }) {
  try{
  const user = await getUserByUsername(username);
    const hashedPassword = user.password;

    let passwordsMatch = await bcrypt.compare(password, hashedPassword)

    if (passwordsMatch) {
        delete user.password;

        return user;
    }
  }catch(error){
    console.error('ERROR Getting User !!!',error);
    throw error;
  }

};

async function getUserById(id) {
  try {
    const { rows: [ user ] } = await client.query(`
    SELECT *
    FROM users
    WHERE id=$1;
  `, [id]);

  delete user.password;
  //console.log(result) 
    return user
  } catch (error) {
    console.error('ERROR Getting User by Id!!!',error);
      throw error;
  }
};

async function getUserByUsername(username) {
  try {
    const { rows: [ user ] } = await client.query(`
        SELECT *
        FROM users
        WHERE username=$1;
    `, [username]);

//console.log(result)
  return user;
} catch (error) {
    console.error('ERROR Getting User by Username!!!',error)
  throw error;
}
};

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
