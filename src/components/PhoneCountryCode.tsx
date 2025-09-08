// lib/phone-regex.ts

export const phoneRegexMap: Record<string, RegExp> = {
  "+91": /^[6-9]\d{9}$/,              // India
  "+1": /^[2-9]\d{2}[2-9]\d{6}$/,     // US/Canada
  "+44": /^7\d{9}$/,                  // UK
  "+61": /^4\d{8}$/,                  // Australia
  "+81": /^(\d{1,4})\d{6,9}$/,        // Japan
  "+49": /^1[5-7]\d{8}$/,             // Germany
  "+33": /^6\d{8}|7\d{8}$/,           // France
  "+86": /^1[3-9]\d{9}$/,             // China
  "+971": /^5[0-9]\d{7}$/,            // UAE
  "+880": /^1[3-9]\d{8}$/,            // Bangladesh
  "+92": /^3\d{9}$/,                  // Pakistan
  "+7": /^[489]\d{9}$/,               // Russia
  "+62": /^8[1-9]\d{6,9}$/,           // Indonesia
  "+234": /^7\d{9}|8\d{9}|9\d{9}$/,   // Nigeria
  "+55": /^([1-9]{2})9\d{8}$/,        // Brazil
  "+20": /^1[0-2]\d{8}$/              // Egypt
}

export const countryCodes = Object.keys(phoneRegexMap)
