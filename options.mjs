import { mappingFromUrls, validateConfig } from './route.mjs';
const el = id => document.getElementById(id);
let routes = {};
function status(message, error = false) { el('status').textContent = message; el('status').className = error ? 'error' : ''; }
function showMode() { el('webvpn').hidden = el('mode').value !== 'webvpn'; el('templateSection').hidden = el('mode').value !== 'template'; }
function renderRoutes() {
  el('routes').replaceChildren();
  for (const [host, base] of Object.entries(routes)) {
    const row = document.createElement('li');
    row.textContent = host + ' → ' + base;
    const remove = document.createElement('button');
    remove.type = 'button'; remove.textContent = '移除';
    remove.addEventListener('click', () => { delete routes[host]; renderRoutes(); status('尚未保存，请点击“保存学校设置”'); });
    row.append(remove); el('routes').append(row);
  }
}
function fill(config) {
  for (const key of ['name', 'portal', 'mode', 'template']) el(key).value = config[key] || '';
  el('hosts').value = (config.hosts || []).join('\n');
  routes = {...config.routes}; renderRoutes(); showMode(); el('login').hidden = true;
}
el('mode').addEventListener('change', showMode);
el('add').addEventListener('click', () => {
  try {
    const mapping = mappingFromUrls(el('original').value.trim(), el('schoolUrl').value.trim());
    routes[mapping.host] = mapping.base; renderRoutes(); status('网站已添加，点击“保存学校设置”后生效');
  } catch (error) { status(error.message, true); }
});
el('save').addEventListener('click', async () => {
  try {
    const config = validateConfig({name:el('name').value.trim(),portal:el('portal').value.trim(),mode:el('mode').value,template:el('template').value.trim(),routes:{...routes},hosts:el('hosts').value.split(/\s+/).filter(Boolean)});
    await chrome.storage.local.set({school:config});
    el('login').href = config.portal; el('login').hidden = false;
    status('已保存：' + config.name + '。请本人完成学校登录后测试论文访问。');
  } catch (error) { status(error.message, true); }
});
const {school} = await chrome.storage.local.get('school');
if (school) { fill(school); el('login').href = school.portal; el('login').hidden = false; }
else showMode();
