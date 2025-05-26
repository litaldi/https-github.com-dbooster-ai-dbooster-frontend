
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  clone_url: string;
  language: string | null;
  updated_at: string;
  default_branch: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  email: string | null;
  public_repos: number;
}

export class GitHubService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest(endpoint: string) {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentUser(): Promise<GitHubUser> {
    return this.makeRequest('/user');
  }

  async getRepositories(page: number = 1, perPage: number = 30): Promise<GitHubRepository[]> {
    return this.makeRequest(`/user/repos?page=${page}&per_page=${perPage}&sort=updated`);
  }

  async getUserRepositories(accessToken?: string): Promise<GitHubRepository[]> {
    if (accessToken && accessToken !== this.accessToken) {
      // Create a temporary instance with the provided token
      const tempService = new GitHubService(accessToken);
      return tempService.getRepositories();
    }
    return this.getRepositories();
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.makeRequest(`/repos/${owner}/${repo}`);
  }

  async getRepositoryContents(owner: string, repo: string, path: string = ''): Promise<any[]> {
    return this.makeRequest(`/repos/${owner}/${repo}/contents/${path}`);
  }

  async searchCode(owner: string, repo: string, query: string): Promise<any> {
    return this.makeRequest(`/search/code?q=${encodeURIComponent(query)}+repo:${owner}/${repo}`);
  }

  async getFileContent(owner: string, repo: string, path: string): Promise<string> {
    const content = await this.makeRequest(`/repos/${owner}/${repo}/contents/${path}`);
    // GitHub API returns base64 encoded content
    return atob(content.content.replace(/\s/g, ''));
  }
}

// Export a default instance that can be used when no token is available
// This will be recreated with the actual token when needed
export const githubService = {
  getUserRepositories: async (accessToken: string): Promise<GitHubRepository[]> => {
    const service = new GitHubService(accessToken);
    return service.getRepositories();
  }
};
