/**
 * Manages the state of the gui
 */

import { ReduceStore } from "flux/utils";
import dispatcher from "./dispatcher";
import { immutInstance } from "../util";
import { fromJS as immut } from "immutable";
import dat from "dat.gui/build/dat.gui.min"
import { actions as lessonActions } from "./lessons"

class guiStore extends ReduceStore {
    getInitialState() {
        const gui = new dat.GUI({ width: 300 });
        gui.close()
        return {
            href: "",
            gui,
            lessonName: "",
            parameter: {},
            options: {},
            simulation: {}
        };
    }

    reduce(state, action) {
        const clone = Object.assign({}, state);

        switch (action.type) {
            case "NAVIGATE": {
                clone.href = action.data;
                return clone;
            }
            case lessonActions.SET_LESSON:
                clone.parameter = action.data.parameter
                clone.lessonName = action.data.lessonName
                clone.simulation = action.data.simulation
                return clone
            default:
                return state;
        }
    }
}

export default new guiStore(dispatcher);