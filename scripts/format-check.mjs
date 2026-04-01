#!/usr/bin/env node

/**
 * Checks that all manifest.json files use consistent 4-space JSON formatting.
 * Exit code 0 = all formatted, 1 = formatting issues found
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SKIP_DIRS = new Set(['.git', '.github', 'node_modules', 'schema', 'scripts']);

const dirs = readdirSync(ROOT).filter((name) => {
    const full = join(ROOT, name);
    return statSync(full).isDirectory() && !name.startsWith('.') && !SKIP_DIRS.has(name);
});

let issues = 0;

for (const dir of dirs) {
    const manifestPath = join(ROOT, dir, 'manifest.json');
    if (!existsSync(manifestPath)) continue;

    const raw = readFileSync(manifestPath, 'utf8');
    try {
        const parsed = JSON.parse(raw);
        const formatted = JSON.stringify(parsed, null, 4) + '\n';
        if (raw !== formatted) {
            console.error(`  ✗ ${dir}/manifest.json needs formatting`);
            issues++;
        }
    } catch (e) {
        console.error(`  ✗ ${dir}/manifest.json is not valid JSON: ${e.message}`);
        issues++;
    }
}

// Also check catalog.json
const catalogPath = join(ROOT, 'catalog.json');
if (existsSync(catalogPath)) {
    const raw = readFileSync(catalogPath, 'utf8');
    try {
        const parsed = JSON.parse(raw);
        const formatted = JSON.stringify(parsed, null, 4) + '\n';
        if (raw !== formatted) {
            console.error('  ✗ catalog.json needs formatting');
            issues++;
        }
    } catch (e) {
        console.error(`  ✗ catalog.json is not valid JSON: ${e.message}`);
        issues++;
    }
}

if (issues > 0) {
    console.error(`\n❌ ${issues} file(s) need formatting. Run: npm run format:fix\n`);
    process.exit(1);
} else {
    console.log(`✅ All ${dirs.length} manifests properly formatted\n`);
}
