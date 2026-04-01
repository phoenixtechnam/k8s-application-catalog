#!/usr/bin/env node

/**
 * Reformats all manifest.json files to consistent 4-space JSON.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SKIP_DIRS = new Set(['.git', '.github', 'node_modules', 'schema', 'scripts']);

const dirs = readdirSync(ROOT).filter((name) => {
    const full = join(ROOT, name);
    return statSync(full).isDirectory() && !name.startsWith('.') && !SKIP_DIRS.has(name);
});

let fixed = 0;

for (const dir of dirs) {
    const manifestPath = join(ROOT, dir, 'manifest.json');
    if (!existsSync(manifestPath)) continue;

    const raw = readFileSync(manifestPath, 'utf8');
    try {
        const parsed = JSON.parse(raw);
        const formatted = JSON.stringify(parsed, null, 4) + '\n';
        if (raw !== formatted) {
            writeFileSync(manifestPath, formatted);
            console.log(`  ✓ ${dir}/manifest.json reformatted`);
            fixed++;
        }
    } catch (e) {
        console.error(`  ✗ ${dir}/manifest.json is not valid JSON: ${e.message}`);
    }
}

// Also format catalog.json
const catalogPath = join(ROOT, 'catalog.json');
if (existsSync(catalogPath)) {
    const raw = readFileSync(catalogPath, 'utf8');
    try {
        const parsed = JSON.parse(raw);
        const formatted = JSON.stringify(parsed, null, 4) + '\n';
        if (raw !== formatted) {
            writeFileSync(catalogPath, formatted);
            console.log('  ✓ catalog.json reformatted');
            fixed++;
        }
    } catch (e) {
        console.error(`  ✗ catalog.json is not valid JSON: ${e.message}`);
    }
}

if (fixed > 0) {
    console.log(`\n✅ Fixed ${fixed} file(s)\n`);
} else {
    console.log('\n✅ All files already formatted\n');
}
