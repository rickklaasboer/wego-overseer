import config from '@/config';
import {GithubRelease} from '@/types/github';
import {injectable} from 'tsyringe';

@injectable()
export default class GithubService {
    private defaultHeaders = {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${config.github.apiToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
    };

    /**
     * Get the latest release of the bot
     */
    public async getLatestRelease(): Promise<GithubRelease> {
        const request = await fetch(`${config.github.apiUrl}/releases/latest`, {
            headers: {...this.defaultHeaders},
        });
        const response = await request.json();
        return response as GithubRelease;
    }

    /**
     * Get all releases of the bot
     */
    public async getReleases(): Promise<GithubRelease[]> {
        const request = await fetch(
            `${config.github.apiUrl}/releases?=per_page=100`,
            {
                headers: {...this.defaultHeaders},
            },
        );
        const response = await request.json();
        return response as GithubRelease[];
    }

    /**
     * Get the amount of releases behind the latest release
     */
    public async getAmountOfReleasesBehind(): Promise<number> {
        const latest = await this.getLatestRelease();
        const releases = await this.getReleases();
        const current = `v${process.env.APP_VERSION}`;

        const latestIndex = releases.findIndex(
            (release) => release.name === latest.name,
        );

        const currentIndex = releases.findIndex(
            (release) => release.name === current,
        );

        return currentIndex - latestIndex;
    }
}
