import path from 'path'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import {
    fileURLToPath
} from 'url'
const __filenameNew = fileURLToPath(
    import.meta.url)
const __dirnameNew = path.dirname(__filenameNew)
export default [{
        input: "./src/core/index.ts",
        output: [{
                file: path.resolve(__dirnameNew, './dist/index.esm.js'),
                format: "es",
                globals: {
                    'web-vitals': 'webVitals'
                }
            },
            {
                file: path.resolve(__dirnameNew, './dist/index.cjs.js'),
                format: "cjs",
                globals: {
                    'web-vitals': 'webVitals'
                }
            },
            {
                file: path.resolve(__dirnameNew, './dist/index.js'),
                format: "umd",
                name: "Tracker",
                // globals: {
                //     'web-vitals': 'webVitals'
                // }
            },
        ],
        plugins: [
            ts(),
        ],
        // external: ['web-vitals']
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