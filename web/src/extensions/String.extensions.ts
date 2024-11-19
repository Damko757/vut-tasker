declare global {
    interface String {
        capitalize(): string;

        ISOToFormattedDateTime(showSeconds?: boolean): string;
    }
}

String.prototype.capitalize = function (this: string) {
    return this[0].toLocaleUpperCase() + this.slice(1).toLocaleLowerCase();
};
String.prototype.ISOToFormattedDateTime = function (
    this: string,
    showSeconds: boolean = false
) {
    const d = new Date(this);

    return (
        `${d.getDate()}. ${
            d.getMonth() + 1
        }. ${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}` +
        (showSeconds ? `:${d.getSeconds().toString().padStart(2, "0")}` : ``)
    );
};
