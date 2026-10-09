
# My Organization — Group Connect

**Project:** Tentmaker Open — Capstone 1  
**Student:** Malong (NTC)  
**Year:** 2026

## Live Website

https://malongnptsit2026-maker.github.io/my-new-capstone/

## About the Project

Group Connect is a simple web application that helps users view
group members, group messages, leader announcements, and person history.

The application loads its data from Google Sheets using CSV links.

## Project Files

This project contains four main files:

- `index.html` — provides the structure of the website.
- `styles.css` — controls the colors, layout, spacing, and design.
- `app.js` — loads, stores, processes, and displays the data.
- `README.md` — explains the project and how to use it.

## Load–Store–Show Process

### 1. Load

JavaScript uses `fetch()` to download CSV data from four Google Sheets tabs:

- People
- Groups
- Memberships
- Posts

### 2. Store

The `parseCSV()` function converts CSV text into JavaScript objects.

The data is stored in four arrays:

- `people[]` — stores people, their names, IDs, and roles.
- `groups[]` — stores group names, IDs, periods, and leader IDs.
- `memberships[]` — connects people to their groups.
- `posts[]` — stores group messages and leader-channel posts.

### 3. Show

JavaScript displays the information when a user clicks a group,
leader, or person.

The application updates the main content area without reloading
the entire website.

## Main Features

### 1. Group View

- Displays the selected group's name and period.
- Shows the group leader first.
- Displays the group members.
- Shows group-board messages.
- Displays messages from newest to oldest.

### 2. Leader View

- Displays the selected leader's channel.
- Shows the messages belonging to that leader.
- Displays the correct post author.
- Sorts messages from newest to oldest.

### 3. Person History View

- Displays the selected person's name and role.
- Shows the groups associated with that person.
- Lists the distinct leaders associated with those groups.
- Allows users to click a leader's name to open the leader's channel.
- Displays posts written by the selected person.

## Google Sheets Structure

The application uses four spreadsheet tabs.

### People

Expected columns:

- `person_id`
- `full_name`
- `role`

### Groups

Expected columns:

- `group_id`
- `group_name`
- `period`
- `leader_id`

### Memberships

Expected columns:

- `person_id`
- `group_id`

### Posts

Expected columns:

- `post_id`
- `board_type`
- `board_id`
- `author_id`
- `date`
- `text`
- `attachment_label`

The column names and IDs must match the JavaScript code.

## How to Run the Project

1. Download or clone the project repository.
2. Keep all four project files in the same folder.
3. Open the folder using Visual Studio Code or another code editor.
4. Run the website through a local web server, such as Live Server.
5. Make sure the Google Sheets CSV links are correct.
6. Open the website in your browser.
7. Select a group, leader, or person to test the application.

## Using Another Google Sheet

To connect a different Google spreadsheet:

1. Create four tabs named `People`, `Groups`, `Memberships`, and `Posts`.
2. Use the required column names listed above.
3. Make sure the spreadsheet can be read by the website.
4. If appropriate, set the spreadsheet sharing permission to
   "Anyone with the link — Viewer".
5. Open `app.js`.
6. Find the four CSV URL constants at the top of the file.
7. Replace the spreadsheet ID in all four URLs with the new ID.
8. Save the file and reload the website.
9. Check the browser console for errors.

Keep the spreadsheet structure and data IDs consistent with the application.

## Error Handling

If the data cannot be loaded:

- Check the internet connection.
- Check all four CSV URLs.
- Check the spreadsheet sharing permissions.
- Check the spelling of the tab names.
- Check the column names.
- Open the browser console to read the error message.

## Security and Data Handling

The `escapeHTML()` function helps prevent spreadsheet text from
being interpreted as HTML when displayed.

The CSV parser handles commas, quotation marks, and line breaks
inside quoted values.

The application should only use spreadsheet data that the project
is authorized to access.

## Design Note

The project uses plain HTML, CSS, and JavaScript.

It does not require a JavaScript framework or a build tool.

The application follows the Load–Store–Show approach to separate
data loading, data storage, and displaying information.

## GitHub Repository

https://github.com/malongnptsit2026-maker/my-new-capstone

## Author

Malong (NTC)  
Information Technology Student — 2026

## Acknowledgement

Thank you to the instructor for the feedback and guidance provided
during the Capstone 1 interim assessment.
