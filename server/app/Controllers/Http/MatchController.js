'use strict'
const User = use("App/Models/User")
const Match = use("App/Models/Match")
const Database = use('Database')

class MatchController {
    async match({ request, response, auth }) {
        try {
            //grab our user
            let user = await auth.getUser()
            const id = user.id

            //grab all the users except the logged in user
            let allUsers = await Database.query().table('users').whereNot('id', id)

            //grab the matches that exist in the table where our user hasnt filled the like column
            let user1LoggedInPendingMatches = await Database.query().table('matches').where('user1_id', id).where('user1_approval', null)
            let user2LoggedInPendingMatches = await Database.query().table('matches').where('user2_id', id).where('user2_approval', null)

            //matchesForUser is the quantity of all the users, except us
            let matchesForUser = await Database.query().table('matches').where('user1_id', id).orWhere('user2_id', id)

            // the matches that exist in the table that have not had our user like column filled will show up first
            let userToBeDisplayed;
            if (user1LoggedInPendingMatches.length > 0) {
                userToBeDisplayed = await User.find(user1LoggedInPendingMatches[0].user2_id)
            } else if (user2LoggedInPendingMatches.length > 0) {
                userToBeDisplayed = await User.find(user2LoggedInPendingMatches[0].user1_id)
            }
//remove returns and make sure works
            if (user2LoggedInPendingMatches.length > 0) {
                response.send({ match: user2LoggedInPendingMatches[0], userToBeDisplayed, isUserOne: false, userCurrentlyLoggedIn: user })
                return
            } else if (user1LoggedInPendingMatches.length > 0) {
                response.send({ match: user1LoggedInPendingMatches[0], userToBeDisplayed, isUserOne: true, userCurrentlyLoggedIn: user })
                return
            } else if (allUsers.length === matchesForUser.length) {//all the rows in matches have already been made so there are no new matches available
                response.send({ message: "empty" })
            } else {
                await this.findUserTwo(id, allUsers, response, user)
            }
        } catch (e) {
            response.send('invalid token' + e)
        }
    }

    async findUserTwo(id, allUsers, response, user) {
        let randomNumber = Math.floor(Math.random() * allUsers.length)
        let userToBeDisplayed = allUsers[randomNumber]
        let matchExists1 = await Database.query().table('matches').where('user1_id', id).where('user2_id', userToBeDisplayed.id)
        let matchExists2 = await Database.query().table('matches').where('user1_id', userToBeDisplayed.id).where('user2_id', id)
        if (matchExists1.length || matchExists2.length) {
            await this.findUserTwo(id, allUsers, response, user)
        } else {
            let match = await Match.create({
                user1_id: id,
                user2_id: userToBeDisplayed.id
            })
            response.send({ match, userToBeDisplayed, isUserOne: true, userCurrentlyLoggedIn: user })
        }
    }

    async like({ request, response, auth }) {
        try {
            let user1 = await auth.getUser()
            user1 = user1.id
            const like = request.input('like')
            const user2 = request.input('user2')
            const isUser2 = request.input('isUser2')
            let findUserToUpdate = null
            let matchToUpdate = null
            if (isUser2) {
                findUserToUpdate = await Database.query()
                    .table('matches')
                    .where('user1_id', user1)
                    .where('user2_id', user2)
                matchToUpdate = await Match.find(findUserToUpdate[0].id)
                matchToUpdate.user1_approval = like
            } else {
                findUserToUpdate = await Database.query()
                    .table('matches')
                    .where('user1_id', user2)
                    .where('user2_id', user1)
                matchToUpdate = await Match.find(findUserToUpdate[0].id)
                matchToUpdate.user2_approval = like
            }
            await matchToUpdate.save()
            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            let mutualAproval1 = await Database.query()
                .table('matches')
                .where('user1_id', user1)
                .where('user2_id', user2)
                .where('user1_approval', 1)
                .where('user2_approval', 1)

            let mutualAproval2 = await Database.query()
                .table('matches')
                .where('user1_id', user2)
                .where('user2_id', user1)
                .where('user1_approval', 1)
                .where('user2_approval', 1)

            if (mutualAproval1.length || mutualAproval2.length) {
                response.send({ message: "matched" })
            } else {
                response.send({ message: "not" })
            }
        }
        catch (e) {
            response.send(e)
        }
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>      
    }
    async matches({ request, response, auth }) {
        try {
            let user1 = await auth.getUser()
            console.log(user1)
            response.send({url:user1.url,username:user1.username})
        }
        catch (e) {
            response.send(e)
        }

    }
}
module.exports = MatchController


