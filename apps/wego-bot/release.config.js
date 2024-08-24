/* eslint-disable */
module.exports = {
    branches: ['main', {name: 'preview', prerelease: true}],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        [
            '@semantic-release/npm',
            {
                npmPublish: false,
            },
        ],
        [
            '@semantic-release/git',
            {
                message:
                    'chore(release): wego-overseer v${nextRelease.version}\n\n${nextRelease.notes}',
            },
        ],
        '@semantic-release/github',
    ],
};
