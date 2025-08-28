// === Constants ===

//This is the root URL of the API
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
//This is the scope of data for the API
const COHORT = "/2506-FTB-CT-WEB-PT"; // Make sure to change this!
//concatenation that creates the full API prefix to use in all requests
const API = BASE + COHORT;

// === State ===

//variable named parties, empty array to hold the parties returned
//from the API
let parties = [];
//variable named selectedParty, empty array to hold the details of the
//selectedParty from the API
let selectedParty;
//variable named rsvps, empty array to hold the rsvp defails from
//the API
let rsvps = [];
//variable named guests, empty array to hold the guest details from the API
let guests = [];

/** Updates state with all parties from the API */
async function getParties() {
  //start of the try/catch error handling block
  try {
    //get request (fetch); await makes the application wait
    // until the request result is returned
    const response = await fetch(API + "/events");
    //turns the JSON body into a JS Object
    const result = await response.json();
    //sets the variable parties to the returned data from the
    // get (fetch) request
    parties = result.data;
    //refresh the page to display new update
    render();
    //catch errors
  } catch (e) {
    //console.log the error if found
    console.error(e);
  }
}

//asynchronous function to create a new Party
async function addParty(partyObj) {
  //beginning of the try/catch error block
  try {
    //await pauses the code flow until a response is returned
    //fetch is a get request that accepts at least 1 argument; can take two
    //*** */`${API}/events` is building a URL that consists of the
    ////concatenated API+events, separated by a backslash
    await fetch(`${API}/events`, {
      //sets the HTTPS method to post
      method: "POST",
      //adds headers to the request; lets the server know that
      //we're dealing with JSON text
      headers: { "Content-Type": "application/json" },
      //converts the JSON text into a string
      body: JSON.stringify(partyObj),
    });
    //pauses the execution until a response is received from getParties
    await getParties();
    //catches error
  } catch (error) {
    //console.log the error if an error is caught
    console.error(error, "Error with /POST");
  }
}

/** Updates state with a single party from the API */

//asynchronous function to retrieve a single party by id
async function getParty(id) {
  //beginning of the try/catch error handling block
  try {
    //await pauses the code flow until a response is returned
    //fetch is a get request that accepts at least 1 argument; can take two
    //(API + "/events/" + id) is building a URL that consists of the
    ////concatenated API+events+id
    const response = await fetch(API + "/events/" + id);
    //turns the JSON body into a JS Object
    const result = await response.json();
    //sets Selected Paty equal to the resulting data from the get request
    selectedParty = result.data;
    //refreshes the page to see the update
    render();
    //catches errors (if any)
  } catch (e) {
    //console logs the error if caught
    console.error(e);
  }
}

//asynchronous function to delete a single party by id
async function deleteParty(id) {
  //beginning of the try/catch error handling
  try {
    //await pauses the code flow until a response is returned
    //fetch is a get request that accepts at least 1 argument; can take two
    //(API + "/events/" + id) is building a URL that consists of the
    ////concatenated API+events+id;
    //{ method: "DELETE" } sends the delete request to the API at the URL specified
    await fetch(`${API}/events/${id}`, { method: "DELETE" });
    //if the selected party and the selected party id equal the same id number
    if (selectedParty && selectedParty.id === id) {
      //set the selected party to null; i.e. clear the section so that the
      //user interface (UI) is no longer showing the data for the deleted party
      selectedParty = null;
    }
    //await the execution of getParties to complete
    await getParties();
    //catch error
  } catch (error) {
    //console log message if error
    console.error("There was an error with /DELETE", error);
  }
}

//asynchoronous function to update a party by id
async function updateParty(id, updatedPartyObj) {
  //beginning of the try/catch error handling block
  try {
    await fetch(`${API}/events/${id}`, {
      //update the data at the URL specified
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPartyObj),
    });
    //if the SelectedParty and the selected party id match the ID
    if (selectedParty && selectedParty.id === id) {
      //await response from getParty by id
      await getParty(id);
      //otherwise
    } else {
      //awaot response from getParties
      await getParties();
    }
    //catch errors (if any)
  } catch (error) {
    //console.log errors (if caught)
    console.error("There was an Error /PUT", error);
  }
}

/** Updates state with all RSVPs from the API */

//see explanations above; function returns the RSVPs
async function getRsvps() {
  try {
    const response = await fetch(API + "/rsvps");
    const result = await response.json();
    rsvps = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all guests from the API */

//see explanation above; function returns a guest list
async function getGuests() {
  try {
    const response = await fetch(API + "/guests");
    const result = await response.json();
    guests = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

// === Components ===

/** Party name that shows more details about the party when clicked */
function PartyListItem(party) {
  const $li = document.createElement("li");

  if (party.id === selectedParty?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
    <a href="#selected">${party.name}</a>
  `;
  $li.addEventListener("click", () => getParty(party.id));
  return $li;
}

/** A list of names of all parties */
function PartyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("parties");

  const $parties = parties.map(PartyListItem);
  $ul.replaceChildren(...$parties);

  return $ul;
}

/** Detailed information about the selected party */
function SelectedParty() {
  if (!selectedParty) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn more.";
    return $p;
  }

  const $party = document.createElement("section");
  $party.innerHTML = `
    <h3>${selectedParty.name} #${selectedParty.id}</h3>
    <time datetime="${selectedParty.date}">
      ${selectedParty.date.slice(0, 10)}
    </time>
    <address>${selectedParty.location}</address>
    <p>${selectedParty.description}</p>
    <GuestList></GuestList>
    <div class="single-actions">
        <a href="#" class="delete" data-id=${selectedParty.id}>Delete</a>
    </div>
  `;
  $party.querySelector("GuestList").replaceWith(GuestList());

  //const $del - stores the element in a variable for later use;
  ////the dollar sign is an indicator of a DOM element
  //$party is a DOM element that represents a single party
  //.querySelector(".delete")
  const $del = $party.querySelector(".delete");
  //When the button is clicked, run this function
  $del.addEventListener("click", async function (event) {
    //prevent the default function, so only the custom code runs
    event.preventDefault();
    //variable named id; converts the string into a number
    ////(event.currentTarget.dataset.id) - reads the value of the custom
    ///data id and returns it as a string;
    const id = Number(event.currentTarget.dataset.id);
    await deleteParty(id);
  });

  //returns the party
  return $party;
}

/** List of guests attending the selected party */
function GuestList() {
  const $ul = document.createElement("ul");
  const guestsAtParty = guests.filter((guest) =>
    rsvps.find(
      (rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedParty.id
    )
  );

  // Simple components can also be created anonymously:
  const $guests = guestsAtParty.map((guest) => {
    const $guest = document.createElement("li");
    $guest.textContent = guest.name;
    return $guest;
  });
  $ul.replaceChildren(...$guests);

  return $ul;
}

function NewPartyForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
            <label for="name">Name</label>
            <input type="text" name="name" id="name" required>
            <label for="date">Date</label>
            <input type="date" name="date" id="date">
            <label for="location">Location</label>
            <input type="text" name="location" id="location">
            <label for="description">Description</label>
            <input type="text" name="description" id="description">
            <button>Add New Party</button>
  `;
  $form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const data = new FormData($form);
    //retrieves the value from the date input field and stores
    //that string in a variable named dateFromForm
    const dateFromForm = data.get("date");
    //new Date(dateFromForm) = creates a JS onject using the date from the form
    ////.toISOString() converts the date to an ISO String, which is a standard
    ////notation string formatted date
    const isoDate = new Date(dateFromForm).toISOString();
    const newPartyObj = {
      name: data.get("name"),
      date: isoDate,
      location: data.get("location"),
      description: data.get("description"),
    };
    await addParty(newPartyObj);
    $form.reset();
  });
  return $form;
}
// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
        <h2>New Party Submission Form</h2>
        <NewPartyForm></NewPartyForm>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <SelectedParty></SelectedParty>
        <NewPartyForm></NewPartyForm>
      </section>
    </main>
  `;

  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("SelectedParty").replaceWith(SelectedParty());
  $app.querySelector("NewPartyForm").replaceWith(NewPartyForm());
}

async function init() {
  await getParties();
  await getRsvps();
  await getGuests();
  render();
}

init();
