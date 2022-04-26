// db connection variable
let db;
// establish connection to db with version #
const request=indexedDB.open('budget_tracker',1);


// add the object store

// if database version changes from 1, then...
request.onupgradeneeded = function(event) {
    // set ref to database
    const db = event.target.result;
    // create object store for db budget_tracker
    db.createObjectStore('new_entry',{autoIncrement:true});
}
 // if above successful
request.onsuccess = function(event) {
    db = event.target.result;

    // check if online and run function to send local db to to api
    if(navigator.online) {
        uploadEntry();
    }
};
// if above unsuccessful
request.onerror= function(event) {
    console.log(event.target.errCode);
}

// triggered if information added offline
function saveRecord(record) {
    const transaction=db.transaction(['new_entry', 'readwrite']);

    // set variable for object store placement of new_transaction
    const budgetObjectStore= transaction.budgetObjectStore('new_entry');

    // add new transaction to object store
    budgetObjectStore.add(record);
}

function uploadEntry() {
    // open a transaction on your db
    const transaction = db.transaction(['new_entry'], 'readwrite');

    // access your object store
    const budgetObjectStore = transaction.objectStore('new_entry');

    // get all records from store and set to a variable
    const getAll = budgetObjectStore.getAll();
    // upon a successful .getAll() execution, run this function
        getAll.onsuccess = function () {
            // if there was data in indexedDb's store, let's send it to the api server
            if (getAll.result.length > 0) {
                fetch('/api/transaction', {
                    method: 'POST',
                    body: JSON.stringify(getAll.result),
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(serverResponse => {
                        if (serverResponse.message) {
                            throw new Error(serverResponse);
                        }
                        // open one more transaction
                        const transaction = db.transaction(['new_entry'], 'readwrite');
                        // access the new_entry object store
                        const budgetObjectStore = transaction.objectStore('new_entry');
                        // clear all items in your store
                        budgetObjectStore.clear();

                        alert('All saved transactions have been submitted!');
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        };
    }


// listen for app coming back online
window.addEventListener('online', uploadEntry);