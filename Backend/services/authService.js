const db = require('./db');
const helper = require('../helper');
const bcrypt = require("bcrypt");

exports.verifyEmail = async function(email) {
    const rows = await db.query(
        `SELECT inspecturo_userId
        FROM inspecturo_users where inspecturo_userEmail = \'${email}\' limit 1`
      );

      const data = helper.emptyOrRows(rows);
      
      return {
        data
      }
}
exports.resetPassword = async function(email, pwd) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(pwd, salt);

    const rows = await db.query(
        `Update inspecturo_users
        SET inspecturo_userPassword = \'${password}\' where inspecturo_userEmail = \'${email}\' limit 1`
      );

      const data = helper.emptyOrRows(rows);
      
      return {
        data
      }
}