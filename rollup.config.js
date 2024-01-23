import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import externals from 'rollup-plugin-node-externals';
import json from '@rollup/plugin-json';

export default {
    input: 'src/app.ts',
    output: {
        dir: 'dist',
        format: 'cjs',
    },
    watch: {
        include: 'src/**',
    },
    plugins: [typescript(), commonjs(), externals(), json({compact: true})],
};
