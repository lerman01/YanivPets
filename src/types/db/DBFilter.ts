export type DBFilter = {
    key: string,
    operation: "NEQ" | "EQ" | "GT" | "LT",
    value: string | number
}