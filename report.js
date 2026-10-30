
/* =====================================
   21 SKILLS LAB — PROJECT REPORT
   Усі дані для сторінки зберігаються тут
===================================== */

const reportData = {
    project: {
        name: "21 Skills Lab",
        stage: "Початковий етап",
        updatedAt: "30 жовтня 2026",
        financePeriod: "Увесь період проєкту",
        currency: "UAH"
    },
    // Завдання та їхні статуси
    // completed | progress | planned | blocked
    // tasks: [
    //     {
    //         id: 1,
    //         title: "Розробка концепції проєкту",
    //         description:
    //             "Визначення мети, основних принципів і моделі роботи 21 Skills Lab.",
    //         status: "completed",
    //         progress: 100,
    //         responsible: "Команда проєкту",
    //         updated: "20.10.2026"
    //     },
    //     {
    //         id: 2,
    //         title: "Створення вебсайту",
    //         description:
    //             "Розробка сторінок, структури та візуального оформлення сайту.",
    //         status: "progress",
    //         progress: 60,
    //         responsible: "Вебкоманда",
    //         updated: "27.10.2026"
    //     },
    //     {
    //         id: 3,
    //         title: "Формування команди",
    //         description:
    //             "Розподіл ролей і визначення відповідальних за основні напрямки.",
    //         status: "progress",
    //         progress: 40,
    //         responsible: "Координатор проєкту",
    //         updated: "27.10.2026"
    //     },
    //     {
    //         id: 4,
    //         title: "Підготовка перших навчальних занять",
    //         description:
    //             "Розробка матеріалів і плану проведення перших майстерень.",
    //         status: "planned",
    //         progress: 0,
    //         responsible: "Освітня команда",
    //         updated: "Очікує початку"
    //     }
    // ],

    // // Проблеми та шляхи їх вирішення
    // issues: [
    //     {
    //         id: 1,
    //         title: "Розподіл обов'язків",
    //         severity: "Середній пріоритет",
    //         description:
    //             "Потрібно узгодити ролі учасників і розподілити завдання так, щоб усі напрямки мали відповідальних.",
    //         solution:
    //             "Сформувати команду, визначити зони відповідальності та узгодити план роботи.",
    //         status: "open"
    //     },
    //     {
    //         id: 2,
    //         title: "Планування навчальних активностей",
    //         severity: "Низький пріоритет",
    //         description:
    //             "Необхідно визначити формат перших занять і підготувати матеріали для учасників.",
    //         solution:
    //             "Обрати теми перших занять і скласти календар підготовки.",
    //         status: "open"
    //     }
    // ],

    // // Наступні кроки
    // nextSteps: [
    //     {
    //         id: 1,
    //         title: "Завершити основні сторінки сайту",
    //         description:
    //             "Перевірити навігацію, адаптивність і правильність відображення сторінок.",
    //         responsible: "Вебкоманда",
    //         deadline: "До 05.11.2026"
    //     },
    //     {
    //         id: 2,
    //         title: "Затвердити склад команди",
    //         description:
    //             "Розподілити ролі, узгодити обов'язки та канали комунікації.",
    //         responsible: "Координатор проєкту",
    //         deadline: "До 03.11.2026"
    //     },
    //     {
    //         id: 3,
    //         title: "Підготувати перший навчальний план",
    //         description:
    //             "Визначити тему, формат і матеріали для першої майстерні.",
    //         responsible: "Освітня команда",
    //         deadline: "До 10.11.2026"
    //     }
    // ],

    // // Фінансова звітність
    // // На початку проєкту можна залишити порожні масиви.
    // // Усі суми вказуються в гривнях.
    // finances: {
    //     income: [
    //         {
    //             id: 1,
    //             source: "Грант",
    //             description: "Фінансування проєкту",
    //             amount: 10000,
    //             date: "01.11.2026"
    //         }
    //     ],

    //     expenses: [
    //         {
    //             id: 1,
    //             title: "Навчальні матеріали",
    //             description: "Матеріали для майстерень",
    //             amount: 500,
    //             date: "05.11.2026"
    //         }
    //     ],

    //     note:
    //         "Наразі фінансові надходження та витрати не зареєстровані."
    // }
};


/* =====================================
   НАЛАШТУВАННЯ ТА ДОПОМІЖНІ ФУНКЦІЇ
===================================== */

const statusInfo = {
    completed: {
        label: "Виконано",
        className: "status-completed"
    },
    progress: {
        label: "У процесі",
        className: "status-progress"
    },
    planned: {
        label: "Заплановано",
        className: "status-planned"
    },
    blocked: {
        label: "Заблоковано",
        className: "status-blocked"
    }
};

let activeTaskFilter = "all";

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function formatMoney(amount) {
    return new Intl.NumberFormat("uk-UA", {
        style: "currency",
        currency: reportData.project.currency,
        maximumFractionDigits: 2
    }).format(amount);
}

function getStatus(status) {
    return statusInfo[status] || {
        label: "Не визначено",
        className: "status-planned"
    };
}

function getTaskCounts() {
    const tasks = reportData.tasks;

    return {
        total: tasks.length,
        completed: tasks.filter(t => t.status === "completed").length,
        progress: tasks.filter(t => t.status === "progress").length,
        planned: tasks.filter(t => t.status === "planned").length,
        blocked: tasks.filter(t => t.status === "blocked").length
    };
}


/* =====================================
   ЗАГАЛЬНА СТАТИСТИКА
===================================== */

function renderOverview() {
    const counts = getTaskCounts();

    const averageProgress = counts.total
        ? Math.round(
            reportData.tasks.reduce(
                (sum, task) => sum + Math.max(
                    0,
                    Math.min(100, Number(task.progress) || 0)
                ),
                0
            ) / counts.total
        )
        : 0;

    const stats = [
        {
            label: "Усього завдань",
            value: counts.total,
            description: "Усі етапи роботи над проєктом",
            icon: "▤",
            color: "blue"
        },
        {
            label: "Виконано",
            value: counts.completed,
            description: "Завдання, які вже завершені",
            icon: "✓",
            color: "green"
        },
        {
            label: "У процесі",
            value: counts.progress,
            description: "Завдання, над якими працюємо",
            icon: "↗",
            color: "purple"
        },
        {
            label: "Середній прогрес",
            value: `${averageProgress}%`,
            description: "Середнє значення прогресу завдань",
            icon: "%",
            color: "orange"
        }
    ];

    document.querySelector("#overview").innerHTML = stats.map(stat => `
        <article class="overview-card">
            <div class="overview-card-top">
                <span class="overview-card-label">
                    ${escapeHTML(stat.label)}
                </span>
                <span class="overview-icon ${stat.color}">
                    ${stat.icon}
                </span>
            </div>

            <strong class="overview-value">
                ${escapeHTML(stat.value)}
            </strong>

            <span class="overview-description">
                ${escapeHTML(stat.description)}
            </span>
        </article>
    `).join("");
}


/* =====================================
   ЗАВДАННЯ
===================================== */

function renderTaskFilters() {
    const counts = getTaskCounts();

    const filters = [
        { id: "all", label: "Усі", count: counts.total },
        { id: "completed", label: "Виконані", count: counts.completed },
        { id: "progress", label: "У процесі", count: counts.progress },
        { id: "planned", label: "Заплановані", count: counts.planned },
        { id: "blocked", label: "Заблоковані", count: counts.blocked }
    ];

    document.querySelector("#taskFilters").innerHTML =
        filters.map(filter => `
            <button
                type="button"
                class="task-filter ${
                    activeTaskFilter === filter.id ? "active" : ""
                }"
                data-filter="${filter.id}"
            >
                ${escapeHTML(filter.label)} (${filter.count})
            </button>
        `).join("");

    document.querySelectorAll("#taskFilters [data-filter]")
        .forEach(button => {
            button.addEventListener("click", () => {
                activeTaskFilter = button.dataset.filter;
                renderTaskFilters();
                renderTasks();
            });
        });
}

function renderTasks() {
    const tasks = reportData.tasks.filter(task =>
        activeTaskFilter === "all" ||
        task.status === activeTaskFilter
    );

    document.querySelector("#taskCounter").textContent =
        `${tasks.length} завдань`;

    const container = document.querySelector("#taskList");

    if (!tasks.length) {
        container.innerHTML = `
            <div class="empty-state">
                У цій категорії поки немає завдань.
            </div>
        `;
        return;
    }

    container.innerHTML = tasks.map(task => {
        const status = getStatus(task.status);
        const progress = Math.max(
            0,
            Math.min(100, Number(task.progress) || 0)
        );

        return `
            <article class="task-card">
                <div>
                    <div class="task-title-row">
                        <h3 class="task-title">
                            ${escapeHTML(task.title)}
                        </h3>

                        <span class="status-badge ${status.className}">
                            ${escapeHTML(status.label)}
                        </span>
                    </div>

                    <p class="task-description">
                        ${escapeHTML(task.description)}
                    </p>

                    <div class="task-meta">
                        <span>
                            Відповідальний: ${escapeHTML(task.responsible)}
                        </span>
                        <span>
                            Оновлено: ${escapeHTML(task.updated)}
                        </span>
                    </div>

                    <div class="task-progress">
                        <div class="progress-label">
                            <span>Прогрес виконання</span>
                            <span>${progress}%</span>
                        </div>

                        <div
                            class="progress-track"
                            role="progressbar"
                            aria-valuenow="${progress}"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-label="Прогрес завдання"
                        >
                            <div
                                class="progress-fill"
                                style="width: ${progress}%"
                            ></div>
                        </div>
                    </div>
                </div>

                <div class="task-side">
                    <small>ID: #${escapeHTML(task.id)}</small>
                </div>
            </article>
        `;
    }).join("");
}


/* =====================================
   ПРОБЛЕМИ
===================================== */

function renderIssues() {
    const container = document.querySelector("#issuesList");

    if (!reportData.issues.length) {
        container.innerHTML = `
            <div class="empty-state">
                Наразі проблем не зареєстровано.
            </div>
        `;
        return;
    }

    container.innerHTML = reportData.issues.map(issue => `
        <article class="issue-card">
            <div class="issue-top">
                <h3>${escapeHTML(issue.title)}</h3>

                <span class="status-badge ${
                    issue.status === "resolved"
                        ? "status-completed"
                        : "status-blocked"
                }">
                    ${issue.status === "resolved"
                        ? "Вирішено"
                        : "Відкрита проблема"}
                </span>
            </div>

            <p>${escapeHTML(issue.description)}</p>

            <div class="task-meta">
                <span>
                    Пріоритет: ${escapeHTML(issue.severity)}
                </span>
            </div>

            <div class="issue-solution" style="margin-top: 15px;">
                <strong>Рішення / наступні дії</strong>
                ${escapeHTML(issue.solution)}
            </div>
        </article>
    `).join("");
}


/* =====================================
   НАСТУПНІ КРОКИ
===================================== */

function renderNextSteps() {
    const container = document.querySelector("#nextStepsList");

    if (!reportData.nextSteps.length) {
        container.innerHTML = `
            <div class="empty-state">
                Наступні кроки ще не визначені.
            </div>
        `;
        return;
    }

    container.innerHTML = reportData.nextSteps.map((step, index) => `
        <article class="next-step">
            <div class="next-step-number">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div>
                <h3>${escapeHTML(step.title)}</h3>
                <p>${escapeHTML(step.description)}</p>
            </div>

            <div class="next-step-owner">
                <strong>${escapeHTML(step.responsible)}</strong>
                <span>${escapeHTML(step.deadline)}</span>
            </div>
        </article>
    `).join("");
}


/* =====================================
   ФІНАНСОВА ЗВІТНІСТЬ
===================================== */

function renderFinances() {
    const { income, expenses, note } = reportData.finances;

    const totalIncome = income.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
    );

    const totalExpenses = expenses.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
    );

    // Розраховуємо автоматично, а не вводимо вручну.
    const balance = totalIncome - totalExpenses;

    document.querySelector("#financePeriod").textContent =
        reportData.project.financePeriod;

    const stats = [
        {
            label: "Отримано коштів",
            amount: totalIncome,
            className: ""
        },
        {
            label: "Витрачено коштів",
            amount: totalExpenses,
            className: ""
        },
        {
            label: "Залишок",
            amount: balance,
            className: "balance"
        }
    ];

    document.querySelector("#financeOverview").innerHTML =
        stats.map(stat => `
            <div class="finance-stat ${stat.className}">
                <span class="finance-stat-label">
                    ${escapeHTML(stat.label)}
                </span>

                <strong>${escapeHTML(formatMoney(stat.amount))}</strong>
            </div>
        `).join("");

    renderFinanceEntries({
        containerId: "#incomeList",
        items: income,
        type: "income"
    });

    renderFinanceEntries({
        containerId: "#expenseList",
        items: expenses,
        type: "expense"
    });

    document.querySelector("#financeNote").textContent = note;
}

function renderFinanceEntries({ containerId, items, type }) {
    const container = document.querySelector(containerId);

    if (!items.length) {
        container.innerHTML = `
            <div class="empty-state">
                ${type === "income"
                    ? "Надходжень поки немає."
                    : "Витрат поки немає."}
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => {
        const isIncome = type === "income";
        const title = isIncome ? item.source : item.title;

        return `
            <article class="finance-entry">
                <div>
                    <h4>${escapeHTML(title)}</h4>
                    <p>${escapeHTML(item.description)}</p>
                    <p>${escapeHTML(item.date)}</p>
                </div>

                <strong class="${
                    isIncome ? "amount-income" : "amount-expense"
                }">
                    ${isIncome ? "+" : "−"}${escapeHTML(
                        formatMoney(Number(item.amount) || 0)
                    )}
                </strong>
            </article>
        `;
    }).join("");
}


/* =====================================
   ЗАПУСК І ОНОВЛЕННЯ
===================================== */

function renderReport() {
    document.querySelector("#reportUpdated").textContent =
        reportData.project.updatedAt;

    document.querySelector("#reportFooterDate").textContent =
        `Оновлено: ${reportData.project.updatedAt}`;

    renderOverview();
    renderTaskFilters();
    renderTasks();
    renderIssues();
    renderNextSteps();
    renderFinances();
}

renderReport();
