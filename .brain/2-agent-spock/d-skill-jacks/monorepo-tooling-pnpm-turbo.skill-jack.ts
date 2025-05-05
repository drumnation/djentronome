/**
 * Skill-Jack: Monorepo Tooling (pnpm Workspaces & Turborepo)
 * 
 * Provides guidance for working effectively within the Djentronome pnpm/Turborepo monorepo setup.
 * 
 * @module brain-garden/skill-jack
 * @category tools
 */

/**
 * Skill-Jack on Monorepo Tooling (pnpm Workspaces & Turborepo)
 * 
 * This constant provides comprehensive guidance on understanding and utilizing
 * pnpm workspaces and Turborepo for dependency management, task running, and caching within the Djentronome project.
 */
export const monorepoToolingGuide = {
  topic: "Monorepo Tooling (pnpm Workspaces & Turborepo)",
  description: "Covers key concepts and commands for managing dependencies, running scripts/tasks, and leveraging build caches in the project's monorepo environment.",
  corePrinciples: [
    {
      name: "Workspace Structure",
      description: "Code is organized into discrete packages (`packages/*`) and applications (`apps/*`) defined in `pnpm-workspace.yaml`. Tooling lives in `tooling/*`.",
      examples: ["Shared UI components in `packages/ui`.", "Runnable web app in `apps/game-ui`."],
    },
    {
      name: "Centralized Dependency Management (pnpm)",
      description: "pnpm manages dependencies across the workspace, hoisting common dependencies to the root `node_modules` and using symlinks for workspace packages (`workspace:*` protocol).",
      examples: ["Running `pnpm install` in the root installs dependencies for all packages.", "`@kit/ui` depending on `@kit/utils` via `\"@kit/utils\": \"workspace:*\"`."],
    },
    {
      name: "Workspace Dependency Linking (`workspace:*`)",
      description: "The `workspace:*` protocol in `package.json` tells pnpm to link to the local version of a package within the monorepo instead of fetching it from a registry.",
      examples: ["`apps/game-ui` uses `\"@kit/core-logic\": \"workspace:*\"` to reference the local `packages/core-logic`."],
    },
    {
      name: "Task Orchestration (Turborepo)",
      description: "Turborepo (`turbo`) runs tasks (defined as scripts in `package.json`) across the workspace, respecting dependencies defined in `turbo.json`.",
      examples: ["`turbo run build` builds all packages in the correct order.", "`turbo run test --filter=@kit/core-logic` runs tests only for a specific package."],
    },
    {
      name: "Build Caching (Turborepo)",
      description: "Turborepo caches the outputs and logs of tasks based on input file hashes. If inputs haven't changed, `turbo` can restore outputs from the cache (`node_modules/.cache/turbo` or remote cache) instead of re-running the task.",
      examples: ["Running `turbo run build` twice in a row results in `FULL TURBO` cache hits if no code changed.", "Defining `outputs` in `turbo.json` tells turbo what to cache."],
    },
    {
      name: "Task Pipelines (`dependsOn`) ",
      description: "The `turbo.json` `tasks` configuration defines dependencies between tasks (e.g., a package's `build` depends on the `build` of its workspace dependencies `^build`).",
      examples: ["`\"build\": { \"dependsOn\": [\"^build\"] }` ensures dependencies are built before the dependent package."],
    },
  ],
  applicationProcess: {
    description: "Common workflows for agents working within the monorepo.",
    steps: [
      {
        name: "Installing Dependencies",
        description: "Add, remove, or update dependencies for specific packages or the entire workspace.",
        agentActions: [
          {
            action: "Run `pnpm install` in the root directory.",
            explanation: "Installs all dependencies for all workspace packages after cloning or pulling changes.",
          },
          {
            action: "Run `pnpm add <package-name> --filter <workspace-package-name>`.",
            explanation: "Adds a dependency to a specific package (e.g., `pnpm add zod --filter @kit/game-state`). Use `-D` for dev dependencies.",
          },
          {
            action: "Run `pnpm add <workspace-package-name>@workspace:* --filter <dependent-package-name>`.",
            explanation: "Adds a local workspace package as a dependency to another (e.g., `pnpm add @kit/utils@workspace:* --filter @kit/core-logic`).",
          },
          {
            action: "Run `pnpm remove <package-name> --filter <workspace-package-name>`.",
            explanation: "Removes a dependency from a specific package.",
          },
        ],
      },
      {
        name: "Running Tasks/Scripts",
        description: "Execute scripts defined in `package.json` files across the workspace.",
        agentActions: [
          {
            action: "Run `turbo run <script-name>` (e.g., `turbo run build`, `turbo run test`, `turbo run lint`).",
            explanation: "Executes the specified script in all packages where it's defined, respecting the dependency pipeline in `turbo.json` and utilizing the cache.",
          },
          {
            action: "Run `turbo run <script-name> --filter <workspace-package-name>`.",
            explanation: "Runs the script only for the specified package and its dependencies (if needed for the task).",
          },
          {
            action: "Run `turbo run <script-name> --filter <workspace-package-name>...`.",
            explanation: "Runs the script only for the specified package, ignoring its dependencies (useful for tasks like `dev` that don't depend on built artifacts from deps). The `...` indicates ignoring dependencies.",
          },
          {
            action: "Run `pnpm --filter <workspace-package-name> <script-name>`.",
            explanation: "Alternative way to run a script in a single package, bypassing Turborepo's orchestration and caching (useful for debugging or specific dev server scenarios).",
          },
        ],
      },
      {
        name: "Creating New Packages/Apps",
        description: "Add a new package or application to the workspace.",
        agentActions: [
          {
            action: "Create the new directory (`packages/new-package` or `apps/new-app`).",
            explanation: "Follow the existing naming conventions.",
          },
          {
            action: "Add a `package.json` file with standard project configuration.",
            explanation: "Include `name`, `version`, `private` (if applicable), scripts, dependencies, devDependencies (referencing tooling packages with `workspace:*`), and potentially `exports` for packages.",
          },
          {
            action: "Add a `tsconfig.json` extending the appropriate base config from `tooling/tsconfig`.",
            explanation: "Ensures consistent TypeScript settings.",
          },
          {
            action: "Run `pnpm install` in the root.",
            explanation: "Links the new package into the workspace.",
          },
        ],
      },
      {
        name: "Debugging Cache Issues",
        description: "Troubleshoot problems where Turborepo might be using a stale cache.",
        agentActions: [
          {
            action: "Run `turbo run <script-name> --force`.",
            explanation: "Forces Turborepo to re-run the task, ignoring the cache.",
          },
          {
            action: "Delete the Turborepo cache folder (`rm -rf node_modules/.cache/turbo` or potentially `.turbo/cache` depending on setup).",
            explanation: "Clears the local cache entirely. Run `pnpm install` afterwards if `node_modules` structure was affected.",
          },
          {
            action: "Verify `outputs` are correctly defined in `turbo.json` for the task.",
            explanation: "If `outputs` don't accurately reflect the files generated by a task, caching will not work correctly.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Common monorepo workflow examples.",
    useCases: [
      {
        scenario: "Adding a new utility function to `@kit/utils` and using it in `@kit/core-logic`.",
        implementation: "1. Add function to `packages/utils/src`. 2. Export it from `packages/utils/src/index.ts`. 3. Run `pnpm add @kit/utils@workspace:* --filter @kit/core-logic`. 4. Import and use the function in `@kit/core-logic`. 5. Run `turbo run build` - utils will build first, then core-logic.",
        outcome: "Shared code is successfully added and utilized across packages, with correct build order enforced.",
      },
      {
        scenario: "Running tests only for the `game-ui` application.",
        implementation: "Run `turbo run test --filter game-ui`.",
        outcome: "Only the tests within `apps/game-ui` are executed.",
      },
      {
        scenario: "A change in `@kit/core-logic` requires rebuilding it and the dependent `apps/game-ui`.",
        implementation: "Run `turbo run build`. Turborepo detects the change in `@kit/core-logic`, rebuilds it (cache miss), detects `game-ui` depends on it, and rebuilds `game-ui` (cache miss). Other unrelated packages use the cache (cache hit).",
        outcome: "Only the necessary parts of the monorepo are rebuilt, saving time.",
      },
    ],
  },
  codeExamples: [
    {
      language: "shell",
      description: "Add dependency 'zod' to '@kit/game-state' package",
      code: "pnpm add zod --filter @kit/game-state",
      explanation: "Uses pnpm's `--filter` flag to target a specific workspace package for adding a dependency.",
    },
    {
      language: "shell",
      description: "Run the 'lint' script for all packages",
      code: "turbo run lint",
      explanation: "Turborepo executes the 'lint' script defined in the package.json of every package in the workspace.",
    },
    {
      language: "shell",
      description: "Build only the '@kit/ui' package and packages it depends on",
      code: "turbo run build --filter @kit/ui",
      explanation: "Turborepo identifies dependencies of '@kit/ui' based on package.json and turbo.json, builds them if necessary (using cache where possible), then builds '@kit/ui'.",
    },
    {
      language: "json",
      description: "Example task definition in turbo.json",
      code: "{\n  \"$schema\": \"https://turborepo.org/schema.json\",\n  \"tasks\": {\n    \"build\": {\n      \"dependsOn\": [\"^build\"],\n      \"outputs\": [\"dist/**\", \".next/**\"]\n    },\n    \"test\": {\n      \"dependsOn\": [\"build\"],\n      \"outputs\": []\n    },\n    \"lint\": {\n      \"outputs\": []\n    },\n    \"dev\": {\n      \"cache\": false\n    }\n  }\n}",
      explanation: "Defines common tasks ('build', 'test', 'lint', 'dev'), specifies dependencies ('^build' means dependency package build tasks), lists output directories for caching ('outputs'), and disables caching for 'dev'.",
    }
  ],
  commonPitfalls: [
    {
      name: "Forgetting `--filter` when adding/removing dependencies",
      description: "Running `pnpm add/remove` in the root without `--filter` modifies the root `package.json`, which is usually not intended.",
      solution: "Always use `pnpm add/remove <package> --filter <target-workspace>` to manage dependencies within specific workspace packages.",
      preventativeMeasures: ["Develop muscle memory for using `--filter`.", "Check git changes after adding dependencies to ensure only the intended `package.json` was modified."],
    },
    {
      name: "Incorrect `outputs` configuration in `turbo.json`",
      description: "If the `outputs` array for a task doesn't accurately list all generated artifacts, Turborepo's caching will be ineffective or incorrect, leading to stale builds.",
      solution: "Carefully define the `outputs` glob patterns to match all build artifacts (e.g., `dist/**`, `lib/**`, `.next/**`).",
      preventativeMeasures: ["Verify build outputs locally and compare with `turbo.json` patterns.", "Test caching by running builds twice and checking for `FULL TURBO` hits."],
    },
    {
      name: "Circular Dependencies between Workspace Packages",
      description: "Package A depends on Package B, and Package B depends on Package A. This breaks Turborepo's task pipeline and pnpm's linking.",
      solution: "Refactor code to remove circular dependencies, potentially by extracting shared logic into a third package.",
      preventativeMeasures: ["Visualize dependency graphs.", "Be mindful of dependency directions when adding new `workspace:*` links.", "Use linting tools that can detect circular dependencies."],
    },
    {
      name: "Running `pnpm install` in Subdirectories",
      description: "Running `pnpm install` within a specific package (`apps/game-ui`) instead of the root can lead to inconsistent dependency hoisting and issues with `workspace:*` linking.",
      solution: "Always run `pnpm install` from the monorepo root directory.",
      preventativeMeasures: ["Establish clear team conventions.", "Avoid navigating into package directories to run install commands."],
    }
  ],
  resources: [
    {
      type: "documentation",
      name: "pnpm Workspaces",
      description: "Official pnpm documentation on managing workspaces.",
      link: "https://pnpm.io/workspaces",
    },
    {
      type: "documentation",
      name: "Turborepo Core Concepts",
      description: "Official Turborepo documentation explaining pipelines, caching, and filtering.",
      link: "https://turbo.build/repo/docs/core-concepts",
    },
    {
      type: "documentation",
      name: "Turborepo `turbo.json` Configuration",
      description: "Reference for configuring tasks, dependencies, and outputs.",
      link: "https://turbo.build/repo/docs/reference/configuration",
    },
    {
      type: "documentation",
      name: "Turborepo Filtering Packages",
      description: "Details on using the `--filter` flag.",
      link: "https://turbo.build/repo/docs/reference/command-line-interface#--filter",
    }
  ],
  conclusion: "Understanding and correctly utilizing pnpm workspaces for dependency management and Turborepo for task orchestration and caching are fundamental for efficient development within the Djentronome monorepo. Consistent use of commands like `pnpm add --filter` and `turbo run` is key.",
}; 