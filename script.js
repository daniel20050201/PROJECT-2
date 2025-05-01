// Initialize calendar
document.addEventListener('DOMContentLoaded', function() {
    // Set up event calendar
    setupEventCalendar();
    
    // Set up some sample events
    const sampleEvents = {
        '2023-11-15': ['Water Conservation Workshop - 10:00 AM', 'Fundraiser Meeting - 2:00 PM'],
        '2023-11-20': ['School Visit - 9:00 AM', 'Community Outreach - 4:00 PM'],
        '2023-11-25': ['Rainwater Harvesting Installation - All Day']
    };
    
    // Display current month
    displayCalendar(new Date().getFullYear(), new Date().getMonth(), sampleEvents);
    
    // Initialize slideshow
    showSlides();
});

// Contact Form Validation
function validateContactForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !subject || !message) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    alert('Thank you for your message! We will get back to you soon.');
    return true;
}

// Donation Form Validation
function validateDonationForm() {
    const name = document.getElementById('donorName').value;
    const email = document.getElementById('donorEmail').value;
    const amount = parseFloat(document.getElementById('donationAmount').value);
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    if (!name || !email || !amount || !paymentMethod) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    if (amount < 10) {
        alert('Minimum donation amount is RM10. Please increase your donation.');
        return false;
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('donationModal'));
    modal.hide();
    
    alert(`Thank you for your donation of RM${amount.toFixed(2)}! Your support is greatly appreciated.`);
    return true;
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Volunteer alert
function showVolunteerAlert() {
    alert('Thank you for your interest in volunteering! Our team will contact you with opportunities soon.');
}

// Partner alert
function showPartnerAlert() {
    alert('Thank you for your interest in partnering with us! Our team will contact you to discuss collaboration opportunities.');
}

// Calendar functions
function setupEventCalendar() {
    const calendarDiv = document.getElementById('eventCalendar');
    const today = new Date();
    
    // Create calendar header
    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between align-items-center mb-3';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-sm btn-outline-primary';
    prevBtn.innerHTML = '&lt; Prev';
    prevBtn.onclick = () => navigateMonth(-1);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-sm btn-outline-primary';
    nextBtn.innerHTML = 'Next &gt;';
    nextBtn.onclick = () => navigateMonth(1);
    
    const monthYear = document.createElement('h5');
    monthYear.className = 'mb-0';
    monthYear.id = 'monthYear';
    
    header.appendChild(prevBtn);
    header.appendChild(monthYear);
    header.appendChild(nextBtn);
    
    calendarDiv.appendChild(header);
    
    // Create calendar grid
    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar-grid';
    calendarGrid.id = 'calendarGrid';
    calendarDiv.appendChild(calendarGrid);
}

let currentYear, currentMonth;

function displayCalendar(year, month, events) {
    currentYear = year;
    currentMonth = month;
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.getElementById('monthYear').textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Create day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-row';
    
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        headerRow.appendChild(dayHeader);
    });
    
    calendarGrid.appendChild(headerRow);
    
    // Create calendar cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        if (date > daysInMonth) break;
        
        const weekRow = document.createElement('div');
        weekRow.className = 'calendar-row';
        
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startingDay) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'calendar-day empty';
                weekRow.appendChild(emptyCell);
            } else if (date > daysInMonth) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'calendar-day empty';
                weekRow.appendChild(emptyCell);
            } else {
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-day';
                dayCell.textContent = date;
                
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                
                if (events && events[dateStr]) {
                    dayCell.classList.add('has-events');
                    dayCell.onclick = () => showEventsForDate(dateStr, events[dateStr]);
                }
                
                // Highlight current day
                const today = new Date();
                if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayCell.classList.add('today');
                }
                
                weekRow.appendChild(dayCell);
                date++;
            }
        }
        
        calendarGrid.appendChild(weekRow);
    }
}

function navigateMonth(direction) {
    currentMonth += direction;
    
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    
    displayCalendar(currentYear, currentMonth, sampleEvents);
}

function showEventsForDate(date, events) {
    const eventsDiv = document.getElementById('selectedDateEvents');
    eventsDiv.innerHTML = '';
    
    const dateHeader = document.createElement('h6');
    dateHeader.textContent = `Events on ${formatDate(date)}:`;
    eventsDiv.appendChild(dateHeader);
    
    const eventList = document.createElement('ul');
    eventList.className = 'list-group';
    
    events.forEach(event => {
        const eventItem = document.createElement('li');
        eventItem.className = 'list-group-item';
        eventItem.textContent = event;
        eventList.appendChild(eventItem);
    });
    
    eventsDiv.appendChild(eventList);
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}

// Slideshow functionality
var slideIndex = 0;
function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[slideIndex-1].className += " active";
    setTimeout(showSlides, 2000); // Change image every 2 seconds
}

// Sample events data
const sampleEvents = {
    '2023-11-15': ['Water Conservation Workshop - 10:00 AM', 'Fundraiser Meeting - 2:00 PM'],
    '2023-11-20': ['School Visit - 9:00 AM', 'Community Outreach - 4:00 PM'],
    '2023-11-25': ['Rainwater Harvesting Installation - All Day']
};