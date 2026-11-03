import Datepicker from 'bootstrap/js/src/datepicker.js';

export class ReactDatepicker extends Datepicker {
    private changingVisibility = false;

    async show() {
        if (this.changingVisibility) return;

        this.changingVisibility = true;
        try {
            await super.show();
        } finally {
            this.changingVisibility = false;
        }
    }

    async hide() {
        if (this.changingVisibility) return;

        this.changingVisibility = true;
        try {
            await super.hide();
        } finally {
            this.changingVisibility = false;
        }
    }

    dispose() {
        // Calendar Pro normally replaces its trigger with a clone on destroy.
        // Keep React's original node and its ref/event bindings intact.
        const element = this._positionElement;
        const replacement = this._calendar?.context.originalElement;

        super.dispose();
        replacement?.replaceWith(element);
    }
}
