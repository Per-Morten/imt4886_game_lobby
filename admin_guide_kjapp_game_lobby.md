#Admin usage of Kjapp Game Lobby
Some features are not enabled on the website, so the admin will have to perform them manually.

The only feature that must be fully performed in mongo shell is verification of games added by students.
This is done by changing the "valid" field of the game in question from "false" to "true".

the commands for doing this once mongo shell is running is:
    use kjapp_game_lobby
    db.games.update({ "name" : "<Game Name>" }, { $set: { "valid" : true }}) // Replace <Game Name> (the quotes around is required) with the name of the game you wish to validate.

Naturaly you will need to be logged in to the server where the system is running, and on the account where the database exists to do this.

#Mongo shell cheat sheet

Skrive "mongo" i bash shell for å åpne mongo shell

##Useful commands:
show dbs  //List all databases
use <db>  //Set aktive database
show collections  //List all collections for aktive database
help  //Shows help, like useful commands
db.help() //Shows database commands, not that useful
db.<collection>.help() //Shows collections commands, quite useful


##Basic command structure:
db.<collection>.<command> //db is active database.

##Find all:
db.<collection>.find() //List all entries in <collection>
db.<collection>.find().pretty() //Formated list of all entries in <collection>
###example:
use kjapp_game_lobby
db.matches.find() //List all matches in database
db.matches.find().pretty() //Readable version

##Edit first entry that matches query:
db.<collection>.update(query, update, options) //Updates fields specified in update for first document matching query
###example:
db.matches.update({ "name" : "Demo match" }, { $set: { "name" : "Full match", "playerCount" : 10 }}) //Changes the name and playerCount for the first document where "name" = "Demo match"
db.matches.update({ "name" : "Demo match" }, { $set: { "name" : "Full match", "playerCount" : 10 }}, { multi: true}) //Changes the name and playerCount for all documents where "name" = "Demo match"
db.matches.updateMany({ "name" : "Demo match" }, { $set: { "name" : "Full match", "playerCount" : 10 }}) //Changes the name and playerCount for all documents where "name" = "Demo match"
db.matches.updateMany({ "name" : "Demo match" }, { "name" : "Full match", "playerCount" : 10 }) //DO NOT DO. Changes the document to contain name and playerCount
####NOTE: $set is used for updatig existing fields, if $set is not used the document will only contain the edited fields.

##Insert document(s) into collection
db.<collection>.insert(<document or array of documents>, options)
###example:
db.matches.insert({ "name" : "Test1", "status" : "no", "players" : "no" }) //Inserts one entry in the match collection with name, status, and players fields.
db.matches.insert([{ "name" : "Test1", "status" : "no", "players" : "no" }, { "name" : "Test2", "status" : "no", "players" : "no" }, { "name" : "Test3", "status" : "no", "players" : "no" }]) //Inserts 3 documents.

db.matches.insert([ { "name" : "Test1", "status" : "no", "players" : "no" },
                    { "name" : "Test2", "status" : "no", "players" : "no" },
                    { "name" : "Test3", "status" : "no", "players" : "no" }]) //Slightly more readable

##Remove documents
db.<collection>.remove(query, options)
db.<collection>.deleteOne(query, options)
db.<collection>.deleteMany(query, options)
###example:
db.matches.remove({ "name" : "Demo Match" }, { justOne: true }) //Deletes first entry where "name" = "Demo match"
db.matches.remove({ "name" : "Demo Match" }) //Deletes all entries where "name" = "Demo match"
db.matches.remove({}) //Deletes all entries in match collection
db.matches.deleteOne({ "name" : "Demo Match" }) //Deletes first entry where "name" = "Demo match"
db.matches.deleteMany({ "name" : "Demo Match" }) //Deletes all entries where "name" = "Demo match"

##Drop stuff
db.<collection>.drop() //Drops <collection> deleting the entire collection including indexes
db.dropDatabase() //Deletes whole database. Bad idea.
