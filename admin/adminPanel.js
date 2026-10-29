
/* =====================================
   21 SKILLS LAB — ADMIN PANEL
===================================== */

// Дані зберігаються в пам'яті до перезавантаження сторінки.

const adminData = {
    tasks: [],
    issues: [],
    steps: [],
    finances: []
};

const sectionTitles = {
    dashboard: "Огляд проєкту",
    tasks: "Керування завданнями",
    issues: "Проблеми та труднощі",
    steps: "Наступні кроки",
    finance: "Фінансові операції"
};

const statusLabels = {
    planned: "Заплановано",
    progress: "У процесі",
    completed: "Виконано",
    blocked: "Заблоковано",
    open: "Відкрита",
    resolved: "Вирішена"
};


const newsImagesInput = document.querySelector("#newsImages");
const addedPhotos = document.querySelector("#addedPhotos");
const newsForm = document.querySelector("#newsForm");
const clearPhotosButton = document.querySelector("#clearPhotos")

let newsPhotos = [];
let mainPhotoId = null;
let nextPhotoId = 0;

newsImagesInput.addEventListener("change", () => {
    const files = Array.from(newsImagesInput.files);

    if(files.length > 0){
        clearPhotosButton.classList.add("active")
    }else{
        clearPhotosButton.classList.contains("active") ? clearPhotosButton.classList.remove("active") : ""
    }

    files.forEach((file) => {
        if (!file.type.startsWith("image/")) return;

        newsPhotos.push({
            id: ++nextPhotoId,
            file,
            url: URL.createObjectURL(file)
        });
    });

    // Якщо це перше фото — воно стає головним
    if (mainPhotoId === null && newsPhotos.length > 0) {
        mainPhotoId = newsPhotos[0].id;
    }

    newsImagesInput.value = "";

    syncNewsInput();
    renderNewsPhotos();
});

clearPhotosButton.addEventListener("click", (e)=>{
    addedPhotos.innerHTML = ""
    newsImagesInput.value = ""
    e.target.classList.remove("active")
})

function syncNewsInput() {
    const dataTransfer = new DataTransfer();

    newsPhotos.forEach((photo) => {
        dataTransfer.items.add(photo.file);
    });

    // Щоб FormData(newsForm) містив усі вибрані фото
    newsImagesInput.files = dataTransfer.files;
}

function renderNewsPhotos() {
    addedPhotos.replaceChildren();

    newsPhotos.forEach((photo) => {
        const isMain = photo.id === mainPhotoId;

        const card = document.createElement("div");
        card.className = `photo-preview${isMain ? " is-main" : ""}`;

        const image = document.createElement("img");
        image.src = photo.url;
        image.alt = photo.file.name;

        const info = document.createElement("div");
        info.className = "photo-preview-info";

        const name = document.createElement("span");
        name.className = "photo-preview-name";
        name.textContent = photo.file.name;
        name.title = photo.file.name;

        info.appendChild(name);

        if (isMain) {
            const badge = document.createElement("span");
            badge.className = "photo-main-badge";
            badge.textContent = "★ Головне фото";
            info.appendChild(badge);
        } else {
            const mainButton = document.createElement("button");
            mainButton.type = "button";
            mainButton.className = "photo-main-button";
            mainButton.textContent = "Зробити головним";
            mainButton.dataset.action = "main";
            mainButton.dataset.id = photo.id;
            info.appendChild(mainButton);
        }

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "photo-remove-button";
        removeButton.textContent = "Видалити";
        removeButton.dataset.action = "remove";
        removeButton.dataset.id = photo.id;

        info.appendChild(removeButton);
        card.append(image, info);
        addedPhotos.appendChild(card);
    });
    let photos = document.querySelectorAll(".photo-preview")

    photos.forEach((photo) => {
        photo.querySelector("img").addEventListener("click", (e)=>{
            const link = e.target.src
            createPhotoWindow(link)
        })
        photo.querySelector("button").addEventListener("click", ()=>{
            console.log("Booga")
            if(newsPhotos.length == 1){
                clearPhotosButton.classList.remove("active")
            }
        })
    })
}

function createPhotoWindow(link) {
    const overlay = document.createElement("div");
    overlay.className = "photo-window";

    const img = document.createElement("img");
    img.src = link;
    img.alt = "Фото";
    img.className = "photo-window-image";

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    // Закриття при натисканні поза фото
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    // Закриття клавішею Escape
    function handleEscape(e) {
        if (e.key === "Escape") {
            overlay.remove();
            document.removeEventListener("keydown", handleEscape);
        }
    }

    document.addEventListener("keydown", handleEscape);

    // При видаленні вікна прибираємо обробник клавіатури
    const observer = new MutationObserver(() => {
        if (!document.body.contains(overlay)) {
            document.removeEventListener("keydown", handleEscape);
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true
    });
}

addedPhotos.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);

    if (button.dataset.action === "main") {
        mainPhotoId = id;
    }

    if (button.dataset.action === "remove") {
        const photo = newsPhotos.find((item) => item.id === id);
        if (!photo) return;

        URL.revokeObjectURL(photo.url);
        newsPhotos = newsPhotos.filter((item) => item.id !== id);

        if (mainPhotoId === id) {
            mainPhotoId = newsPhotos[0]?.id ?? null;
        }

        syncNewsInput();
    }

    renderNewsPhotos();
});
newsForm.addEventListener("reset", () => {
    setTimeout(() => {
        newsPhotos.forEach((photo) => URL.revokeObjectURL(photo.url));
        newsPhotos = [];
        mainPhotoId = null;
        newsImagesInput.value = "";
        addedPhotos.replaceChildren();
    }, 0);
});


const dateToday = () => {
    const date = new Date();
    const offset = date.getTimezoneOffset();

    return new Date(date.getTime() - offset * 60000)
        .toISOString()
        .slice(0, 10);
};

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function formatMoney(value) {
    return new Intl.NumberFormat("uk-UA", {
        style: "currency",
        currency: "UAH",
        maximumFractionDigits: 2
    }).format(value);
}

function formatDate(value) {
    if (!value) return "—";

    const parts = value.split("-");

    if (parts.length !== 3) return value;

    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function createId() {
    return crypto.randomUUID();
}


/* =====================================
   ПЕРЕМИКАННЯ РОЗДІЛІВ
===================================== */

function switchSection(sectionName) {
    const section = document.querySelector(
        `#section-${sectionName}`
    );

    if (!section) return;

    document.querySelectorAll(".admin-section")
        .forEach(element => {
            element.classList.toggle(
                "active",
                element.id === `section-${sectionName}`
            );
        });

    document.querySelectorAll(".nav-item")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.section === sectionName
            );
        });

    document.querySelector("#pageTitle").textContent =
        sectionTitles[sectionName] || "Адмінпанель";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
        switchSection(button.dataset.section);
    });
});


/* =====================================
   ЗАГАЛЬНА СТАТИСТИКА
===================================== */

function renderStats() {
    const total = adminData.tasks.length;

    const completed = adminData.tasks.filter(
        task => task.status === "completed"
    ).length;

    const inProgress = adminData.tasks.filter(
        task => task.status === "progress"
    ).length;

    const stats = [
        {
            label: "Усього завдань",
            value: total,
            hint: "Усі додані завдання"
        },
        {
            label: "Виконано",
            value: completed,
            hint: "Завершені завдання"
        },
        {
            label: "У процесі",
            value: inProgress,
            hint: "Активна робота"
        }
    ];

    document.querySelector("#adminStats").innerHTML =
        stats.map(stat => `
            <div class="stat-card">
                <span class="stat-label">
                    ${escapeHTML(stat.label)}
                </span>

                <strong class="stat-value">
                    ${stat.value}
                </strong>

                <span class="stat-hint">
                    ${escapeHTML(stat.hint)}
                </span>
            </div>
        `).join("");
}

function renderFinanceStats() {
    const income = adminData.finances
        .filter(item => item.type === "income")
        .reduce((sum, item) => sum + item.amount, 0);

    const expenses = adminData.finances
        .filter(item => item.type === "expense")
        .reduce((sum, item) => sum + item.amount, 0);

    const stats = [
        { label: "Надходження", value: income },
        { label: "Витрати", value: expenses },
        { label: "Залишок", value: income - expenses }
    ];

    document.querySelector("#financeStats").innerHTML =
        stats.map(stat => `
            <div class="stat-card">
                <span class="stat-label">
                    ${escapeHTML(stat.label)}
                </span>

                <strong class="stat-value">
                    ${escapeHTML(formatMoney(stat.value))}
                </strong>
            </div>
        `).join("");
}


/* =====================================
   ЗАВДАННЯ
===================================== */

function renderTasks() {
    const container = document.querySelector("#adminTaskList");

    if (!adminData.tasks.length) {
        container.innerHTML = `
            <div class="empty-state">
                Завдань поки немає. Додай перше за допомогою форми вище.
            </div>
        `;
        return;
    }

    container.innerHTML = adminData.tasks.map(task => `
        <article class="admin-record">
            <div class="record-main">
                <h4>${escapeHTML(task.title)}</h4>
                <p>${escapeHTML(task.description)}</p>

                <div class="record-meta">
                    <span class="record-tag ${task.status}">
                        ${escapeHTML(statusLabels[task.status])}
                    </span>

                    <span class="record-tag">
                        Прогрес: ${task.progress}%
                    </span>

                    <span class="record-tag">
                        ${escapeHTML(task.responsible)}
                    </span>
                </div>
            </div>

            <div class="record-actions">
                <button
                    type="button"
                    class="delete-button"
                    data-delete="tasks"
                    data-id="${task.id}"
                    aria-label="Видалити завдання"
                    title="Видалити"
                >×</button>
            </div>
        </article>
    `).join("");
}


/* =====================================
   ПРОБЛЕМИ
===================================== */

function renderIssues() {
    const container = document.querySelector("#adminIssueList");

    if (!adminData.issues.length) {
        container.innerHTML = `
            <div class="empty-state">
                Проблем поки не додано.
            </div>
        `;
        return;
    }

    container.innerHTML = adminData.issues.map(issue => `
        <article class="admin-record">
            <div class="record-main">
                <h4>${escapeHTML(issue.title)}</h4>
                <p>${escapeHTML(issue.description)}</p>
                <p>
                    <strong>Рішення:</strong>
                    ${escapeHTML(issue.solution)}
                </p>

                <div class="record-meta">
                    <span class="record-tag ${
                        issue.status === "resolved" ? "resolved" : "open"
                    }">
                        ${escapeHTML(statusLabels[issue.status])}
                    </span>

                    <span class="record-tag">
                        ${escapeHTML(issue.severity)} пріоритет
                    </span>
                </div>
            </div>

            <div class="record-actions">
                <button
                    type="button"
                    class="delete-button"
                    data-delete="issues"
                    data-id="${issue.id}"
                    aria-label="Видалити проблему"
                    title="Видалити"
                >×</button>
            </div>
        </article>
    `).join("");
}


/* =====================================
   НАСТУПНІ КРОКИ
===================================== */

function renderSteps() {
    const container = document.querySelector("#adminStepList");

    if (!adminData.steps.length) {
        container.innerHTML = `
            <div class="empty-state">
                Наступних кроків поки не додано.
            </div>
        `;
        return;
    }

    container.innerHTML = adminData.steps.map(step => `
        <article class="admin-record">
            <div class="record-main">
                <h4>${escapeHTML(step.title)}</h4>
                <p>${escapeHTML(step.description)}</p>

                <div class="record-meta">
                    <span class="record-tag">
                        Відповідальний: ${escapeHTML(step.responsible)}
                    </span>

                    <span class="record-tag">
                        До ${escapeHTML(formatDate(step.deadline))}
                    </span>
                </div>
            </div>

            <div class="record-actions">
                <button
                    type="button"
                    class="delete-button"
                    data-delete="steps"
                    data-id="${step.id}"
                    aria-label="Видалити крок"
                    title="Видалити"
                >×</button>
            </div>
        </article>
    `).join("");
}


/* =====================================
   ФІНАНСОВІ ОПЕРАЦІЇ
===================================== */

function renderFinances() {
    const container = document.querySelector("#adminFinanceList");

    if (!adminData.finances.length) {
        container.innerHTML = `
            <div class="empty-state">
                Фінансових операцій поки немає.
            </div>
        `;

        renderFinanceStats();
        return;
    }

    container.innerHTML = adminData.finances.map(item => {
        const isIncome = item.type === "income";

        return `
            <article class="admin-record">
                <div class="record-main">
                    <h4>${escapeHTML(item.title)}</h4>
                    <p>${escapeHTML(item.description)}</p>

                    <div class="record-meta">
                        <span class="record-tag">
                            ${isIncome ? "Надходження" : "Витрата"}
                        </span>

                        <span class="record-tag">
                            ${escapeHTML(formatDate(item.date))}
                        </span>
                    </div>
                </div>

                <div class="record-actions">
                    <strong class="record-amount ${
                        isIncome ? "income" : "expense"
                    }">
                        ${isIncome ? "+" : "−"}${escapeHTML(
                            formatMoney(item.amount)
                        )}
                    </strong>

                    <button
                        type="button"
                        class="delete-button"
                        data-delete="finances"
                        data-id="${item.id}"
                        aria-label="Видалити операцію"
                        title="Видалити"
                    >×</button>
                </div>
            </article>
        `;
    }).join("");

    renderFinanceStats();
}


/* =====================================
   ОСТАННІ ЗАПИСИ
===================================== */

function renderRecentEntries() {
    const container = document.querySelector("#recentEntries");

    const entries = [
        ...adminData.tasks.map(item => ({
            ...item,
            category: "Завдання",
            date: item.createdAt
        })),
        ...adminData.issues.map(item => ({
            ...item,
            category: "Проблема",
            date: item.createdAt
        })),
        ...adminData.steps.map(item => ({
            ...item,
            category: "Наступний крок",
            date: item.createdAt
        })),
        ...adminData.finances.map(item => ({
            ...item,
            category: "Фінанси",
            date: item.createdAt
        }))
    ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

    if (!entries.length) {
        container.innerHTML = `
            <div class="empty-state">
                Тут з'являтимуться записи після додавання через форми.
            </div>
        `;
        return;
    }

    container.innerHTML = entries.map(item => `
        <article class="admin-record">
            <div class="record-main">
                <h4>${escapeHTML(item.title)}</h4>
                <p>${escapeHTML(item.category)}</p>
            </div>

            <div class="record-actions">
                <span class="record-tag">
                    ${new Date(item.createdAt).toLocaleTimeString("uk-UA", {
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </span>
            </div>
        </article>
    `).join("");
}


/* =====================================
   ФОРМИ
===================================== */

// Створення завдання
document.querySelector("#taskForm").addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const progress = Number(data.get("progress"));

    if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
        alert("Прогрес має бути числом від 0 до 100.");
        return;
    }

    const status = data.get("status");

    if (status === "completed" && progress !== 100) {
        alert("Для виконаного завдання встанови прогрес 100%.");
        return;
    }

    adminData.tasks.unshift({
        id: createId(),
        title: data.get("title").trim(),
        description: data.get("description").trim(),
        status,
        progress,
        responsible: data.get("responsible").trim(),
        createdAt: Date.now()
    });

    form.reset();

    document.querySelector("#taskProgress").value = 0;

    renderAll();
    switchSection("tasks");
});


// Створення проблеми
document.querySelector("#issueForm").addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    adminData.issues.unshift({
        id: createId(),
        title: data.get("title").trim(),
        description: data.get("description").trim(),
        solution: data.get("solution").trim(),
        severity: data.get("severity"),
        status: data.get("status"),
        createdAt: Date.now()
    });

    form.reset();

    renderAll();
    switchSection("issues");
});


// Створення наступного кроку
document.querySelector("#stepForm").addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const deadline = data.get("deadline");

    if (deadline < dateToday()) {
        alert("Дедлайн не може бути в минулому.");
        return;
    }

    adminData.steps.unshift({
        id: createId(),
        title: data.get("title").trim(),
        description: data.get("description").trim(),
        responsible: data.get("responsible").trim(),
        deadline,
        createdAt: Date.now()
    });

    form.reset();

    renderAll();
    switchSection("steps");
});


// Перемикання типу фінансової операції
const financeType = document.querySelector("#financeType");
const financeTitleLabel = document.querySelector("#financeTitleLabel");
const financeTitle = document.querySelector("#financeTitle");

function updateFinanceForm() {
    const isIncome = financeType.value === "income";

    financeTitleLabel.textContent = isIncome
        ? "Джерело надходження"
        : "Призначення витрати";

    financeTitle.placeholder = isIncome
        ? "Наприклад, грант або пожертва"
        : "Наприклад, навчальні матеріали";
}

financeType.addEventListener("change", updateFinanceForm);


// Створення фінансової операції
document.querySelector("#financeForm").addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const amount = Number(data.get("amount"));

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Введи суму, більшу за нуль.");
        return;
    }

    adminData.finances.unshift({
        id: createId(),
        type: data.get("type"),
        amount,
        title: data.get("title").trim(),
        description: data.get("description").trim(),
        date: data.get("date"),
        createdAt: Date.now()
    });

    form.reset();

    // Після reset встановлюємо дату сьогоднішнім числом.
    document.querySelector("#financeDate").value = dateToday();

    updateFinanceForm();
    renderAll();
    switchSection("finance");
});


/* =====================================
   ВИДАЛЕННЯ ЗАПИСІВ
===================================== */

document.addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");

    if (!button) return;

    const collection = button.dataset.delete;
    const id = button.dataset.id;

    if (!Object.hasOwn(adminData, collection)) return;

    const records = adminData[collection];

    const record = records.find(item => item.id === id);

    if (!record) return;

    if (!confirm(`Видалити запис «${record.title}»?`)) {
        return;
    }

    adminData[collection] = records.filter(item => item.id !== id);

    renderAll();
});


/* =====================================
   ОНОВЛЕННЯ ІНТЕРФЕЙСУ
===================================== */

function renderAll() {
    renderStats();
    renderFinanceStats();
    renderTasks();
    renderIssues();
    renderSteps();
    renderFinances();
    renderRecentEntries();
}


// Початкові значення дат
document.querySelector("#stepDeadline").min = dateToday();
document.querySelector("#financeDate").value = dateToday();

updateFinanceForm();
renderAll();
