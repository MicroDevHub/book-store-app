export const natsClient = {
    // with mock function jest.fn() we can monitor this function inside application, to make sure this fn is called
    client: {
        publish: jest.fn().mockImplementation((subjects: string, data: string, callback: () => void) => {
            callback();
        })
    }
};