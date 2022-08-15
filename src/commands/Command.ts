type Props<T> = {
    name: string;
    description: string;
    run(interaction: T): void | Promise<void>;
};

export default class Command<T> {
    public name: string;
    public description: string;
    public run: (interaction: T) => void | Promise<void>;

    constructor({name, description, run}: Props<T>) {
        this.name = name;
        this.description = description;
        this.run = run;
    }
}
