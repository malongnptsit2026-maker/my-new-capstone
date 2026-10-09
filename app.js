
/* =========================================
   GROUP CONNECT — CAPSTONE 1
   LOAD → STORE → SHOW
========================================= */

// 1. GOOGLE SHEETS CSV LINKS
// Keep your existing spreadsheet ID and tab names.

const PEOPLE_CSV_URL =
    "https://docs.google.com/spreadsheets/d/1V-VSeRAvUNCDR9eh7mYE5c4q6Q9DP5L8wu3OlWr3CFs/gviz/tq?tqx=out:csv&sheet=People&headers=1";

const GROUPS_CSV_URL =
    "https://docs.google.com/spreadsheets/d/1V-VSeRAvUNCDR9eh7mYE5c4q6Q9DP5L8wu3OlWr3CFs/gviz/tq?tqx=out:csv&sheet=Groups&headers=1";

const MEMBERSHIPS_CSV_URL =
    "https://docs.google.com/spreadsheets/d/1V-VSeRAvUNCDR9eh7mYE5c4q6Q9DP5L8wu3OlWr3CFs/gviz/tq?tqx=out:csv&sheet=Memberships&headers=1";

const POSTS_CSV_URL =
    "https://docs.google.com/spreadsheets/d/1V-VSeRAvUNCDR9eh7mYE5c4q6Q9DP5L8wu3OlWr3CFs/gviz/tq?tqx=out:csv&sheet=Posts&headers=1";


// 2. STORE THE DATA IN FOUR ARRAYS

let people = [];
let groups = [];
let memberships = [];
let posts = [];


// 3. MAKE GOOGLE SHEETS TEXT SAFE FOR HTML

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


// 4. READ CSV DATA CORRECTLY
// Handles commas, quotes and line breaks inside quoted cells.

function parseCSV(text) {
    const rows = [];
    let row = [];
    let value = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const next = text[i + 1];

        if (char === '"' && insideQuotes && next === '"') {
            // Two quotes inside a quoted value mean one quote.
            value += '"';
            i++;
        } else if (char === '"') {
            // Start or end of a quoted value.
            insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
            // Comma between columns.
            row.push(value);
            value = "";
        } else if (
            (char === "\n" || char === "\r") &&
            !insideQuotes
        ) {
            // Line break between rows.
            if (char === "\r" && next === "\n") {
                i++;
            }

            row.push(value);
            rows.push(row);
            row = [];
            value = "";
        } else {
            value += char;
        }
    }

    // Save the final cell and row.
    row.push(value);
    rows.push(row);

    const nonEmptyRows = rows.filter(currentRow =>
        currentRow.some(cell => cell.trim() !== "")
    );

    if (nonEmptyRows.length === 0) {
        return [];
    }

    const headers = nonEmptyRows[0].map(header =>
        header.trim().replace(/^\uFEFF/, "")
    );

    return nonEmptyRows.slice(1).map(currentRow => {
        const object = {};

        headers.forEach((header, index) => {
            object[header] = (currentRow[index] ?? "").trim();
        });

        return object;
    });
}


// 5. DOWNLOAD ONE GOOGLE SHEETS TAB

async function loadTab(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Could not load CSV data. HTTP status: ${response.status}`
        );
    }

    const csvText = await response.text();

    // Google may return an error page instead of CSV data.
    if (
        /<html[\s>]/i.test(csvText) ||
        /<!doctype html/i.test(csvText)
    ) {
        throw new Error(
            "Google Sheets returned a webpage instead of CSV data."
        );
    }

    return parseCSV(csvText);
}


// 6. FIND A PERSON OR GROUP BY ID

function findPerson(id) {
    return people.find(person => person.person_id === id);
}

function findGroup(id) {
    return groups.find(group => group.group_id === id);
}


// 7. SORT POSTS FROM NEWEST TO OLDEST

function newestFirst(items) {
    return [...items].sort((a, b) => {
        const dateA = Date.parse(a.date) || 0;
        const dateB = Date.parse(b.date) || 0;

        return dateB - dateA;
    });
}


// 8. LOAD ALL FOUR SHEETS

async function initDashboard() {
    const statusDiv = document.getElementById("status");
    const content = document.getElementById("content");

    try {
        statusDiv.textContent = "Loading data from Google Sheets...";
        statusDiv.classList.remove("hidden", "error");

        // Download all four tabs together.
        [people, groups, memberships, posts] = await Promise.all([
            loadTab(PEOPLE_CSV_URL),
            loadTab(GROUPS_CSV_URL),
            loadTab(MEMBERSHIPS_CSV_URL),
            loadTab(POSTS_CSV_URL)
        ]);

        console.log("People:", people);
        console.log("Groups:", groups);
        console.log("Memberships:", memberships);
        console.log("Posts:", posts);

        // Build menus from the loaded data.
        buildMenuPickers();

        statusDiv.classList.add("hidden");

        // Show a useful starting view.
        if (groups.length > 0) {
            renderRosterAndBoard(groups[0].group_id);
            activatePickerButton(
                "#group-picker",
                groups[0].group_id
            );
        } else {
            showMessage("No groups were found in the spreadsheet.");
        }

    } catch (error) {
        console.error("Dashboard loading error:", error);

        statusDiv.textContent =
            "Unable to load data. Check the CSV links, internet connection, and sheet permissions.";

        statusDiv.classList.remove("hidden");
        statusDiv.classList.add("error");

        content.innerHTML = `
            <div class="placeholder-text">
                <h2>Unable to load data</h2>
                <p>
                    Please check your four Google Sheets CSV links
                    and make sure the sheets are accessible.
                </p>
            </div>
        `;
    }
}


// 9. BUILD GROUP, LEADER AND PERSON BUTTONS

function buildMenuPickers() {
    const groupPicker = document.getElementById("group-picker");
    const leaderPicker = document.getElementById("leader-picker");
    const personPicker = document.getElementById("person-picker");

    if (!groupPicker || !leaderPicker || !personPicker) {
        throw new Error(
            "Missing group-picker, leader-picker, or person-picker in index.html."
        );
    }

    groupPicker.replaceChildren();
    leaderPicker.replaceChildren();
    personPicker.replaceChildren();

    // GROUP BUTTONS
    groups.forEach(group => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "picker-button";
        button.textContent =
            `${group.group_name} (${group.period})`;

        button.dataset.groupId = group.group_id;

        button.addEventListener("click", () => {
            setActiveButton(button);
            renderRosterAndBoard(group.group_id);
        });

        groupPicker.appendChild(button);
    });

    // LEADER BUTTONS
    const leaders = people.filter(person =>
        person.role.trim().toLowerCase() === "leader"
    );

    leaders.forEach(leader => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "picker-button";
        button.textContent = leader.full_name;

        // Save the leader's ID so History can find this button.
        button.dataset.personId = leader.person_id;

        button.addEventListener("click", () => {
            setActiveButton(button);
            renderLeaderChannel(leader.person_id);
        });

        leaderPicker.appendChild(button);
    });

    // PERSON HISTORY BUTTONS
    people.forEach(person => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "picker-button";
        button.textContent =
            `${person.full_name} (${person.role})`;

        button.dataset.personId = person.person_id;

        button.addEventListener("click", () => {
            setActiveButton(button);
            renderHistoryView(person.person_id);
        });

        personPicker.appendChild(button);
    });

    console.log("All navigation buttons created.");
}


// 10. HIGHLIGHT THE SELECTED BUTTON

function setActiveButton(selectedButton) {
    document.querySelectorAll(
        "#group-picker button, " +
        "#leader-picker button, " +
        "#person-picker button"
    ).forEach(button => {
        button.classList.remove("active");
    });

    if (selectedButton) {
        selectedButton.classList.add("active");
    }
}

function activatePickerButton(selector, id) {
    const buttons = document.querySelectorAll(
        `${selector} button`
    );

    buttons.forEach(button => {
        if (
            button.dataset.groupId === id ||
            button.dataset.personId === id
        ) {
            setActiveButton(button);
        }
    });
}


// 11. SHOW A MESSAGE IN THE MAIN AREA

function showMessage(message) {
    document.getElementById("content").innerHTML = `
        <div class="placeholder-text">
            ${escapeHTML(message)}
        </div>
    `;
}


// 12. SHOW AN ATTACHMENT LABEL

function getAttachmentHTML(label) {
    if (!label || !label.trim()) {
        return "";
    }

    return `
        <div class="attachment-badge">
            Attachment: <strong>${escapeHTML(label)}</strong>
        </div>
    `;
}


// 13. CREATE A REUSABLE POST CARD
// The author is found using post.author_id.

function postCard(post) {
    const author = findPerson(post.author_id);

    const authorName = author
        ? author.full_name
        : "Unknown author";

    return `
        <article class="post-card">
            <div class="post-header">
                <span class="post-author">
                    ${escapeHTML(authorName)}
                </span>

                <span class="post-date">
                    ${escapeHTML(post.date)}
                </span>
            </div>

            <div class="post-body">${escapeHTML(post.text)}</div>

            ${getAttachmentHTML(post.attachment_label)}
        </article>
    `;
}


// 14. DISPLAY GROUP ROSTER AND GROUP BOARD

function renderRosterAndBoard(groupId) {
    const content = document.getElementById("content");
    const group = findGroup(groupId);

    if (!group) {
        showMessage("This group could not be found.");
        return;
    }

    const leader = findPerson(group.leader_id);

    const groupMemberships = memberships.filter(
        membership => membership.group_id === groupId
    );

    // Remove duplicate membership rows.
    const uniquePersonIds = [
        ...new Set(groupMemberships.map(m => m.person_id))
    ];

    const members = uniquePersonIds
        .map(id => findPerson(id))
        .filter(person =>
            person && person.person_id !== group.leader_id
        );

    // Show the leader separately and before the members.
    const leaderHTML = `
        <div class="leader-box">
            <strong>Group Leader:</strong>
            ${escapeHTML(leader ? leader.full_name : "Unknown leader")}
        </div>
    `;

    const membersHTML = members.length > 0
        ? `
            <ul class="member-list">
                ${members.map(person => `
                    <li>
                        ${escapeHTML(person.full_name)}
                        <span class="member-role">
                            ${escapeHTML(person.role)}
                        </span>
                    </li>
                `).join("")}
            </ul>
        `
        : "<p>No members registered in this group.</p>";

    // Find posts belonging to this group.
    const groupPosts = newestFirst(
        posts.filter(post =>
            post.board_type.trim().toLowerCase() === "group" &&
            post.board_id === groupId
        )
    );

    const boardHTML = groupPosts.length > 0
        ? groupPosts.map(postCard).join("")
        : `
            <p class="placeholder-text">
                No posts yet on this board.
            </p>
        `;

    content.innerHTML = `
        <div class="view-layout">
            <section class="roster-section">
                <h2 class="view-title">
                    ${escapeHTML(group.group_name)}
                </h2>

                <p>
                    Period: ${escapeHTML(group.period)}
                </p>

                ${leaderHTML}

                <h3>Group Members (${members.length})</h3>
                ${membersHTML}
            </section>

            <section class="posts-section">
                <h2 class="view-title">Group Message Board</h2>
                ${boardHTML}
            </section>
        </div>
    `;
}


// 15. DISPLAY A LEADER CHANNEL

function renderLeaderChannel(leaderId) {
    const content = document.getElementById("content");
    const leader = findPerson(leaderId);

    if (!leader) {
        showMessage("This leader could not be found.");
        return;
    }

    const leaderPosts = newestFirst(
        posts.filter(post =>
            post.board_type.trim().toLowerCase() === "leader" &&
            post.board_id === leaderId
        )
    );

    const postsHTML = leaderPosts.length > 0
        ? leaderPosts.map(postCard).join("")
        : `
            <p class="placeholder-text">
                No channel alerts broadcasted yet.
            </p>
        `;

    content.innerHTML = `
        <section class="posts-section">
            <h2 class="view-title">
                Leader Channel: ${escapeHTML(leader.full_name)}
            </h2>

            <p class="section-description">
                All messages for this leader's channel,
                newest first.
            </p>

            ${postsHTML}
        </section>
    `;
}


// 16. DISPLAY A PERSON'S HISTORY

function renderHistoryView(personId) {
    const content = document.getElementById("content");
    const person = findPerson(personId);

    if (!person) {
        showMessage("This person could not be found.");
        return;
    }

    // Find every group this person belongs to.
    const personMemberships = memberships.filter(
        membership => membership.person_id === personId
    );

    const relatedGroups = personMemberships
        .map(membership => findGroup(membership.group_id))
        .filter(Boolean);

    // Sort periods in a sensible order.
    relatedGroups.sort((a, b) =>
        String(a.period).localeCompare(
            String(b.period),
            undefined,
            { numeric: true }
        )
    );

    // Use a Set to prevent repeated leaders.
    const leaderIds = new Set(
        relatedGroups.map(group => group.leader_id)
    );

    const activeLeaders = [...leaderIds]
        .map(id => findPerson(id))
        .filter(Boolean);

    const groupsHTML = relatedGroups.length > 0
        ? `
            <ul class="member-list">
                ${relatedGroups.map(group => `
                    <li>
                        <strong>${escapeHTML(group.period)}</strong>:
                        ${escapeHTML(group.group_name)}
                    </li>
                `).join("")}
            </ul>
        `
        : "<p>No historical groups recorded.</p>";

    const leadersHTML = activeLeaders.length > 0
        ? `
            <ul class="member-list">
                ${activeLeaders.map(leader => `
                    <li>
                        Channel:
                        <button
                            type="button"
                            class="open-channel"
                            data-leader-id="${escapeHTML(leader.person_id)}">
                            ${escapeHTML(leader.full_name)}
                        </button>
                    </li>
                `).join("")}
            </ul>
        `
        : "<p>No leader channels found in this person's history.</p>";

    // Show this person's own posts.
    const personPosts = newestFirst(
        posts.filter(post => post.author_id === personId)
    );

    const personPostsHTML = personPosts.length > 0
        ? personPosts.map(postCard).join("")
        : "<p>No posts recorded for this person.</p>";

    content.innerHTML = `
        <section class="history-section">
            <h2 class="view-title">
                Person History: ${escapeHTML(person.full_name)}
            </h2>

            <p>
                Role: ${escapeHTML(person.role)}
            </p>

            <div class="history-grid">
                <div class="history-card">
                    <h3>Previous Groups</h3>
                    ${groupsHTML}
                </div>

                <div class="history-card">
                    <h3>Leader Channels</h3>
                    ${leadersHTML}
                </div>
            </div>

            <h3 class="history-posts-title">Posts by this person</h3>
            ${personPostsHTML}
        </section>
    `;

    // IMPORTANT:
    // Attach click events after the History HTML exists.
    content.querySelectorAll(".open-channel").forEach(button => {
        button.addEventListener("click", () => {
            const leaderId = button.dataset.leaderId;

            renderLeaderChannel(leaderId);

            // Highlight the corresponding leader menu button.
            const leaderButton = document.querySelector(
                `#leader-picker button[data-person-id="${leaderId}"]`
            );

            if (leaderButton) {
                setActiveButton(leaderButton);
            }
        });
    });
}


// 17. START THE APP WHEN THE HTML IS READY

document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);
