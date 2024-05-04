export interface ResultAndTabId<Result> {
  tabId: number | undefined;
  results: Array<
    chrome.scripting.InjectionResult<chrome.scripting.Awaited<Result>>
  >;
}

export class Utils {
  private constructor() {}

  public static logJsonStringified(object: any): void {
    console.log(JSON.stringify(object, null, 5));
  }

  public static async getTabUrl(): Promise<String> {
    const tabData = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    return tabData[0].url ?? "";
  }

  public static async executeScriptOnCurrentTab<Result>(
    func: () => Result
  ): Promise<ResultAndTabId<Result>> {
    const tabData = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tabId = tabData[0].id;

    let results: chrome.scripting.InjectionResult<
      chrome.scripting.Awaited<Result>
    >[] = [];

    if (tabId) {
      results = await chrome.scripting.executeScript({
        target: { tabId },
        func,
      });
    }

    return {
      tabId,
      results,
    };
  }
}
