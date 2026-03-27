/**
 * GitLab API 封装
 */

import { getFetchOptions } from './proxy.js';

const GITLAB_TOKEN = process.env.GITLAB_TOKEN || '';
const GITLAB_URL = process.env.GITLAB_URL || 'https://gitlab.com';

async function request(path) {
  const headers = { 'User-Agent': 'mcp-git-server' };
  if (GITLAB_TOKEN) {
    headers['PRIVATE-TOKEN'] = GITLAB_TOKEN;
  }

  const url = `${GITLAB_URL}/api/v4${path}`;
  const res = await fetch(url, {
    headers,
    ...getFetchOptions(url)
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitLab API ${res.status}: ${body}`);
  }
  return res.json();
}

export async function getFile(projectId, filePath, ref) {
  const encodedPath = encodeURIComponent(filePath);
  const encodedProject = encodeURIComponent(projectId);
  const query = ref ? `?ref=${encodeURIComponent(ref)}` : '?ref=main';
  const data = await request(
    `/projects/${encodedProject}/repository/files/${encodedPath}${query}`
  );

  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return {
    content,
    size: data.size,
    path: data.file_path,
    lastCommitId: data.last_commit_id
  };
}

export async function listFiles(projectId, path, ref) {
  const encodedProject = encodeURIComponent(projectId);
  const params = new URLSearchParams();
  if (path) params.set('path', path);
  if (ref) params.set('ref', ref);
  params.set('per_page', '100');

  const data = await request(
    `/projects/${encodedProject}/repository/tree?${params.toString()}`
  );

  return data.map((item) => ({
    name: item.name,
    path: item.path,
    type: item.type // "blob" = file, "tree" = directory
  }));
}

export async function searchCode(project, searchKey) {
  // project 就是 GitLab 的项目标识，跟 getFile/listFiles 里的 projectId 一样
  // 比如 "live-activity/nuwa" 或者数字 ID "12345"
  const encodedProject = encodeURIComponent(project);
  const data = await request(
    `/projects/${encodedProject}/search?scope=blobs&search=${encodeURIComponent(searchKey)}`
  );

  // GitLab search API 直接返回数组，不是 { items: [] }
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`"${searchKey}" 在项目中没有找到喔～`);
  }

  return data.map((i) => ({
    filename: i.filename,
    path: i.path,
    ref: i.ref,
    startline: i.startline,
    data: i.data
  }));
}
