export class FocusTimer {

    constructor() {
        this.sessions = [];
        this.createSessions({
            workDuration: 40*60,
            shortBreakDuration: 10*60,
            intervals: 3
        });
        this.focusSession = 0;
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
        }
    }

    getTotalCycles() {
        return Math.ceil(this.sessions.length/2);
    }

    getCycleNumber() {
        if(this.focusSession == 0 || this.focusSession == 1) return 1;
       

        if(this.focusSession % 2 === 0) {
            return Math.ceil(this.focusSession/2)+1;
        } else {
            return Math.ceil(this.focusSession/2);
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
            this.focusSession = null; // Reset to the first session
        }
    }

    decreaseTime() {
        this.getCurrentSession().duration--;
    }

    getCurrentTime() {
        return this.getCurrentSession().duration;
    }

    isAllSessionsComplete() {
        return this.focusSession == null;
    }
}


const defaultShortBreak = { text: "Reflect", duration: 5*60 };
const defaultWorkSession = { text: "Work", duration: 1*60 };


