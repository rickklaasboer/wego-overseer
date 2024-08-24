import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import externals from 'rollup-plugin-node-externals';
import {dts} from 'rollup-plugin-dts';

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'cjs',
    },
    watch: {
        include: 'src/**',
    },
    plugins: [typescript(), dts(), commonjs(), externals()],
};
