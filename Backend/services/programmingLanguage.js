const db = require('./db');
const helper = require('../helper');
// const config = require('../config');

async function getMultiple(){
  // const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT inspecturo_userEmail, inspecturo_userPassword, inspecturo_userId
    FROM inspecturo_users`
  );
  const data = helper.emptyOrRows(rows);
  // const meta = {page};

  return {
    data
  }
}

async function create(programmingLanguage){
  const result = await db.query(
    `INSERT INTO inspecturo_users 
    (inspecturo_userId, inspecturo_userName, inspecturo_userEmail, inspecturo_userPassword) 
    VALUES 
    (${programmingLanguage.id}, "${programmingLanguage.username}", "${programmingLanguage.email}", "${programmingLanguage.password}")`
  );

  let message = 'Error in creating programming language';

  if (result.affectedRows) {
    message = 'Programming language created successfully';
  }

  return {message};
}

async function update(id, programmingLanguage){
  const result = await db.query(
    `UPDATE inspecturo_users 
    SET name="${programmingLanguage.name}", released_year=${programmingLanguage.released_year}, githut_rank=${programmingLanguage.githut_rank}, 
    pypl_rank=${programmingLanguage.pypl_rank}, tiobe_rank=${programmingLanguage.tiobe_rank} 
    WHERE id=${id}` 
  );

  let message = 'Error in updating programming language';

  if (result.affectedRows) {
    message = 'Programming language updated successfully';
  }

  return {message};
}

async function remove(id){
  const result = await db.query(
    `DELETE FROM inspecturo_users WHERE id=${id}`
  );

  let message = 'Error in deleting programming language';

  if (result.affectedRows) {
    message = 'Programming language deleted successfully';
  }

  return {message};
}

module.exports = {
  getMultiple,
  create,
  update,
  remove
}