
import Scheduler from "./mlfq";

import random from "./randomAdapter";

const scheduler = new Scheduler({
    timeQuantums: [50, 5, 5, 5, 5, 5, 5, 5],
    boostTime: Infinity,
    resetTQsOnIO: false,
    random,
    speed: 3000,
    generation: [
        {
            ioFrequencyRange: [1, 1],
            jobRuntimeRange: [100, 200],
            numJobsRange: [10, 10],
            jobCreateTimeRange: [10, 10],
            ioLengthRange: [5, 5]
        },
        {
            ioFrequencyRange: [30, 40],
            jobRuntimeRange: [60, 1000],
            numJobsRange: [1, 1],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [5, 5]
        }
    ]
});
export default scheduler;

window.scheduler = scheduler;