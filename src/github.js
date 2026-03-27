/**
 * GitHub API 封装
 */

import { getFetchOptions } from './proxy.js';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_API = 'https://api.github.com';

async function request(path) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'mcp-git-server'
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const url = `${GITHUB_API}${path}`;
  const res = await fetch(url, {
    headers,
    ...getFetchOptions(url)
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }
  return res.json();
}

export async function getFile(owner, repo, path, ref) {
  const query = ref ? `?ref=${encodeURIComponent(ref)}` : '';
  const data = await request(
    `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}${query}`
  );

  if (data.type !== 'file') {
    throw new Error(`Path "${path}" is not a file, got ${data.type}`);
  }

  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { content, size: data.size, sha: data.sha, path: data.path };
}

export async function listFiles(owner, repo, path, ref) {
  const query = ref ? `?ref=${encodeURIComponent(ref)}` : '';
  const treePath = path ? `/${encodeURIComponent(path)}` : '';
  const data = await request(
    `/repos/${owner}/${repo}/contents${treePath}${query}`
  );

  if (!Array.isArray(data)) {
    return [{ name: data.name, type: data.type, size: data.size }];
  }

  return data.map((item) => ({
    name: item.name,
    path: item.path,
    type: item.type,
    size: item.size
  }));
}

export async function searchCode(searchKey, repo) {
  const data = await request(
    `/search/code?q=${encodeURIComponent(searchKey)}${repo ? `+repo:${encodeURIComponent(repo)}` : ''}`
  );

  if (!data.items || data.items.length === 0) {
    throw new Error(`SearchKey "${searchKey}" 没有找到喔～`);
  }

  const content = data.items.map((i) => ({
    name: i.name,
    path: i.path,
    repo: i.repository.full_name
  }));
  return { content };
}