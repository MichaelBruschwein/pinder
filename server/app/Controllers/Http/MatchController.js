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
            let inMatchTableAsUser1Empty = await Database.query().table('matches').where('user1_id', id).where('user1_approval', null)
            let inMatchTableAsUser2Empty = await Database.query().table('matches').where('user2_id', id).where('user2_approval', null)
            
            //matchesForUser is the quantity of all the rows in the match table that are already made
            let matchesForUser = await Database.query().table('matches').where('user1_id', id).orWhere('user2_id', id)

            // the matches that exist in the table that have not had our user like column filled will show up first
            let userToBeDisplayed;
            if (inMatchTableAsUser1Empty.length > 0) {
                userToBeDisplayed = await User.find(inMatchTableAsUser1Empty[0].user2_id)
            } else if (inMatchTableAsUser2Empty.length > 0) {
                userToBeDisplayed = await User.find(inMatchTableAsUser2Empty[0].user1_id)
            }
            
            //if the match table contains any rows that the user belongs to but hasnt been filled bring those up first
            if (inMatchTableAsUser2Empty.length > 0) {
                response.send({ match: inMatchTableAsUser2Empty[0], userToBeDisplayed, isUserOne: false, userCurrentlyLoggedIn: user })
                return
            } else if (inMatchTableAsUser1Empty.length > 0) {
                response.send({ match: inMatchTableAsUser1Empty[0], userToBeDisplayed, isUserOne: true, userCurrentlyLoggedIn: user })
                return
            } else if (allUsers.length === matchesForUser.length) {//all the rows in matches have already been made so there are no new matches available
                response.send({ message: "empty" })
            } else {
                await this.findUserTwo(id, allUsers, response, user)//begins recursive loop to create new match rows
            }

        } catch (e) {
            response.send(e)
        }
    }

    //Creating new matches rows
    async findUserTwo(id, allUsers, response, user) {
        //Randomly choose a new user
        let randomNumber = Math.floor(Math.random() * allUsers.length)
        let userToBeDisplayed = allUsers[randomNumber]

        //make sure that a row in the matches table hasnt been created for logged in user and the randomly chosen user
        let matchExists1 = await Database.query().table('matches').where('user1_id', id).where('user2_id', userToBeDisplayed.id)
        let matchExists2 = await Database.query().table('matches').where('user1_id', userToBeDisplayed.id).where('user2_id', id)

        //if we have already made a row in the matches table for that pair of users then pick again 
        if (matchExists1.length || matchExists2.length) {
            await this.findUserTwo(id, allUsers, response, user)
        } else { //if we havent then we create a new row in the matches table

            let match = await Match.create({
                user1_id: id,
                user2_id: userToBeDisplayed.id
            })
            response.send({ match, userToBeDisplayed, isUserOne: true, userCurrentlyLoggedIn: user })
        }
    }


    //Function to like and dislike available matches
    async like({ request, response, auth }) {
        try {
            //Get the id of the logged in user
            let user1 = await auth.getUser();
            user1 = user1.id;

            //grab the information needed to change the matches table
            const like = request.input('like');
            const user2 = request.input('user2');
            const isUser2 = request.input('isUser2'); //if the logged in user is user2 on the match table

            let findUserToUpdate = null;
            let matchToUpdate = null;

            if (isUser2) {
                findUserToUpdate = await Database.query().table('matches').where('user1_id', user1).where('user2_id', user2)
                matchToUpdate = await Match.find(findUserToUpdate[0].id)
                matchToUpdate.user1_approval = like
            } else {
                findUserToUpdate = await Database.query().table('matches').where('user1_id', user2).where('user2_id', user1)
                matchToUpdate = await Match.find(findUserToUpdate[0].id)
                matchToUpdate.user2_approval = like
            }

            await matchToUpdate.save()
            
            //check the matches database to see if both users have approved of the match so we can notify
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
    }
    
    // unfinished this currently just returns your user but would need to return all users you are matched with
    // the purpose being to display all the users you are matched with
    async matches({ request, response, auth }) {
        try {
            let user1 = await auth.getUser()
            console.log(user1)
            response.send({ url: user1.url, username: user1.username })
        }
        catch (e) {
            response.send(e)
        }

    }
}
module.exports = MatchController


