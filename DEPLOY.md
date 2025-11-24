# Deploying TinyTask

We recommend using **Vercel** to deploy your Next.js application. It requires zero configuration for this project.

## Option 1: Vercel CLI (Quickest)

1.  **Install Vercel CLI**:
    ```bash
    npm i -g vercel
    ```

2.  **Login**:
    ```bash
    vercel login
    ```

3.  **Deploy**:
    Run this command and accept the defaults:
    ```bash
    vercel
    ```

4.  **Production Deploy**:
    ```bash
    vercel --prod
    ```

## Option 2: Git Integration (Recommended)

1.  Push this project to a GitHub/GitLab/Bitbucket repository.
2.  Log in to [Vercel.com](https://vercel.com).
3.  Click **Add New...** > **Project**.
4.  Import your repository.
5.  Click **Deploy**.

## Environment Variables

This project currently does not require any environment variables (`.env`). If you add authentication or database features later, you will need to configure them in the Vercel Project Settings.
