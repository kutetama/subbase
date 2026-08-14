export const FIGMA_ICON_NAMES = [
  'SignPlus','SignMinus','SignMulti','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Out','In','InOut','Missed','Check','Download','Upload','Top','Search','Menu','Filter','Ticket','Setting','Lock','Services','Unlock','Submenu','Guide','Faceid','Fingerprint','Edit','Edit2','Duplicate','Delete','Folder','Ring','Music','Camera','Photo','Timer','Alarm','CurrentLocation','Location','Like','Favorite','Bookmark','Share','New','Info','Error','Help','TextDelete','Add','Block','Reload','3PP-Login','Reset','Send','Bluetooth','Battery','Wifi-Lock','Wifi','User','Volume','Mic','Call','Call-Cellular','Notification','Notification Off','Price','Home','Link','Message','Contact','Bill','Data','Attach','Security','Extend','Reduce',
] as const;

export const figmaIconId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
