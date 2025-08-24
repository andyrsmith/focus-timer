export class FocusTimer {
    constructor() {
        this.focusSession = 0;
        this.sessions = [];
    }

    createSessions(intervals) {
        let sessionNumber = 1;
        for (let i = 0; i < intervals; i++) {
            const worksession = {
                sessionNumber: sessionNumber,
                totalTime: 0,
                ...defaultWorkSession
            };
            this.sessions.push(worksession);
            sessionNumber++;
            if (i < intervals - 1 && !intervals % 4 === 0) {
                const shortBreak = {
                    sessionNumber: sessionNumber,
                    totalTime: 0,
                    ...defaultShortBreak
                };
                this.sessions.push(shortBreak);
                sessionNumber++;
            }
            if(i === intervals - 1 && intervals % 4 === 0) {
                const longBreak = {
                    sessionNumber: sessionNumber,
                    totalTime: 0,
                    ...defaultLongBreak
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


