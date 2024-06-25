import {
  IPCCallArguments,
  IPCCallCallbackReturn,
  IPCCallKey,
  IPCReceiveArguments,
  IPCReceiverKey,
} from 'src/main/ipc/types';
import { StoreSchema, StoreSchemaKey } from 'src/main/store/types';
import { IpcRendererEvent } from 'electron';

export type CustomIPC = {
  on: <T extends IPCReceiverKey>(
    channel: T,
    cb: (event: IpcRendererEvent, ...args: IPCReceiveArguments<T>) => void,
  ) => void;
  send: <T extends IPCCallKey>(channel: T, ...args: IPCCallArguments<T>) => void;
  sendSync: <T extends IPCCallKey>(channel: T, ...args: IPCCallArguments<T>) => IPCCallCallbackReturn<T>;
  removeListener: <T extends IPCReceiverKey>(channel: T) => void;
};

export type CustomStore = {
  get: <T extends StoreSchemaKey>(key: T, overwriteIfEmpty: StoreSchema[T]) => StoreSchema[T];
  set: <T extends StoreSchemaKey>(key: T, value: StoreSchema[T]) => void;
};
