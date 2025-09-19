export class FocusTimer {
    constructor() {
        this.focusSession = 0;
        this.sessions = [];
    }

    createSessions(params) {
        if(this.sessions.length > 0) {
            this.focusSession = 0;
            this.sessions = [];
        }

        let sessionNumber = 1;
        for (let i = 0; i < params.intervals; i++) {
            const worksession = {
                sessionNumber: sessionNumber,
                totalTime: 0,
                duration: params.workDuration,
                text: defaultWorkSession.text
            };
            this.sessions.push(worksession);
            sessionNumber++;
            if (i < params.intervals - 1 && !params.intervals % 4 === 0) {
                const shortBreak = {
                    sessionNumber: sessionNumber,
                    totalTime: 0,
                    duration: params.shortBreakDuration,
                    text: defaultShortBreak.text
                };
                this.sessions.push(shortBreak);
                sessionNumber++;
            }
            if(i === params.intervals - 1 && params.intervals % 4 === 0) {
                const longBreak = {
                    sessionNumber: sessionNumber,
                    totalTime: 0,
                    duration: params.longBreakDuration,
                    text: defaultLongBreak.text
                };
                this.sessions.push(longBreak);
                sessionNumber++;
            }
        }
    }

    getCurrentSession() {
        return this.sessions[this.focusSession];
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    incrementSession() {
        if (this.focusSession < this.sessions.length - 1) {
            this.focusSession++;
        } else {
            this.focusSession = 0; // Reset to the first session
        }
    }

    decreaseTime() {
        this.getCurrentSession().duration--;
    }

    getCurrentTime() {
        return this.getCurrentSession().duration;
    }
}


const defaultShortBreak = { text: "Short Break", duration: 5*60 };
const defaultLongBreak = { text: "Long Break", duration: 15*60 };
const defaultWorkSession = { text: "Work Session", duration: 1*60 };


