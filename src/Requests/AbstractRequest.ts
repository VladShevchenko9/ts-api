export abstract class AbstractRequest {
    public populateData(data: Record<string, any>): void {
        const context = this;
        Object.keys(context).map(property => {
            context[property] = data[property];
        });
    }

    public refresh(): void {
        const context = this;
        Object.keys(context).map(property => {
            context[property] = null;
        });
    }
}
