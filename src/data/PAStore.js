/**
 * Manages the state of the scheduler
 */

import { ReduceStore } from "flux/utils";
import scheduler from "../scheduler";
import { actions as schedActions} from "./SchedulerActions";
import { actions } from "./PAActions";
import dispatcher from "./dispatcher";
import { accessorParallelAxis } from "./dataAccessors";

class PAStore extends ReduceStore {
   getInitialState() {
      return {
          accessors: accessorParallelAxis([
              ".init.runTime",
              ".init.createTime",
               ".init.createTime",
               ".init.createTime",
              // ".init.createTime",
              
          ])
      };    
   }
   reduce(state, action) {
      switch (action.type) {
         case actions.UPDATE_PARALLEL_AXIS: {
            return {
                accessors: accessorParallelAxis(action.data)
            };
         }
         default:
            return state;
      }
   }
}

export default new PAStore(dispatcher);