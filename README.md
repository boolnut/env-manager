# Github Action : 
boolnut/env-manager@v0.0.1


# How to use:

1) Example: How to use action in existing flow
```
    - name: Environment Manager
      uses: boolnut/env-manager@v0.0.1
```

2) Sample Workflow
```
name: My Sample Workflow

on: 
  pull_request:

jobs:
  code-quality-check:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4.1.1

    - name: Set Python Version
      uses: actions/setup-python@v4
      with:
        python-version: ${{ inputs.python_version }}

    - name: Environment Manager
      uses: boolnut/env-manager@v0.0.1
      with:
        auth-token: 'moke_auth-token'
        project-id: 'moke_project-id'
        environment-id: 'moke_environment-id'

    - name: Save Result to .env File
    run: echo "${{ steps.run_action.outputs.response }}" > .env
    
```


