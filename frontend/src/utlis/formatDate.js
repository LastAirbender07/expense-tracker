export function formatDate(timestamp) {
    const date = new Date(parseInt(timestamp));
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
}