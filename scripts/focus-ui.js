export class FocusUI {
    domObj = {};
    session;
    currentInterval;
    sessionState = "initialized";

    constructor(currentSession) {
        this.queryDomElements();
        this.setUpEventListeners();
        this.session = currentSession;
        this.populateSessions();
    }

    queryDomElements() {
        this.domObj = {};
        this.domObj.sessionHeader = document.getElementById("timer-text");
        this.domObj.timerDisplay = document.getElementById("timer");
        this.domObj.startButton = document.getElementById("start-button"); 
        this.domObj.stopButton = document.getElementById("stop-button");
        this.domObj.skipButton = document.getElementById("skip-button"); 
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










