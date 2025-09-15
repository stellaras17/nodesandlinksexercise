import fs from "fs";
import path from "path";
import { parse } from "fast-csv";

export function loadCSV<T = any>(filename: string, useHeaders = true): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const results: T[] = [];
        const filePath = path.join(__dirname, "..", "..", "data", filename);

        fs.createReadStream(filePath)
            .pipe(
                parse({
                    headers: useHeaders ? true : undefined, // use file headers or auto-generate for files with no headers
                    ignoreEmpty: true,
                })
            )
            .on("error", reject)
            .on("data", (row) => results.push(row))
            .on("end", () => resolve(results));
    });
}
