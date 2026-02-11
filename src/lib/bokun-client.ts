import crypto from 'crypto';

interface BokunConfig {
  accessKey: string;
  secretKey: string;
  baseUrl?: string;
}

export class BokunClient {
  private accessKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor(config: BokunConfig) {
    this.accessKey = config.accessKey;
    this.secretKey = config.secretKey;
    this.baseUrl = config.baseUrl || 'https://api.bokun.io';
  }

  private getTimestamp(): string {
    // Format: yyyy-MM-dd HH:mm:ss
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  }

  private generateSignature(method: string, path: string, date: string): string {
    // Signature = Base64( HMAC-SHA1( date + accessKey + httpMethod + path ) )
    const stringToSign = `${date}${this.accessKey}${method.toUpperCase()}${path}`;
    
    return crypto
      .createHmac('sha1', this.secretKey)
      .update(stringToSign)
      .digest('base64');
  }

  public async request<T>(method: string, path: string, body?: any): Promise<T> {
    const date = this.getTimestamp();
    const signature = this.generateSignature(method, path, date);
    
    const url = `${this.baseUrl}${path}`;
    
    const headers: Record<string, string> = {
      'X-Bokun-Date': date,
      'X-Bokun-AccessKey': this.accessKey,
      'X-Bokun-Signature': signature,
      'Accept': 'application/json',
    };

    if (body) {
      headers['Content-Type'] = 'application/json;charset=UTF-8';
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Bokun API Error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  // --- Public Methods ---

  /**
   * Check connection / simple search
   */
  async checkConnection() {
    return this.request('GET', '/activity.json/search?limit=1');
  }

  /**
   * Create a new Experience Product (v2 API)
   * Note: This requires the specific payload structure for v2 experiences.
   */
  async createExperience(productData: any) {
    return this.request('POST', '/restapi/v2.0/experience', productData);
  }

  /**
   * Create a legacy Activity (v1 API)
   * Often easier for simple products.
   */
  async createActivity(activityData: any) {
    return this.request('POST', '/activity.json/create', activityData);
  }
}

// Singleton instance getter for server-side usage
export function getBokunClient() {
  const accessKey = process.env.BOKUN_ACCESS_KEY;
  const secretKey = process.env.BOKUN_SECRET_KEY;
  const isTest = process.env.BOKUN_ENV === 'test';

  if (!accessKey || !secretKey) {
    throw new Error("BOKUN_ACCESS_KEY and BOKUN_SECRET_KEY must be defined in environment variables.");
  }

  return new BokunClient({
    accessKey,
    secretKey,
    baseUrl: isTest ? 'https://api.bokuntest.com' : 'https://api.bokun.io'
  });
}
