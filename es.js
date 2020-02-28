// https://nodejs.org/api/esm.html#esm_no_require_exports_module_exports_filename_dirname
//
//  below do not exit when using the ES modules
// require, exports, module.exports, __filename, __dirname

import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

