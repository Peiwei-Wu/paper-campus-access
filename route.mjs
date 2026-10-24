function webUrl(input) {
  const url = new URL(input);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('只支持不含账号密码的 HTTP/HTTPS 地址');
  return url;
}

export function mappingFromUrls(original, school) {
  const source = webUrl(original);
  const target = webUrl(school);
  if (target.protocol !== 'https:') throw new Error('学校通道必须使用 HTTPS');
  const prefix = target.pathname.match(/^\/(?:https?)(?:-\d+)?\/[0-9a-f]+\//i);
  if (!prefix) throw new Error('该地址不是支持的 WebVPN 地址格式，请使用模板模式或咨询学校图书馆');
  return {host: source.hostname, base: target.origin + prefix[0]};
}

export function validateConfig(config) {
  if (!config || !config.name?.trim()) throw new Error('请填写学校名称');
  const portal = webUrl(config.portal);
  if (portal.protocol !== 'https:') throw new Error('学校登录入口必须使用 HTTPS');
  if (portal.search || portal.hash) throw new Error('登录入口请填写门户首页，不要粘贴带票据或验证码的登录回调地址');
  if (config.mode === 'webvpn') {
    if (!Object.keys(config.routes || {}).length) throw new Error('请至少添加一个数据库映射');
    for (const [host, base] of Object.entries(config.routes)) {
      if (webUrl('https://' + host).host !== host || host.includes('/')) throw new Error('数据库域名格式错误');
      const url = webUrl(base);
      if (url.protocol !== 'https:' || url.origin !== portal.origin || !/^\/(?:https?)(?:-\d+)?\/[0-9a-f]+\/$/i.test(url.pathname) || url.search || url.hash) throw new Error('WebVPN 映射必须属于同一个学校门户，且不含登录票据');
    }
  } else if (config.mode === 'template') {
    if ((config.template?.match(/\{encodedUrl\}/g) || []).length !== 1) throw new Error('模板必须且只能包含一个 {encodedUrl}');
    const target = webUrl(config.template.replace('{encodedUrl}', encodeURIComponent('https://example.org/article')));
    if (target.protocol !== 'https:' || target.origin !== portal.origin) throw new Error('模板必须使用与学校门户相同的 HTTPS 域名');
    if (!config.hosts?.length) throw new Error('请填写允许转换的论文网站域名');
    for (const host of config.hosts) if (webUrl('https://' + host).host !== host || host.includes('/')) throw new Error('允许的论文网站域名格式错误');
  } else throw new Error('请选择访问方式');
  return config;
}

export function campusUrl(input, config) {
  validateConfig(config);
  let url = webUrl(input);
  const gateway = new URL(config.portal);
  if (url.origin === gateway.origin) return url.href;
  if (['scholar.google.com', 'www.google.com'].includes(url.hostname) && ['/scholar_url', '/url'].includes(url.pathname)) {
    url = webUrl(url.searchParams.get('url') || url.searchParams.get('q'));
  }
  const host = {'nature.com': 'www.nature.com', 'sciencedirect.com': 'www.sciencedirect.com'}[url.hostname] || url.hostname;
  const query = new URLSearchParams();
  for (const name of ['arnumber', 'tp', 'isnumber', 'doi', 'pii', 'articleId']) if (url.searchParams.has(name)) query.set(name, url.searchParams.get(name));
  const suffix = url.pathname + (query.size ? '?' + query : '') + url.hash;
  if (config.mode === 'webvpn') return config.routes[host] ? config.routes[host] + suffix.slice(1) : null;
  if (!config.hosts.includes(host)) return null;
  return config.template.replace('{encodedUrl}', encodeURIComponent(url.protocol + '//' + host + (url.port ? ':' + url.port : '') + suffix));
}
