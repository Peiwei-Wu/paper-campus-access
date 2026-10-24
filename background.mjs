import { campusUrl } from './route.mjs';

async function openPaper(input) {
  const {school} = await chrome.storage.local.get('school');
  if (!school) return chrome.runtime.openOptionsPage();
  let url;
  try { url = campusUrl(input, school); } catch { return chrome.runtime.openOptionsPage(); }
  return chrome.tabs.create({url: url || chrome.runtime.getURL('help.html')});
}
chrome.action.onClicked.addListener(tab => { void openPaper(tab.url); });
chrome.runtime.onInstalled.addListener(details => {
  chrome.contextMenus.removeAll(() => chrome.contextMenus.create({id: 'campus-paper', title: '通过本校打开论文', contexts: ['link']}));
  if (details.reason === 'install') void chrome.runtime.openOptionsPage();
});
chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === 'campus-paper') void openPaper(info.linkUrl);
});
