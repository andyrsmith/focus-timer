import { FocusTimer } from './focus_session.js';
import { FocusUI } from './focus-ui.js';


class FocusTimerApp {
    session;
    ui;
    constructor() {
        this.session = new FocusTimer();
        this.ui = new FocusUI(this.session, this);
    }

    getSessions(params) {
        this.session.createSessions(params);
    }
}


const focus = new FocusTimerApp();
