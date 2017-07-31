
interface Job {
    init: {
        id: number;
    }
    gui: {
        IOSlot: number;
    }
    running: {
        priority: number
    }
}

class IOStateManager {
    private memory: Map<number, Map<number, {}>> = new Map;
    attachSlots(IOJobs: Job[]) {
        this.checkSlotsUsed(IOJobs);
    }
    checkSlotsUsed(IOJobs: Job[]) {

    }
}