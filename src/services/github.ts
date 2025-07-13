
export const githubService = {
  getUserRepositories: async (token: string) => {
    // Mock implementation for demo purposes
    return [
      {
        id: 1,
        name: 'sample-repo',
        full_name: 'user/sample-repo',
        description: 'A sample repository',
        html_url: 'https://github.com/user/sample-repo',
        clone_url: 'https://github.com/user/sample-repo.git',
        language: 'TypeScript',
        default_branch: 'main'
      }
    ];
  }
};
