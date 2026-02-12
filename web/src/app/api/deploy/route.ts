import { NextRequest, NextResponse } from 'next/server';
import {
  createGitHubRepo,
  scaffoldAndPush,
  createVercelProject,
  triggerVercelDeployment,
  waitForDeployment,
  updateProjectHtml,
  getRepoUrl,
} from '@/lib/deploy';

export async function POST(req: NextRequest) {
  try {
    const { html, projectName, existingRepo } = await req.json();

    if (!html) {
      return NextResponse.json({ error: 'html is required' }, { status: 400 });
    }

    // Update existing repo
    if (existingRepo) {
      await updateProjectHtml(existingRepo, html);

      const deploymentId = await triggerVercelDeployment(existingRepo);
      const deployUrl = await waitForDeployment(deploymentId);
      const repoUrl = await getRepoUrl(existingRepo);
      return NextResponse.json({ repoUrl, deployUrl, repoName: existingRepo });
    }

    // First deploy — create new repo
    const rawName = projectName || `site-${Date.now().toString(36)}`;
    const repoName = rawName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 100);

    const repoUrl = await createGitHubRepo(repoName);
    await scaffoldAndPush(repoName, html);
    await createVercelProject(repoName);

    const deploymentId = await triggerVercelDeployment(repoName);
    const deployUrl = await waitForDeployment(deploymentId);

    return NextResponse.json({ repoUrl, deployUrl, repoName });
  } catch (error: unknown) {
    console.error('Deploy error:', error);
    const message = error instanceof Error ? error.message : 'Deployment failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
