const skills = [
    { name: "AI Literacy", learned: true, practiced: false, shared: true },
    { name: "Cyber Safety", learned: true, practiced: false, shared: true },
    { name: "Digital Content", learned: true, practiced: true, shared: false },
    { name: "Communication", learned: true, practiced: true, shared: true },
    { name: "Critical Thinking", learned: false, practiced: false, shared: false },
    { name: "Teamwork", learned: true, practiced: false, shared: false }
];


function renderAchivements() {
    let learned = document.querySelector("#learnedSkills")
    let practiced = document.querySelector("#practicedSkills")
    let shared = document.querySelector("#sharedSkills")

    learned.textContent = skills.filter((el)=> el.learned === true).length
    practiced.textContent = skills.filter((el)=> el.practiced === true).length
    shared.textContent = skills.filter((el)=> el.shared === true).length
}

function renderSkillsTable() {
    const tableBody = document.getElementById("skillsTableBody");

    tableBody.innerHTML = skills.map(skill => `
        <tr>
            <td>${skill.name}</td>
            <td>${skill.learned
                ? '<span class="status-symbol completed">✓</span>'
                : '<span class="status-symbol not-completed">×</span>'}</td>
            <td>${skill.practiced
                ? '<span class="status-symbol completed">✓</span>'
                : '<span class="status-symbol not-completed">×</span>'}</td>
            <td>${skill.shared
                ? '<span class="status-symbol completed">✓</span>'
                : '<span class="status-symbol not-completed">×</span>'}</td>
        </tr>
    `).join("");
    console.log(tableBody, skills)
    document.querySelector(".skills-count").textContent =
        `${skills.length} навичок`;

    renderAchivements()
}

const events = [
    {
        date: "2026-10-22",
        title: "Основи веброзробки",
        time: "15:00",
        description: "Практичний тренінг з HTML і CSS."
    },
    {
        date: "2026-10-25",
        title: "Командна робота",
        time: "14:00",
        description: "Розвиток комунікації та співпраці."
    },
    {
        date: "2026-10-29",
        title: "Вступ до програмування",
        time: "16:00",
        description: "Знайомство з основами JavaScript."
    },
    {
        date: "2026-11-04",
        title: "UI/UX дизайн",
        time: "15:30",
        description: "Як створювати зручні інтерфейси."
    },
    {
        date: "2026-11-12",
        title: "Презентація проєктів",
        time: "14:00",
        description: "Демонстрація власних робіт."
    }
];

const news = [
    {
        category: "Навчання",
        title: "Нові можливості для учасників",
        description: "На вас чекають нові навчальні матеріали та практичні завдання.",
        date: "15.10.2026",
        icon: "fa-graduation-cap"
    },
    {
        category: "Тренінги",
        title: "Розклад майбутніх тренінгів",
        description: "Переглянь календар, щоб спланувати свою участь у заходах.",
        date: "17.10.2026",
        icon: "fa-calendar-days"
    },
    {
        category: "Оголошення",
        title: "Ділися власними проєктами",
        description: "Розповідай про свої ідеї та показуй результати роботи.",
        date: "18.10.2026",
        icon: "fa-lightbulb"
    }
];


const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuToggle = document.getElementById("menuToggle");
const pageName = document.getElementById("currentPageName");

const pageTitles = {
    dashboard: "Головна",
    grades: "Мій табель",
    calendar: "Календар тренінгів",
    news: "Новини",
    settings: "Налаштування"
};

function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("show");
}

function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("show");
}

menuToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) {
        closeSidebar();
    } else {
        openSidebar();
    }
});

sidebarOverlay.addEventListener("click", closeSidebar);

function showPage(page) {
    if (!pageTitles[page]) return;

    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.toggle("active", section.id === `page-${page}`);
    });

    document.querySelectorAll(".nav-item[data-page]").forEach(button => {
        button.classList.toggle("active", button.dataset.page === page);
    });

    pageName.textContent = pageTitles[page];
    closeSidebar();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

function getGradeClass(grade) {
    if (grade >= 10) return "";
    if (grade >= 7) return "medium";
    return "low";
}

function renderNews(containerId, limit = news.length) {
    const container = document.getElementById(containerId);

    container.innerHTML = news.slice(0, limit).map(item => `
        <article class="news-card">
            <div class="news-cover">
                <i class="fa-solid ${item.icon}"></i>
            </div>
            <div class="news-body">
                <span class="news-category">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <time>${item.date}</time>
            </div>
        </article>
    `).join("");
}

const monthsUk = [
    "Січень", "Лютий", "Березень", "Квітень",
    "Травень", "Червень", "Липень", "Серпень",
    "Вересень", "Жовтень", "Листопад", "Грудень"
];

const weekdaysUk = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const today = new Date();
today.setHours(0, 0, 0, 0);

let calendarYear = today.getFullYear();
let calendarMonth = today.getMonth();
let selectedDate = formatDate(today);

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function parseLocalDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function formatEventDate(dateString) {
    const date = parseLocalDate(dateString);

    return `${date.getDate()} ${monthsUk[date.getMonth()].toLowerCase()}`;
}

function renderCalendar() {
    const daysContainer = document.getElementById("calendarDays");

    document.getElementById("calendarMonth").textContent =
        `${monthsUk[calendarMonth]} ${calendarYear}`;

    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    // Понеділок = 0, неділя = 6
    const offset = (firstDay.getDay() + 6) % 7;

    const previousMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();
    const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;

    let html = "";

    for (let i = 0; i < totalCells; i++) {
        let day;
        let date;

        if (i < offset) {
            day = previousMonthDays - offset + i + 1;
            date = formatDate(new Date(calendarYear, calendarMonth - 1, day));
        } else if (i >= offset + daysInMonth) {
            day = i - offset - daysInMonth + 1;
            date = formatDate(new Date(calendarYear, calendarMonth + 1, day));
        } else {
            day = i - offset + 1;
            date = formatDate(new Date(calendarYear, calendarMonth, day));
        }

        const isCurrentMonth = i >= offset && i < offset + daysInMonth;
        const isToday = date === formatDate(today);
        const isSelected = date === selectedDate;
        const hasEvent = events.some(event => event.date === date);

        const classes = [
            "calendar-day",
            !isCurrentMonth ? "muted" : "",
            isToday ? "today" : "",
            isSelected ? "selected" : ""
        ].filter(Boolean).join(" ");

        html += `
            <button class="${classes}" data-date="${date}"
                    aria-label="${date}${hasEvent ? ', є тренінг' : ''}">
                <span>${day}</span>
                ${hasEvent ? '<i class="day-dot"></i>' : ""}
            </button>
        `;
    }

    daysContainer.innerHTML = html;

    daysContainer.querySelectorAll("[data-date]").forEach(button => {
        button.addEventListener("click", () => {
            selectedDate = button.dataset.date;

            const clickedDate = parseLocalDate(selectedDate);
            calendarYear = clickedDate.getFullYear();
            calendarMonth = clickedDate.getMonth();

            renderCalendar();
            renderSelectedEvents();
        });
    });

    renderSelectedEvents();
}

function renderSelectedEvents() {
    const container = document.getElementById("calendarEventList");
    const title = document.getElementById("selectedDateTitle");

    title.textContent = formatEventDate(selectedDate);

    const selectedEvents = events.filter(event => event.date === selectedDate);

    if (!selectedEvents.length) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-calendar" style="font-size: 25px;"></i>
                <p>На цю дату тренінгів немає.</p>
                <span>Обери інший день у календарі.</span>
            </div>
        `;
        return;
    }

    container.innerHTML = selectedEvents.map(event => `
        <div class="event-row">
            <div class="event-date">
                <strong>${parseLocalDate(event.date).getDate()}</strong>
                <span>${monthsUk[parseLocalDate(event.date).getMonth()].slice(0, 3)}</span>
            </div>
            <div class="event-info">
                <strong>${event.title}</strong>
                <span>${event.time} · ${event.description}</span>
            </div>
        </div>
    `).join("");
}

document.getElementById("prevMonth").addEventListener("click", () => {
    calendarMonth--;

    if (calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear--;
    }

    renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
    calendarMonth++;

    if (calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear++;
    }

    renderCalendar();
});

function renderUpcomingEvents() {
    const container = document.getElementById("upcomingEvents");

    const upcoming = events
        .filter(event => parseLocalDate(event.date) >= today)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3);

    if (!upcoming.length) {
        container.innerHTML = '<div class="empty-state">Найближчих тренінгів поки немає.</div>';
        return;
    }

    container.innerHTML = upcoming.map(event => {
        const date = parseLocalDate(event.date);

        return `
            <div class="event-row">
                <div class="event-date">
                    <strong>${date.getDate()}</strong>
                    <span>${monthsUk[date.getMonth()].slice(0, 3)}</span>
                </div>
                <div class="event-info">
                    <strong>${event.title}</strong>
                    <span>${event.time} · ${event.description}</span>
                </div>
            </div>
        `;
    }).join("");
}


document.getElementById("notificationsToggle").addEventListener("change", event => {
    const bell = document.querySelector('.topbar-right [data-page="news"]');

    if (bell) {
        bell.style.opacity = event.target.checked ? "1" : "0.45";
    }
});

document.getElementById("logoutButton").addEventListener("click", () => {
    createLogOutWindow()

});

function createLogOutWindow(){
    const overlay = document.getElementById("leaveOverlay")
    overlay.classList.add("active")
}

function closeLogOutWindow(){
    const overlay = document.getElementById("leaveOverlay")
    overlay.classList.remove("active")
}


function LogOut(){
    const hasToken = document.cookie
    window.location.href = "/main.html"
}


function openProvingWindow(e) {
    const overlay = document.getElementById("confirmOverlay");
    const password = document.getElementById("confirmPassword");
    const error = document.getElementById("confirmError");

    overlay.classList.add("active");
    password.value = "";
    password.type = "password";
    error.textContent = "";

    setTimeout(() => password.focus(), 100);
}

function closeProvingWindow() {
    document.getElementById("confirmOverlay").classList.remove("active");
}

document.getElementById("confirmOverlay").addEventListener("click", (event) => {
    if (event.target.id === "confirmOverlay") {
        closeProvingWindow();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeProvingWindow();
    }
});

document.getElementById("toggleConfirmPassword").addEventListener("click", () => {
    const password = document.getElementById("confirmPassword");
    const icon = document.querySelector("#toggleConfirmPassword i");

    password.type = password.type === "password" ? "text" : "password";
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
});

document.getElementById("confirmForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = document.getElementById("confirmPassword").value;
    const error = document.getElementById("confirmError");

    error.textContent = "";

    console.log("Потрібно перевірити пароль на сервері");
});

document.querySelector("#profileForm").addEventListener("submit",(e)=>{
    e.preventDefault()
})

renderSkillsTable()
renderNews("dashboardNews", 3);
renderNews("allNews");
renderCalendar();
renderUpcomingEvents();