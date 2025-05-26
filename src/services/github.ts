
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  default_branch: string;
  private: boolean;
  fork: boolean;
}

export class GitHubService {
  private baseUrl = 'https://api.github.com';

  async getUserRepositories(accessToken: string): Promise<GitHubRepository[]> {
    try {
      const response = await fetch(`${this.baseUrl}/user/repos?per_page=100&sort=updated`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const repositories: GitHubRepository[] = await response.json();
      
      // Filter out forks and private repos for demo purposes
      return repositories.filter(repo => !repo.fork && !repo.private);
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
      throw new Error('Failed to fetch repositories from GitHub');
    }
  }

  async getRepositoryContent(accessToken: string, owner: string, repo: string, path: string = '') {
    try {
      const response = await fetch(
        `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching repository content:', error);
      throw new Error('Failed to fetch repository content');
    }
  }
}

// Export singleton instance
export const githubService = new GitHubService();
