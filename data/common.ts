export function sum(...numbers: number[]) {
    return numbers.reduce((a, b) => Number(a) + Number(b), 0);
}