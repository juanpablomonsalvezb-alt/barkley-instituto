// Google Drive Integration for Instituto Barkley
import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-drive',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Drive not connected');
  }
  return accessToken;
}

async function getUncachableGoogleDriveClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

export interface ModuleResource {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'infografia' | 'presentacion';
  embedUrl: string;
  mimeType: string;
}

export interface ModuleContent {
  moduleNumber: number;
  folderName: string;
  resources: ModuleResource[];
}

function getResourceType(mimeType: string, name: string): ModuleResource['type'] {
  if (mimeType.includes('video')) return 'video';
  if (mimeType.includes('audio')) return 'audio';
  if (mimeType.includes('image') || mimeType.includes('pdf')) return 'infografia';
  if (mimeType.includes('presentation') || mimeType.includes('slides')) return 'presentacion';
  if (mimeType.includes('document') || mimeType.includes('text')) return 'presentacion';
  
  const lowerName = name.toLowerCase();
  if (lowerName.includes('video')) return 'video';
  if (lowerName.includes('audio') || lowerName.includes('podcast')) return 'audio';
  if (lowerName.includes('infograf') || lowerName.includes('imagen')) return 'infografia';
  if (lowerName.includes('presentaci') || lowerName.includes('slides')) return 'presentacion';
  
  return 'infografia';
}

function getEmbedUrl(fileId: string, mimeType: string): string {
  if (mimeType.includes('presentation') || mimeType.includes('slides')) {
    return `https://docs.google.com/presentation/d/${fileId}/embed?start=false&loop=false&delayms=3000`;
  }
  if (mimeType.includes('document')) {
    return `https://docs.google.com/document/d/${fileId}/preview`;
  }
  if (mimeType.includes('spreadsheet')) {
    return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
  }
  if (mimeType.includes('form')) {
    return `https://docs.google.com/forms/d/${fileId}/viewform?embedded=true`;
  }
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export async function listModuleFolders(parentFolderId: string): Promise<ModuleContent[]> {
  const drive = await getUncachableGoogleDriveClient();
  
  const foldersResponse = await drive.files.list({
    q: `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    orderBy: 'name'
  });

  const folders = foldersResponse.data.files || [];
  const modules: ModuleContent[] = [];

  for (const folder of folders) {
    const match = folder.name?.match(/[Mm](?:ó|o)dulo\s*(\d+)/i) || folder.name?.match(/(\d+)/);
    const moduleNumber = match ? parseInt(match[1]) : modules.length + 1;

    const filesResponse = await drive.files.list({
      q: `'${folder.id}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, webViewLink)',
      orderBy: 'name'
    });

    const files = filesResponse.data.files || [];
    const resources: ModuleResource[] = files.map(file => ({
      id: file.id!,
      name: file.name!,
      type: getResourceType(file.mimeType || '', file.name || ''),
      embedUrl: getEmbedUrl(file.id!, file.mimeType || ''),
      mimeType: file.mimeType || ''
    }));

    modules.push({
      moduleNumber,
      folderName: folder.name!,
      resources
    });
  }

  return modules.sort((a, b) => a.moduleNumber - b.moduleNumber);
}

export async function getModuleResources(folderId: string): Promise<ModuleResource[]> {
  const drive = await getUncachableGoogleDriveClient();
  
  const filesResponse = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType, webViewLink)',
    orderBy: 'name'
  });

  const files = filesResponse.data.files || [];
  return files.map(file => ({
    id: file.id!,
    name: file.name!,
    type: getResourceType(file.mimeType || '', file.name || ''),
    embedUrl: getEmbedUrl(file.id!, file.mimeType || ''),
    mimeType: file.mimeType || ''
  }));
}

export async function searchFolderByName(folderName: string): Promise<{ id: string; name: string } | null> {
  const drive = await getUncachableGoogleDriveClient();
  
  const response = await drive.files.list({
    q: `name contains '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    pageSize: 1
  });

  const folders = response.data.files || [];
  if (folders.length > 0) {
    return { id: folders[0].id!, name: folders[0].name! };
  }
  return null;
}

export async function listRootFolders(): Promise<Array<{ id: string; name: string }>> {
  const drive = await getUncachableGoogleDriveClient();
  
  const response = await drive.files.list({
    q: `mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    orderBy: 'name',
    pageSize: 50
  });

  return (response.data.files || []).map(f => ({ id: f.id!, name: f.name! }));
}
