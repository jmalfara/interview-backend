import { randomUUID } from "crypto";
import { off } from "process";

const memoryCache: Record<string, Resource<any>[]> = {};

export class Database {
  constructor() {}

  create<T>({ resourceKey, data }: CreateParams<T>): Resource<T> {
    const newResource = {
      id: randomUUID(),
      data: data,
    };

    const resources = memoryCache[`${resourceKey}`];
    if (!resources) {
      memoryCache[`${resourceKey}`] = [newResource];
    } else {
      memoryCache[`${resourceKey}`].push(newResource);
    }
    return newResource;
  }

  get<T>({ resourceKey, id }: GetParams): Resource<T> | undefined {
    const resources = memoryCache[`${resourceKey}`];
    const resource = resources.find((item) => item.id === id);
    return resource;
  }

  list<T>({
    resourceKey,
    limit = 10,
    page = 0,
    offset = 0,
  }: ListParams): Resource<T>[] {
    const resources = memoryCache[`${resourceKey}`];
    const start = page * offset;
    const end = start + limit;
    return resources.slice(start, end);
  }

  update<T>({ resourceKey, id, data }: UpdateParams<T>): Resource<T> {
    const resources = memoryCache[`${resourceKey}`];
    const resource = resources.find((item) => item.id === id);

    if (!resource) {
      throw new Error("resource_not_found");
    }

    const newResource = {
      ...resource,
      data: data,
    };

    const index = resources.indexOf(resource);
    resources[index] = newResource;

    memoryCache[`${resourceKey}`] = resources;
    return newResource;
  }

  delete<T>({ resourceKey, id }: DeleteParams<T>): void {
    const resources = memoryCache[`${resourceKey}`];
    const resource = resources.find((item) => item.id === id);

    if (!resource) {
      throw new Error("resource_not_found");
    }

    const index = resources.indexOf(resource);
    resources.splice(index, 1);

    memoryCache[`${resourceKey}`] = resources;
  }
}

interface Resource<T> {
  id: string;
  data: T;
}

interface GetParams {
  resourceKey: string;
  id: string;
}

interface ListParams {
  resourceKey: string;
  limit?: number;
  page?: number;
  offset?: number;
}

interface CreateParams<T> {
  resourceKey: string;
  data: T;
}

interface UpdateParams<T> {
  resourceKey: string;
  id: string;
  data: T;
}

interface DeleteParams<T> {
  resourceKey: string;
  id: string;
}
