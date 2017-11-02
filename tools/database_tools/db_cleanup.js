print('Cleaning stale matches...');
let date = new Date();
let daysToDeletion = 1;
let deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

var db = db.getSiblingDB('kjapp_game_lobby');
db.getMongo().setSlaveOk();

let matches = db.matches.find({});
let matchesForDeletion = [];
matches.forEach(element => {
    if(element._id.getTimestamp() < deletionDate) {
        matchesForDeletion.push(element);
    }
});

print(`Deleting ${matchesForDeletion.length} stale entries from the DB`);
matchesForDeletion.forEach(element => {
    db.matches.remove({_id: element._id});
});
