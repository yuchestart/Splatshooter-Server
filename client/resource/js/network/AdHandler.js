export { AdHandler };

class AdHandler
{

  hasAdBlocker;

  constructor(client)
  {
    this.client = client;
  }

  async detectAdBlock()
  {
    let adBlockEnabled = false;
    const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    try
    {
      await fetch(new Request(googleAdUrl)).catch(_ => adBlockEnabled = true);
    } catch (e)
    {
      adBlockEnabled = true;
    } finally
    {
      this.hasAdBlocker = adBlockEnabled;
    }
  }
}