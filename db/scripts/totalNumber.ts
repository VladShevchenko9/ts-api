export default function getTotalNumber(max: number = 1000): number {
    let total = 5;

    if (process.argv.length > 2) {
        total = parseInt(process.argv[2]);
    }

    if (!total) {
        throw new Error('Invalid total number');
    }

    if (total > max) {
        throw new Error(`Total number must be less than or equal to ${max}`);
    }

    return total;
}
