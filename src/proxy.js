/**
 * 代理支持
 * - HTTPS_PROXY / HTTP_PROXY: 代理地址
 * - NO_PROXY: 逗号分隔的域名列表，匹配的直连不走代理
 */

import { ProxyAgent } from 'undici';

function getProxyUrl() {
  return (
    process.env.HTTPS_PROXY ||
    process.env.HTTP_PROXY ||
    process.env.https_proxy ||
    process.env.http_proxy
  );
}

function getNoProxyList() {
  const noProxy = process.env.NO_PROXY || process.env.no_proxy || '';
  return noProxy
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function shouldBypass(url) {
  const hostname = new URL(url).hostname.toLowerCase();
  return getNoProxyList().some(
    (pattern) => hostname === pattern || hostname.endsWith(`.${pattern}`)
  );
}

export function getFetchOptions(url) {
  const proxyUrl = getProxyUrl();
  if (proxyUrl && !shouldBypass(url)) {
    return { dispatcher: new ProxyAgent(proxyUrl) };
  }
  return {};
}
