export class FocusUI {
    domObj = {};
    session;
    currentInterval;
    sessionState = "initialized";

    constructor(currentSession) {
        this.queryDomElements();
        this.setUpEventListeners();
        this.session = currentSession;
    }

    queryDomElements() {
        this.domObj = {};
        this.domObj.sessionHeader = document.getElementById("timer-text");
        this.domObj.timerDisplay = document.getElementById("timer");
        this.domObj.startButton = document.getElementById("start-button"); 
        this.domObj.stopButton = document.getElementById("stop-button");
    }

    setUpEventListeners() {
        this.domObj.startButton.addEventListener("click", () => {
            if(this.sessionState === "ended") {
                this.session.incrementSession();
            }
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
    };

    startInterval(session) {
        return setInterval(() => {
            session.duration--;
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
}










