import { FocusTimer } from './focus_session.js';
import { FocusUI } from '../focus-ui.js';


class FocusTimerApp {
    session;
    ui;
    constructor() {
        this.session = new FocusTimer();
        this.session.createSessions(4);
        this.ui = new FocusUI(this.session);
    }
}


const focus = new FocusTimerApp();
