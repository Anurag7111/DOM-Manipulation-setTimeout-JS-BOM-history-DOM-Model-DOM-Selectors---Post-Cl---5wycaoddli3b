import {fetchMovieAvailability,fetchMovieList} from "./api.js";

// var loader = document.getElementById('loader');
// var main = document.getElementById("main");
// console.log(main)
// loader.addEventListener('load', myFunction)
// // var setT;
// function myFunction() {
//     console.log("myFunction");
//     const setTimeOut = setTimeout(showPage, 3000);
//     // setT = setTimeout(showPage, 3000);
// }

// function showPage() {
//     console.log('showPage');
//     main.style.display = "block";
//     loader.style.display = "none";
// }


let count = 0;
const movieholder = document.getElementById('movie-holder');

const list = await fetchMovieList();
console.log(list);

for (let i=0; i<list.length; i++) {

    var link =  list[i].imgUrl;
    // console.log(link);
    
    var h4 = document.createElement('h4');
    h4.innerHTML = list[i].name;
    // console.log(h4);

    var movieImg = document.createElement('div');
    movieImg.setAttribute('class', 'movie-img-wrapper');

    movieImg.setAttribute("style", "background-image: url("+link+");background-size: cover");
    
    var movieData = document.createElement('div');
    movieData.addEventListener('click', showAvail);
    movieData.setAttribute('class', 'movie');
    movieData.setAttribute('id', `${i}`);
    movieData.setAttribute('data-d', list[i].name);
    movieData.appendChild(movieImg);
    movieData.appendChild(h4);

    var a = document.createElement('a');
    a.setAttribute('class', 'movie-link');
    // a.setAttribute('href', "#");
    a.appendChild(movieData);

    movieholder.appendChild(a);

}

async function showAvail(event) {
    console.log("One poster is clicked")
    var movieName = event.path[1].id;
    console.log('movieName: '+movieName)
    var i = parseInt(movieName);
    // console.log(typeof(i));
    
    const seats = await fetchMovieAvailability(list[i].name);
    console.log(seats);

    const booker = document.getElementById('booker')
    booker.classList.remove('d-none');
    let localStorageData = JSON.parse(localStorage.getItem('previous'));
    // console.log("localStorageData "+localStorageData)

    if (count > 0) {
        for(let x=0; x<localStorageData.length; x++){
            document.getElementById(`booking-grid-${seats[x]}`).classList.add('available-seat');
        }
    }

    for (let k=0; k<24; k++) {
        var bookingGrid = document.getElementById(`booking-grid-${k+1}`)
        // console.log(bookingGrid);
        if(count > 0) {
            if (bookingGrid.classList.contains('available-seat')){
                bookingGrid.classList.remove('available-seat')
            }
        }
        bookingGrid.classList.add('unavailable-seat');
        // console.log(bookingGrid);
    }

    let arr = [];
    
    for(let j=0; j<seats.length; j++) {
        var bookingGrid = document.getElementById(`booking-grid-${seats[j]}`)
        arr.push(seats[j]);
        console.log(seats[j]);
        // if (bookingGrid.classList.contains('unavailable-seat')){
        //     bookingGrid.classList.remove('unavailable-seat')
        // }
        document.getElementById(`booking-grid-${seats[j]}`).classList.add('available-seat');
        bookingGrid.addEventListener('click', () => {
            bookingGrid.classList.add('selected-seats');
        });
        
    }
    count++;
    // console.log(count+" "+arr);
    localStorage.setItem("previous",JSON.stringify(arr));
    // document.getElementById('bookingGrid1').classList.add('unavailable-seat');



    for(let j=0; j<seats.length; j++) {
        var bookingGrid = document.getElementById(`booking-grid-${seats[j]}`)
        // arr.push(seats[j]);
        console.log(seats[j]);
        // if (bookingGrid.classList.contains('unavailable-seat')){
        //     bookingGrid.classList.remove('unavailable-seat')
        // }
        bookingGrid.classList.add('available-seat');
        bookingGrid.addEventListener('click', select);
        
    }
    confirmPurchaseDiv();
}
var totalSeats = 0;
var seats = [];
function select (event) {
    totalSeats++;
    // console.log("seats- "+event.path[0].innerHTML);
    seats.push(event.path[0].innerHTML)
    const seat = document.getElementById(event.path[0].id)
    seat.classList.add('selected-seats');
    seat.removeEventListener('click', select);
    seat.addEventListener('click', unselect);
    console.log(totalSeats);
    showButton();

}
function unselect(event) {
    totalSeats--;
    const seat = document.getElementById(event.path[0].id);
    seat.classList.remove('selected-seats');
    seat.removeEventListener('click', unselect);
    seat.addEventListener('click', select);
    showButton();
}

var bookTicketBtn = document.querySelector('#book-ticket-btn');
function showButton () {
    if (totalSeats > 0) {
        bookTicketBtn.classList.remove('v-none')
    }
    else {
        bookTicketBtn.classList.add('v-none')
    }
}
// console.log(bookTicketBtn);

var confirm = document.createElement('div');
var br1 = document.createElement("br");
var br2 = document.createElement("br");
var h3 = document.createElement('h3');

function confirmPurchaseDiv () {

    var purchase = document.createElement("input");
    purchase.setAttribute("type", "submit");
    purchase.setAttribute("value", "Purchase");

    var input2 = document.createElement('input');

    var phone = document.createElement("input");
    phone.setAttribute("type", "tel");
    phone.setAttribute("name", "phone-no.");
    phone.setAttribute("placeholder", "Phone-no.");

    var label2 = document.createElement('Label');
    label2.innerHTML = "Phone no.: ";

    var email = document.createElement("input");
    email.setAttribute("type", "tel");
    email.setAttribute("name", "emailID");
    email.setAttribute("placeholder", "E-Mail ID");

    var label1 = document.createElement('Label');
    label1.innerHTML = "Email: ";

    var form = document.createElement('form');
    form.setAttribute('id', 'customer-detail-form');
    form.appendChild(label2);
    // form.appendChild(br);
    form.appendChild(phone);
    form.appendChild(br1);
    form.appendChild(label1);
    // form.appendChild(br);
    form.appendChild(email);
    form.appendChild(br2);
    form.appendChild(purchase);
    // form.appendChid(label1);
    // form.appendChid(label2);

    h3.innerHTML = "Confirm your booking for seat numbers: ";

    confirm.setAttribute('id', 'confirm-purchase');
    confirm.classList.add('d-none');
    confirm.appendChild(h3);
    confirm.appendChild(form);

    main.appendChild(confirm);
    console.log("seats "+seats.join(','));
}

var booker = document.getElementById('booker');

bookTicketBtn.addEventListener('click', button);
function button () {
    booker.remove();

    console.log(seats.join(','));
    // confirmPurchaseDiv();
    confirm.classList.remove('d-none');
    h3.innerHTML = "Confirm your booking for seat numbers: "+seats.join(",");
    console.log("Book My Seats button is clicked");
}
//hello....?