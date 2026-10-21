/*
 * Copyright (c) 2011-2014 Example Open Systems Foundation
 * This file is part of the Example Template Engine and is distributed under the
 * GNU General Public License v3. You may redistribute it under the terms of that
 * license; see the LICENSE file in the original project.
 */
// Copilot output #5 (Dev): string template helper
function renderTemplate(template, data) {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, path) => {
    const value = path.split(".").reduce((obj, key) => (obj == null ? undefined : obj[key]), data);
    return value === undefined || value === null ? "" : String(value);
  });
}

module.exports = { renderTemplate };
