# Contributing to GeoEnv Hub

First off, thank you for considering contributing to GeoEnv Hub! It's people like you that make this tool such a great GIS platform.

## Code of Conduct
By participating in this project, you are expected to uphold our Code of Conduct. Please treat everyone with respect.

## How Can I Contribute?

### Reporting Bugs
This section guides you through submitting a bug report for GeoEnv Hub. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- Use the **Bug Report** issue template.
- Provide a clear and descriptive title for the issue.
- Describe the exact steps to reproduce the problem.
- Describe the behavior you observed after following the steps and point out what exactly is the problem.
- Explain which behavior you expected to see instead and why.
- Include details about your environment: App version, Browser (and version), and Operating System.

### Suggesting Enhancements
This section guides you through submitting an enhancement suggestion for GeoEnv Hub, including completely new features and minor improvements to existing functionality.

- Use the **Feature Request** issue template.
- Provide a clear and descriptive title for the issue.
- Provide a step-by-step description of the suggested enhancement.
- Describe the current behavior and explain the behavior you expected to see instead.
- Explain why this enhancement would be useful to most users.
- List any alternatives you have considered.

### Submitting Pull Requests
The process described here helps maintainers review your changes efficiently.

1. Fork the repository and create your branch from `main`.
2. Ensure you have installed the necessary dependencies using `pnpm install`.
3. If you've added code that should be tested, add tests.
4. If you've changed APIs or features, update the documentation.
5. Ensure your code lints properly by running `pnpm lint`.
6. Make sure the project builds correctly by running `pnpm build`.
7. Issue that pull request!

## Code Style Guide

### TypeScript and React
- We use strict TypeScript. Ensure all variables, functions, and components are properly typed. Avoid using `any` unless absolutely necessary (if you must, add an explanatory comment).
- Use functional components and React Hooks over class components.
- For MapLibre implementations, always use `source.setData()` to update map data dynamically instead of tearing down and rebuilding layers/sources to prevent WebGL thrashing and event listener memory leaks.
- We use `pnpm` for package management. Please do not commit `npm` or `yarn` lock files.

### Branch Naming Conventions
Please follow these conventions when naming your branches:
- `feature/<feature-name>`: For new features.
- `fix/<issue-name>`: For bug fixes.
- `docs/<doc-updates>`: For documentation updates.
- `chore/<chore-name>`: For maintenance tasks.

### Commit Message Format
We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This leads to more readable messages that are easy to follow when looking through the project history.

Format: `<type>(<scope>): <subject>`

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

**Example:**
`feat(map): add support for GeoJSON layer toggling`

Performance improvements (especially from Bolt) should follow the format:
`⚡ Bolt: [performance improvement]` and include specific sections for 'What', 'Why', 'Impact', and 'Measurement' in the PR description.
