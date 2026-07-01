# Quiz_Game_SkillCraft

A lightweight, interactive multiple-choice quiz game built with plain HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies. Open it in a browser and play.

The quiz supports three question formats (single-select, multi-select, and fill-in-the-blank), tracks progress as you go, and ends with a scored summary and a full answer review.

Features


Multiple question types

Pick One — classic single-answer multiple choice
Pick All That Apply — multi-select questions with exact-match scoring
Fill In The Blank — free-text input with support for multiple accepted spellings



Instant feedback — locking in an answer immediately highlights correct/incorrect options
Progress tracker — a segmented bar shows how far through the quiz you are
Animated score reveal — score counts up on the results screen
Answer review — after finishing, see every question alongside your answer and the correct one
Play again — reset and retake the quiz without reloading the page
Clean, responsive UI — plain white theme that works on both desktop and mobile
Zero dependencies — pure HTML/CSS/JS, no npm install, no build tools


Demo

Just open index.html in any modern browser — no server required.

Project Structure

quiz-game/
├── index.html    # Page structure and markup
├── styles.css    # All styling
├── script.js     # Quiz logic: state, scoring, rendering
└── README.md

Getting Started

Run locally


Clone the repository


bash   git clone https://github.com/<your-username>/quiz-game.git
   cd quiz-game


Open index.html in your browser (double-click it, or right-click → Open With → your browser).


That's it — no installation, no dependencies, no build step.

Optional: run with a local server

Some browsers restrict certain features when opening files directly via file://. If you run into issues, serve the folder locally:
