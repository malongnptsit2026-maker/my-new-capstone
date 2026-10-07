# My Organization Dashboard

## Capstone 1

This project is a simple web dashboard for **My Organization**.

The dashboard loads organization information from Google Sheets and displays:

- Groups
- Group leaders
- Members
- Group message boards
- Leader channels
- Person history

The project is built using simple **HTML, CSS, and JavaScript** without any framework.

---

## Project Files

The project contains four main files:

```text
your-repo/
│
├── index.html
├── styles.css
├── app.js
└── README.md
```

### 1. index.html

This file contains the structure of the web page.

It includes:

- Header
- Navigation/select menu
- Group selection area
- Leader selection area
- Person history selection area
- Main content area
- Footer
- Link to the CSS file
- Link to the JavaScript file

The HTML file loads `styles.css` and `app.js`. 

---

### 2. styles.css

This file controls how the webpage looks.

It can be used for:

- Colors
- Fonts
- Spacing
- Buttons
- Header
- Footer
- Cards
- Group sections
- Leader sections
- History sections
- Responsive design

---

### 3. app.js

This file contains all the JavaScript for the project.

It is responsible for:

1. Loading the data
2. Storing the data
3. Finding people and groups
4. Building the buttons
5. Showing group information
6. Showing leader channels
7. Showing history information

The JavaScript stores four main data lists:

```javascript
let people = [];
let groups = [];
let memberships = [];
let posts = [];
```

The application loads four CSV sources:

```text
People
Groups
Memberships
Posts
```

These CSV links are defined at the beginning of `app.js`.

---

## How the Application Works

The application follows three main steps:

```text
Google Sheets
     ↓
LOAD
     ↓
STORE
     ↓
SHOW
```

### Step 1: LOAD

JavaScript uses `fetch()` to download the CSV data from Google Sheets.

The `loadTab()` function gets the data and converts the CSV text into JavaScript objects.

---

### Step 2: STORE

The downloaded information is stored in four arrays:

```javascript
people = [];
groups = [];
memberships = [];
posts = [];
```

Each array contains a different type of information.

---

### Step 3: SHOW

The application uses the stored information to build the webpage.

The menu buttons are created from the data that was loaded instead of using hard-coded group IDs.

This means the application can work with different groups and data.

---

# Main Data

## People

The People data contains information about people in the organization.

Example:

```text
person_id
full_name
role
```

Example:

```text
P001
Sarah
leader
```

---

## Groups

The Groups data contains information about groups.

Example:

```text
group_id
group_name
period
leader_id
```

The `leader_id` connects a group to its leader.

---

## Memberships

The Memberships data connects people with groups.

Example:

```text
person_id
group_id
```

The application uses this information to find which people belong to each group.

---

## Posts

The Posts data contains messages posted on group boards and leader channels.

Example fields include:

```text
post_id
board_type
board_id
author_id
date
text
attachment_label
```

---

# Main Features

## 1. Group View

The user can select a group.

The application then displays:

- Group name
- Group period
- Group leader
- Group members
- Group message board

The application finds the selected group and then finds its leader using `leader_id`. It also finds members using the Memberships data.

---

## 2. Group Message Board

The group board displays posts belonging to the selected group.

The application checks:

```javascript
p.board_type === "group"
```

and matches the post with the selected group ID.

Posts are sorted so that the newest posts appear first.

---

## 3. Leader View

The Leader View displays posts belonging to a selected leader.

The application checks:

```javascript
p.board_type === "leader"
```

and matches the post with the leader's ID.

The posts are also sorted from newest to oldest.

---

## 4. Person History View

The History View shows information about a selected person.

It displays:

- Groups the person has belonged to
- Group periods
- Historical leaders
- Accessible leader channels

The application finds the person's memberships and then connects them to the correct groups.

---

# Dynamic Data

One important part of this project is that the application does **not** hard-code a specific group ID.

For example, it should not depend on:

```javascript
"G2023A"
```

Instead, the application uses the groups that are actually loaded from the data.

This makes the application more flexible and allows it to work with different data.

The group buttons are created using:

```javascript
groups.forEach(g => {
```

This means the application creates a button for every group that is loaded.

---

# How to Run the Project

## Option 1: Open Locally

Place all four files in the same folder:

```text
your-repo/
├── index.html
├── styles.css
├── app.js
└── README.md
```

Then open:

```text
index.html
```

in a web browser.

---

## Option 2: Use GitHub Pages

You can upload the project to GitHub.

Make sure the repository contains:

```text
index.html
styles.css
app.js
README.md
```

Then enable **GitHub Pages** in the repository settings.

The website can then be opened using the GitHub Pages website address.

---

# Google Sheets Requirement

The JavaScript currently loads information from Google Sheets using CSV links.

The Google Sheet must be accessible to the application.

If the sheet is not publicly accessible, the browser may not be able to load the data.

The application displays an error message when the data cannot be loaded.

---

# Technologies Used

This project uses:

- HTML5
- CSS3
- JavaScript
- Google Sheets
- CSV
- GitHub Pages

No JavaScript framework or build tool is required.

---

# Basic Data Flow

The complete application flow is:

```text
Google Sheets
     │
     │ CSV
     ↓
JavaScript fetch()
     │
     ↓
parseCSV()
     │
     ↓
JavaScript Arrays
     │
     ├── people[]
     ├── groups[]
     ├── memberships[]
     └── posts[]
     │
     ↓
Filter / Find / Sort
     │
     ↓
HTML Content
     │
     ↓
Web Browser
```

---

# Important JavaScript Functions

### `parseCSV()`

Converts CSV text into JavaScript objects.

### `loadTab()`

Downloads a CSV file using `fetch()`.

### `findPerson()`

Finds a person using their person ID.

### `findGroup()`

Finds a group using its group ID.

### `initDashboard()`

Loads all four datasets and starts the dashboard.

### `buildMenuPickers()`

Creates the group, leader, and person buttons.

### `renderRosterAndBoard()`

Displays the group roster and group message board.

### `renderLeaderChannel()`

Displays messages from a leader channel.

### `renderHistoryView()`

Displays a person's group and leader history.

---

# Purpose of the Project

The purpose of this Capstone 1 project is to demonstrate how a simple web application can:

1. Load external data.
2. Store data in JavaScript arrays.
3. Find related information.
4. Filter data.
5. Sort data.
6. Dynamically create webpage content.
7. Display the information in a user-friendly dashboard.

---

# Author

**Nepal Presbyterian Theological Seminary (NPTS)**

**Capstone 1**

**Information Technology Student**

---

# Project Status

The project is designed as a simple data-driven organization dashboard.

The main application features include:

- Dynamic group selection
- Dynamic leader selection
- Person history
- Group rosters
- Group message boards
- Leader channels
- CSV data loading

---

# License

This project is created for educational purposes as part of Capstone 1.