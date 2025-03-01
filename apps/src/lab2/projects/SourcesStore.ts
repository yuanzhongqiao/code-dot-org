/**
 * This file contains the SourcesStore interface and the local (saved to browser local storage)
 * and remote (saved to the server) implementations of the SourcesStore.
 * A SourcesStore manages the loading and saving of sources to the appropriate location.
 */
import {ProjectSources, ProjectType} from '../types';
import * as sourcesApi from './sourcesApi';
const {getTabId} = require('@cdo/apps/utils');
import {NetworkError} from '@cdo/apps/util/HttpClient';

export interface SourcesStore {
  load: (key: string) => Promise<ProjectSources>;

  save: (
    key: string,
    sources: ProjectSources,
    appType?: ProjectType
  ) => Promise<Response>;
}

export class LocalSourcesStore implements SourcesStore {
  load(key: string) {
    const source = {source: localStorage.getItem(key) || ''};
    return Promise.resolve(source);
  }

  save(key: string, sources: ProjectSources) {
    localStorage.setItem(key, JSON.stringify(sources));
    return Promise.resolve(new Response());
  }
}

export class RemoteSourcesStore implements SourcesStore {
  private readonly newVersionInterval: number = 15 * 60 * 1000; // 15 minutes
  private currentVersionId: string | null = null;
  private firstSaveTime: string | null = null;
  private lastSaveTime: number | null = null;

  async load(channelId: string) {
    const {response, value} = await sourcesApi.get(channelId);

    if (response.ok) {
      this.currentVersionId = response.headers.get('S3-Version-Id');
    }

    return value;
  }

  async save(
    channelId: string,
    sources: ProjectSources,
    projectType?: ProjectType,
    replace = false
  ) {
    let options = undefined;
    if (this.currentVersionId) {
      options = {
        currentVersion: this.currentVersionId,
        replace: replace || this.shouldReplace(),
        firstSaveTimestamp: encodeURIComponent(this.firstSaveTime || ''),
        tabId: getTabId(),
        projectType: projectType,
      };
    }
    const response = await sourcesApi.update(channelId, sources, options);

    if (response.ok) {
      this.lastSaveTime = Date.now();
      const {timestamp, versionId} = await response.json();
      this.firstSaveTime = this.firstSaveTime || timestamp;
      this.currentVersionId = versionId;
    } else {
      throw new NetworkError(
        response.status + ' ' + response.statusText,
        response
      );
    }
    return response;
  }

  shouldReplace(): boolean {
    if (!this.lastSaveTime) {
      return false;
    }

    return this.lastSaveTime + this.newVersionInterval < Date.now();
  }
}
