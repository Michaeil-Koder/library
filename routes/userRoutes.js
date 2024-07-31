const userControllers = require("./../controllers/userControllers")
const exprees = require("express")
const Router = exprees.Router()

const checkAdmin = require("./../middleware/checkAdmin")
const checkColeader = require("./../middleware/checkColeader")
const checkBodyId = require("./../middleware/checkBodyId")
const checkTokken = require("./../middleware/checkTokken")
const checkId = require("./../middleware/checkId")
const { validatorBody } = require("../validator/registerValidator")

/**
 * @swagger
 * /coffee/user/register:
 *  post:
 *      summary: register user
 *      description: register new user
 *      tags:
 *          - Auth
 *      responses:
 *              '201':
 *                  description: user register successfully
 *              '400':
 *                  description: there is propblem
 */

Router.route("/register")
    .post(validatorBody(), userControllers.create)

/**
 * @swagger
 * /coffee/user/getAll:
 *  get:
 *      summary: getall user
 *      description: get All user And This route is protected
 *      tags:
 *          - User
 *      responses:
 *              '200':
 *                  description: user get successfully
 *              '401':
 *                  description: This route is protected
 */
Router.route("/getAll")
    .get(checkTokken, checkId, checkColeader, userControllers.getAll)

/**
 * @swagger
 * /coffee/user/getMe:
 *  get:
 *      summary: get infrom self user
 *      description: get All user And This route needs authentication
 *      tags:
 *          - User
 *      responses:
 *              '200':
 *                  description: user inform get successfully
 *              '401':
 *                  description: This route needs authentication
 */
Router.route("/getMe")
    .get(checkTokken, checkId, userControllers.getMe)

/**
 * @swagger
 * /coffee/user/login:
 *  post:
 *      summary: login user
 *      description: user insert inform and login site
 *      tags:
 *          - Auth
 *      responses:
 *              '200':
 *                  description: user login successfully
 *              '403':
 *                  description: inform for login incorrect
 */
Router.route("/login")
    .post(userControllers.login)
/**
 * @swagger
 * /coffee/user/logout:
 *  post:
 *      summary: logout user
 *      description: user can logout site
 *      tags:
 *          - Auth
 *      responses:
 *              '200':
 *                  description: user logout successfully
 *              '400':
 *                  description: There is propblem
 */

Router.route("/logout")
    .post(checkTokken, checkId, userControllers.logout)

/**
 * @swagger
 * /coffee/user/{id}/Downgrade:
 *  put:
 *      summary: downgrade user
 *      description: This route is protected
 *      tags:
 *          - User
 *      responses:
 *              '200':
 *                  description: user Downgrade successfully
 *              '401':
 *                  description: This route is protected
 *              '404':
 *                  description: User Not Found
 */
Router.route("/:id/Downgrade")
    .put(checkTokken, checkId, checkColeader, userControllers.Downgrade)



/**
 * @swagger
 * /coffee/user/{id}:
 *  put:
 *      summary: Uplevel user
 *      description: uplevel user With Admin This route is protected
 *      tags:
 *          - User
 *      responses:
 *              '200':
 *                  description: user UpLevel successfully
 *              '401':
 *                  description: This route is protected
 *              '404':
 *                  description: User Not Found
 *  get:
 *      summary: get One user
 *      description: get One user With Admin Or Coleader This route is protected
 *      tags:
 *          - User
 *      responses:
 *              '200':
 *                  description: user UpLevel successfully
 *              '401':
 *                  description: This route is protected
 *              '404':
 *                  description: User Not Found
 *  delete:
 *      summary: delete user
 *      description: Delete user With Admin Or Coleader This route is protected
 *      tags:
 *          - User
 *      responses:
 *              '200':
 *                  description: user UpLevel successfully
 *              '401':
 *                  description: This route is protected
 *              '403':
 *                  description: You No Access
 *              '404':
 *                  description: User Not Found
 */
Router.route("/:id")
    .put(checkTokken, checkId, checkAdmin, userControllers.Uplevel)
    .get(checkTokken, checkId, checkColeader, userControllers.getOne)
    .delete(checkTokken, checkId, checkColeader, userControllers.remove)


module.exports = Router