export class Config {
  constructor() {}

  public static readonly PROXY_SERVER = "PROXY_SERVER";

  public static getConfigEnv(): NodeJS.ProcessEnv {
    return process.env;
  }

  public static getProperty(property: string): string {
    return process.env[property] ?? "";
  }

  public static async getProxyServer(): Promise<string> {
    let proxyServer: string;

    const localStorageProxy = await chrome.storage.local.get(
      Config.PROXY_SERVER
    );

    if (!localStorageProxy[Config.PROXY_SERVER]) {
      proxyServer = Config.getProperty(Config.PROXY_SERVER);

      await Config.setLocalStorageProxyServer(proxyServer);
    } else {
      proxyServer = localStorageProxy[Config.PROXY_SERVER];
    }

    return proxyServer;
  }

  public static async setLocalStorageProxyServer(
    proxyServer: string
  ): Promise<void> {
    let proxyServerItem: { [key: string]: any } = {};
    proxyServerItem[Config.PROXY_SERVER] = proxyServer;

    await chrome.storage.local.set(proxyServerItem);
  }
}
