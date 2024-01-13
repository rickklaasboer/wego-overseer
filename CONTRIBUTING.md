## Commit guidelines

When you commit changes please add the correct prefix in your commit title. Example: `feat: added user authentication`. Also make sure your branch name matches these guidelines, e.g. `feat/example-command`.

| Prefix   | Description                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------ |
| build    | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)    |
| ci       | Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)    |
| docs     | Documentation only changes                                                                             |
| feat     | A new feature                                                                                          |
| fix      | A bug fix                                                                                              |
| perf     | Changes that improves performance                                                                      |
| refactor | Code change that neither fixes a bug nor adds a feature                                                |
| style    | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| test     | Adding missing tests or correcting existing tests                                                      |

## Coding Conventions

Coding conventions should be covered by eslint/prettier. Make sure to install these. If you're not sure if these are running correctly, you can also run

```sh
yarn lint-staged
```

This will format all staged files automagically.
