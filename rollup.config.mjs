// const path = require('path')
import path from 'path'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import { fileURLToPath } from 'url'
const __filenameNew = fileURLToPath(import.meta.url)

const __dirnameNew = path.dirname(__filenameNew)
// const ts = require("rollup-plugin-typescript2")
// const dts = require("rollup-plugin-dts")
export default [
    {
        input: "./src/core/index.ts",
        output: [
            {
                file: path.resolve(__dirnameNew , './dist/index.esm.js'),
                format:"es"
            },
            {
                file: path.resolve(__dirnameNew , './dist/index.cjs.js'),
                format:"cjs"
            },
            {
                file: path.resolve(__dirnameNew , './dist/index.js'),
                format: "umd",
                name:"Tracker"
            },


        ],
        plugins: [
            ts(),
        ],
    },
    {//声明文件
        input: "./src/core/index.ts",
        output: {
            file: path.resolve(__dirnameNew, './dist/index.d.ts'),
            format:'es'
        },
        plugins: [
            dts()
        ]
    }

]