import path from 'path'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import {
    fileURLToPath
} from 'url'
const __filenameNew = fileURLToPath(
    import.meta.url)
const __dirnameNew = path.dirname(__filenameNew)
export default [{
        input: "./src/core/index.ts",
        output: [
            {
                file: path.resolve(__dirnameNew, './dist/index.esm.js'),
                format: "es",
                globals: {
                    'web-vitals': 'webVitals',
                    'ua-parser-js': 'parser',
                    'bowser': 'Bowser'

                }
            },
            {
                file: path.resolve(__dirnameNew, './dist/index.cjs.js'),
                format: "cjs",
                globals: {
                    'web-vitals': 'webVitals',
                    'ua-parser-js': 'parser',
                    'bowser': 'Bowser'
                }
            },
            {
                file: path.resolve(__dirnameNew, './dist/index.js'),
                format: "umd",
                name: "Tracker",
                globals: {
                    'web-vitals': 'webVitals',
                    'ua-parser-js': 'parser',
                    'bowser': 'Bowser'
                }
            },
        ],
        plugins: [
            ts(),
            resolve(),
            commonjs()
        ],
        // external: ['web-vitals','ua-parser-js', 'bowser']
    },
    { //声明文件
        input: "./src/core/index.ts",
        output: {
            file: path.resolve(__dirnameNew, './dist/index.d.ts'),
            format: 'es'
        },
        plugins: [
            dts()
        ]
    }
]