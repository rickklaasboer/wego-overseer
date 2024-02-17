import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import externals from 'rollup-plugin-node-externals';
import json from '@rollup/plugin-json';
import replace from 'rollup-plugin-replace';

export default {
    input: 'src/app.ts',
    output: {
        dir: 'dist',
        format: 'cjs',
    },
    watch: {
        include: 'src/**',
    },
    plugins: [
        typescript(),
        commonjs(),
        externals(),
        json({compact: true}),
        replace({
            'process.env.APP_VERSION': JSON.stringify(
                // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
                require('./package.json').version,
            ),
        }),
    ],
};
