/**
 * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT *
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 * I did it for your convenience using "throw away" credentials so that
 * all features could work out of the box.
 *
 * Untrack secrets.js before pushing your code to public GitHub repository:
 *
 * git rm --cached config/secrets.js
 *
 * If you have already commited this file to GitHub with your keys, then
 * refer to https://help.github.com/articles/remove-sensitive-data
*/

module.exports = {

  db: process.env.MONGODB|| 'mongodb://localhost:27017/expertfinder',

  sessionSecret: process.env.SESSION_SECRET || 'teste',

  sendgrid: {
    user: process.env.SENDGRID_USER || 'hslogin',
    password: process.env.SENDGRID_PASSWORD || 'hspassword00'
  },


  facebook: {
    clientID: process.env.FACEBOOK_ID || '146091488853683',
    clientSecret: process.env.FACEBOOK_SECRET || 'bcf4c7f2dc48eb2805de71514c1b7443',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  linkedin: {
    clientID: process.env.LINKEDIN_ID || '75uqqbf8oexofj',
    clientSecret: process.env.LINKEDIN_SECRET || 'DWW8o68egvqIYbqa',
    callbackURL: '/auth/linkedin/callback',
    scope: ['r_fullprofile'],
    passReqToCallback: true
  },
};
