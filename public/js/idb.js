// db connection variable
let db;
// establish connection to db with version #
const request=indexedDB.open('budget_tracker',1);


// add the object store

// if database version changes from 1, then...
request.onupgradeneeded = function(e) {
    // set ref to database
    const db = e.target.result;
    // create object store for db budget_tracker
    db.createObjectStore('budget_tracker',{autoIncrement:true});
}
 // if above successful
request.onsuccess = function(e) {
    db = e.target.result;

    // check if online and run function to send local db to to api
    if(navigator.online) {
        sendTransaction();
    }
};
// if above unsuccessful
request.onerror= function(e) {
    console.log(e.target.errCode);
}

// triggered if information added offline
function saveRecord(record) {
    const transaction=db.transaction(['new_entry', 'readwrite']);

    // set variable for object store placement of new_transaction
    const budgetObjectStore= transaction.budgetObjectStore('new_entry');

    // add new transaction to object store
    budgetObjectStore.add(record);
}
