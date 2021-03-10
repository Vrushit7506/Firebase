// db.collection('cafes').get() -->  // this is asynchronous request which may take 1 or 2 second more so this can't be stored in variable like const cafes = ....  

// So we do .then() which will execute function when collection is loaded

// So we will be recieving a snapshot of the database in return
// snapshot is basically representation of different data


/*
db.collection('cafes').get().then((snapshot) => {
  console.log(snapshot.docs); <-- returns an array

  snapshot.docs.forEach( doc => {   // to iterate through the data
    console.log(doc.data());
  })
})

*/

const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

// Create element and render cafe
function renderCafe (doc) {
  let li = document.createElement('li');
  let name = document.createElement('span');
  let city = document.createElement('span');
  let cross = document.createElement('div');

  li.setAttribute('data-id', doc.id);  // Just saving the document id in the li attribute

  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = 'x';

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);

  // Deleting The Data

  cross.addEventListener('click', (e) => {
    e.stopPropagation(); // prevents further propagation of the current event in the capturing and bubbling phases.

    let id = e.target.parentElement.getAttribute('data-id');
    
    db.collection('cafes').doc(id).delete();
  })
}

// Getting The Data - The Old Way

// db.collection('cafes').get().then((snapshot) => {

//   snapshot.docs.forEach( doc => {   // to iterate through the data
//     renderCafe(doc);
//   })
// })

// Filter Data 
// where clauses requires 3 parameters - attribute, how to compare, value to find
// You can try where('city', '>', 'K')  all city start with K or higher
// db.collection('cafes').where('city', '==', 'Mumbai').get().then((snapshot) => {

//   snapshot.docs.forEach( doc => {   // to iterate through the data
//     renderCafe(doc);
//   })
// })

// Order Data
// orderBy clauses requires 1 parameter - attribute

// db.collection('cafes').orderBy('city').get().then((snapshot) => {

//   snapshot.docs.forEach( doc => {   // to iterate through the data
//     renderCafe(doc);
//   })
// })

// If you want to use where and order together then

// For the first time it will give error in console because we have not done our indexing
// So for that click on link in the error and create index
// After that it will take a minute to build once enabled reload our site then you can use them together.

// db.collection('cafes').where('city', '==', 'Mumbai').orderBy('name').get().then((snapshot) => {
//   snapshot.docs.forEach( doc => {   // to iterate through the data
//     renderCafe(doc);
//   })
// })


// Getting The Data - In Real Time
// We use method called 'onSnapshot'

db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach( change => {
      // console.log(change.doc.data());
      // console.log(change.type);
      if(change.type == 'added') {
        renderCafe(change.doc);
      }
      else if(change.type == 'removed') {
        let li = document.querySelector('[data-id=' + change.doc.id + ']');
        cafeList.removeChild(li);
      }
    })
})


// Saving The Data

form.addEventListener('submit', (e) => {
  e.preventDefault();  // it prevents the default action in this case it prevents to reload the page on click

  db.collection('cafes').add({
    name: form.name.value,
    city: form.city.value
  });

  form.name.value = '';
  form.city.value = '';
})


// Update Data - update()

// db.collection('cafes').doc('3YkSbcPx2Hvoz5fDLYvC').update({
//   name: 'Greens123'
// })

// Update Data - set ()
// Even if I set city it will update city and leave name empty

// db.collection('cafes').doc('3YkSbcPx2Hvoz5fDLYvC').set({
//   city: 'Goa'
// })
