
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique Host ID based on the TATAMI convention.
 * Format: TATAMI-BUDDY-[ISO_COUNTRY_CODE]-[UUID_FIRST_8_CHARS]
 * Example: TATAMI-BUDDY-JP-A1B2C3D4
 * 
 * @param countryCode ISO 3166-1 alpha-2 country code (default: 'JP')
 * @returns Formatted Host ID string
 */
export function generateHostId(countryCode: string = 'JP'): string {
  const uuid = uuidv4();
  const shortUuid = uuid.split('-')[0].toUpperCase();
  const cleanCountryCode = countryCode.toUpperCase().slice(0, 2);
  
  return `TATAMI-BUDDY-${cleanCountryCode}-${shortUuid}`;
}

/**
 * Validates if a string follows the Host ID format
 * @param hostId The ID to validate
 * @returns boolean
 */
export function validateHostId(hostId: string): boolean {
  const regex = /^TATAMI-BUDDY-[A-Z]{2}-[A-Z0-9]{8}$/;
  return regex.test(hostId);
}

/**
 * Generates a Guide ID based on the Host ID and a sequence number.
 * Format: [HOST_ID]-[SEQUENCE] (e.g., TATAMI-BUDDY-JP-A1B2C3D4-01)
 * 
 * @param hostId The unique Host ID
 * @param sequence The sequence number of the guide (1-based)
 * @returns Formatted Guide ID string
 */
export function generateGuideId(hostId: string, sequence: number): string {
  const paddedSeq = sequence.toString().padStart(2, '0');
  return `${hostId}-${paddedSeq}`;
}

/**
 * Generates a unique Guide Number based on Country, Date, Time, and Sequence.
 * Format: [COUNTRY_CODE][YYYYMMDD][HHmm][SEQUENCE]
 * Example: JP202310271430001
 * 
 * @param country The country name or code
 * @param sequence The sequence number
 * @returns Formatted Guide Number string
 */
export function generateGuideNumber(country: string, sequence: number): string {
  // 1. Country Code (2 chars)
  const countryMap: Record<string, string> = {
    'Japan': 'JP',
    'China': 'CN',
    'USA': 'US',
    'United States': 'US',
    'Korea': 'KR',
    'Taiwan': 'TW',
    'Hong Kong': 'HK',
    'Thailand': 'TH',
    'Singapore': 'SG',
    'Malaysia': 'MY',
    'Vietnam': 'VN',
    'Philippines': 'PH',
    'Indonesia': 'ID',
    'Australia': 'AU',
    'United Kingdom': 'UK',
    'France': 'FR',
    'Germany': 'DE',
    'Italy': 'IT',
    'Spain': 'ES',
    'Canada': 'CA'
  };
  
  let code = countryMap[country] || country.slice(0, 2).toUpperCase();
  if (!code || code.length < 2) code = 'XX';
  
  // 2. Date & Time
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  
  // 3. Sequence (3 digits)
  const paddedSeq = sequence.toString().padStart(3, '0');
  
  return `${code}${year}${month}${day}${hour}${minute}${paddedSeq}`;
}
