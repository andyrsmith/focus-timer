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
        this.domObj.resumeButton = document.getElementById("resume-button");
    }
    //TODO: rename to startTimer
    resumeTimer() {
            this.domObj.skipButton.disabled = false;
            document.getElementById("session-" + this.session.getCurrentSession().sessionNumber).remove();
            this.sessionState = "running";
            this.updateText(this.domObj.sessionHeader, this.session.getCurrentSession().text);
            this.domObj.sessionHeader.textContent = this.session.getCurrentSession().text;
            this.updateText(this.domObj.timerDisplay, this.session.formatTime(this.session.getCurrentSession().duration));
            this.domObj.startButton.style.display = "none";
            this.currentInterval = this.startInterval(this.session.getCurrentSession());

    }

    setUpEventListeners() {
        this.domObj.startButton.addEventListener("click", () => {
            this.domObj.startButton.style.display = 'none';
            this.domObj.resumeButton.style.display = 'none';
            this.domObj.stopButton.style.display = 'inline';
            this.resumeTimer();
        });

        this.domObj.stopButton.addEventListener("click", () => {
            //clearInterval(this.currentInterval);
            this.sessionState = "stopped";
            this.domObj.resumeButton.style.display = 'inline';
            this.domObj.stopButton.style.display = 'none';
            this.domObj.sessionHeader.textContent = "Timer Stopped";
        });

        this.domObj.skipButton.addEventListener("click", () => {
            clearInterval(this.currentInterval);
            this.sessionState = "ended";
            this.populatePastSessions(this.session.getCurrentSession());
            this.session.incrementSession();

            this.domObj.skipButton.disabled = true;
            this.domObj.startButton.disabled = false;
            if(this.session.isAllSessionsComplete()) {
                this.updateText(this.domObj.sessionHeader, "All Sessions Completed!");
            } else {
                document.getElementById("timer-next").style.display = "inline";
                this.updateText(this.domObj.sessionHeader, "Session Skipped");
            }
            document.getElementById("timer-controls").style.display = "none";

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

            const confirmResponse = confirm("Changing settings will reset the current session. Do you want to continue?");
            if(confirmResponse) {
            const settingsSection = document.getElementById("settings-section");
            if(settingsSection.style.display === "none" || settingsSection.style.display === "") {
                settingsSection.style.display = "block";
                document.getElementById("focus-app").style.display = "none";
            } else {
                settingsSection.style.display = "none";
            }
            }
        });
        document.getElementById("resume-button").addEventListener("click", () => {
            this.domObj.resumeButton.style.display = 'none';
            this.domObj.stopButton.style.display = 'inline';
            this.domObj.sessionHeader.textContent = this.session.getCurrentSession().text;
            this.sessionState = "running";
        });

        document.getElementById("start-next-session").addEventListener("click", () => {
            document.getElementById("timer-controls").style.display = "block";
            document.getElementById("timer-next").style.display = "none";
            this.domObj.startButton.style.display = "inline";
            document.getElementById("resume-button").style.display = "none";
            this.resumeTimer();
        });


    };

    startInterval(session) {
        return setInterval(() => {
            if(this.sessionState !== "running") {
                return;
            }
            session.duration--;
            session.totalTime++;
            this.domObj.timerDisplay.textContent = this.formatTime(session.duration);
            if(session.duration <= 0) {
                const audio = new Audio('assets/sd_0.wav');
                audio.play();
                this.sessionState = "ended";
                this.populatePastSessions(this.session.getCurrentSession());
                this.session.incrementSession();
                clearInterval(this.currentInterval);
                if(this.session.isAllSessionsComplete()) {
                    this.updateText(this.domObj.sessionHeader, "All Sessions Completed!");
                } else {
                    document.getElementById("timer-next").style.display = "inline";
                }
                document.getElementById("timer-controls").style.display = "none";

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
    }

    populatePastSessions(session) {
        const sessionRow = document.createElement("tr");
        const sessionNumber = document.createElement("td");
        const sessionTextEl = document.createElement("td");
        const sessionTotalTimeEl = document.createElement("td");
        sessionRow.id = `past-session-${session.sessionNumber}`;
        sessionNumber.textContent = session.sessionNumber;
        sessionTextEl.textContent = session.text;
        sessionTotalTimeEl.textContent = this.formatTime(session.totalTime);
        sessionRow.appendChild(sessionNumber);
        sessionRow.appendChild(sessionTextEl);
        sessionRow.appendChild(sessionTotalTimeEl);
        document.getElementById("past-sessions").appendChild(sessionRow);
    }
}










