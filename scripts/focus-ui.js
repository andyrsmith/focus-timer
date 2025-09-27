export class FocusUI {
    domObj = {};
    session;
    currentInterval;
    sessionState = "initialized";
    app;

    constructor(session, app) {
        this.queryDomElements();
        this.setUpEventListeners();
        this.session = session;
        this.app = app;
    }

    queryDomElements() {
        this.domObj = {};
        this.domObj.sessionHeader = document.getElementById("timer-text");
        this.domObj.timerDisplay = document.getElementById("timer");
        this.domObj.startButton = document.getElementById("start-button"); 
        this.domObj.stopButton = document.getElementById("stop-button");
        this.domObj.skipButton = document.getElementById("skip-button"); 
        this.domObj.settingsForm = document.getElementById("settings-form");
        this.domObj.showFormButton = document.getElementById("show-form");
    }

    setUpEventListeners() {
        this.domObj.startButton.addEventListener("click", () => {
            if(this.sessionState === "ended") {
                this.populatePastSessions(this.session.getCurrentSession());
                this.session.incrementSession();
            }

            this.domObj.skipButton.disabled = false;
            document.getElementById("session-" + this.session.getCurrentSession().sessionNumber).remove();
            this.sessionState = "running";
            this.updateText(this.domObj.sessionHeader, this.session.getCurrentSession().text);
            this.domObj.sessionHeader.textContent = this.session.getCurrentSession().text;
            this.updateText(this.domObj.timerDisplay, this.session.formatTime(this.session.getCurrentSession().duration));
            this.domObj.startButton.disabled = true;
            this.currentInterval = this.startInterval(this.session.getCurrentSession());
        });

        this.domObj.stopButton.addEventListener("click", () => {
            clearInterval(this.currentInterval);
            this.domObj.startButton.disabled = false;
            this.domObj.sessionHeader.textContent = "Timer Stopped";
        });

        this.domObj.skipButton.addEventListener("click", () => {
            clearInterval(this.currentInterval);
            this.sessionState = "ended";
            this.domObj.skipButton.disabled = true;
            this.domObj.startButton.disabled = false;
            this.updateText(this.domObj.sessionHeader, "Session Skipped");
        });

        this.domObj.settingsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(this.domObj.settingsForm);
            const workDuration = parseInt(formData.get("work-duration")) * 60;
            const shortBreakDuration = parseInt(formData.get("break-duration")) * 60;
            const longBreakDuration = parseInt(formData.get("long-break-duration")) * 60;
            const intervals = parseInt(formData.get("sessions-before-long-break"));

            const params = {
                workDuration: workDuration,
                shortBreakDuration: shortBreakDuration,
                longBreakDuration: longBreakDuration,
                intervals: intervals
            };

            this.session.createSessions(params);

            const upcomingSessions = document.getElementById("upcoming-sessions"); 
            upcomingSessions.querySelectorAll("tr").forEach(n => n.remove());

            this.populateSessions();
            document.getElementById("settings-section").style.display = "none";
            document.getElementById("focus-app").style.display = "block";
        });

        this.domObj.showFormButton.addEventListener("click", () => {
            const settingsSection = document.getElementById("settings-section");
            if(settingsSection.style.display === "none" || settingsSection.style.display === "") {
                settingsSection.style.display = "block";
                document.getElementById("focus-app").style.display = "none";
            } else {
                settingsSection.style.display = "none";
            }
        });
    };

    startInterval(session) {
        return setInterval(() => {
            session.duration--;
            session.totalTime++;
            this.domObj.timerDisplay.textContent = this.formatTime(session.duration);
            if(session.duration <= 0) {
                this.sessionState = "ended";
                clearInterval(this.currentInterval);
                this.domObj.startButton.disabled = false;
            }
        }, 1000);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    updateText(ele, text) {
        ele.textContent = text;
    }

    populateSessions() {
        this.session.sessions.forEach((session, index) => {
            const sessionRow = document.createElement("tr");
            const sessionNumber = document.createElement("td");
            const sessionTextEl = document.createElement("td");
            const sessionDurationEl = document.createElement("td");
            sessionNumber.textContent = session.sessionNumber;
            sessionTextEl.textContent = session.text;
            sessionDurationEl.textContent = this.formatTime(session.duration);
            sessionRow.id = `session-${index+1}`;
            sessionRow.appendChild(sessionNumber);
            sessionRow.appendChild(sessionTextEl);
            sessionRow.appendChild(sessionDurationEl);
            document.getElementById("upcoming-sessions").appendChild(sessionRow);
        });
        // Future feature: dynamically create session elements in the UI
    }

    populatePastSessions(session) {
        const sessionRow = document.createElement("tr");
        const sessionNumber = document.createElement("td");
        const sessionTextEl = document.createElement("td");
        const sessionDurationEl = document.createElement("td");
        const sessionTotalTimeEl = document.createElement("td");
        sessionRow.id = `past-session-${session.sessionNumber}`;
        sessionNumber.textContent = session.sessionNumber;
        sessionTextEl.textContent = session.text;
        sessionDurationEl.textContent = this.formatTime(session.duration);
        sessionTotalTimeEl.textContent = this.formatTime(session.totalTime);
        sessionRow.appendChild(sessionNumber);
        sessionRow.appendChild(sessionTextEl);
        sessionRow.appendChild(sessionDurationEl);
        sessionRow.appendChild(sessionTotalTimeEl);
        document.getElementById("past-sessions").appendChild(sessionRow);
    }
}










