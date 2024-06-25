export type IPCCalls = {
  openDirectory: {
    arguments: never;
    returns: never;
  };
  openFile: {
    arguments: never;
    returns: never;
  };
};
export type IPCCallKey = keyof IPCCalls;
export type IPCCallArguments<T extends IPCCallKey> = IPCCalls[T]['arguments'] extends never
  ? [undefined?]
  : [IPCCalls[T]['arguments']];
export type IPCCallCallbackReturn<T extends IPCCallKey> = IPCCalls[T]['returns'] extends never
  ? void
  : IPCCalls[T]['returns'];

export type IPCReceivers = {
  filesFetched: {
    paths: string[];
    navigateTo?: string;
  };
  startFilesFetch: void;
  infoToast: string;
};
export type IPCReceiverKey = keyof IPCReceivers;
export type IPCReceiveArguments<T extends IPCReceiverKey> = IPCReceivers[T] extends void
  ? [undefined?]
  : [IPCReceivers[T]];
