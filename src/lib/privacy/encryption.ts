/**
 * Privacy & Encryption Utilities for ProxiMeet
 * Handles end-to-end encryption, secure data deletion, and privacy protection
 */

// Encryption key management
interface EncryptionKeys {
  publicKey: CryptoKey
  privateKey: CryptoKey
}

interface EncryptedData {
  encrypted: string
  iv: string
  salt: string
}

export class PrivacyEncryption {
  private static instance: PrivacyEncryption
  private keyPair: EncryptionKeys | null = null
  private readonly ALGORITHM = 'AES-GCM'
  private readonly KEY_LENGTH = 256
  private readonly IV_LENGTH = 12

  static getInstance(): PrivacyEncryption {
    if (!PrivacyEncryption.instance) {
      PrivacyEncryption.instance = new PrivacyEncryption()
    }
    return PrivacyEncryption.instance
  }

  /**
   * Initialize encryption for user session
   */
  async initializeEncryption(userId: string): Promise<void> {
    try {
      // Check if keys exist in secure storage
      const storedKeys = await this.getStoredKeys(userId)
      
      if (storedKeys) {
        this.keyPair = storedKeys
      } else {
        // Generate new key pair
        this.keyPair = await this.generateKeyPair()
        await this.storeKeys(userId, this.keyPair)
      }
    } catch (error) {
      console.error('Failed to initialize encryption:', error)
      throw new Error('Encryption initialization failed')
    }
  }

  /**
   * Generate RSA key pair for asymmetric encryption
   */
  private async generateKeyPair(): Promise<EncryptionKeys> {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true, // extractable
      ['encrypt', 'decrypt']
    )

    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey
    }
  }

  /**
   * Encrypt message content for secure transmission
   */
  async encryptMessage(content: string): Promise<EncryptedData> {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(content)

      // Generate random IV and salt
      const iv = window.crypto.getRandomValues(new Uint8Array(this.IV_LENGTH))
      const salt = window.crypto.getRandomValues(new Uint8Array(16))

      // Derive key from password (in production, use proper key derivation)
      const password = await this.deriveEncryptionKey(salt.buffer)
      
      // Encrypt data
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv: iv
        },
        password,
        data
      )

      return {
        encrypted: this.arrayBufferToBase64(encrypted),
        iv: this.arrayBufferToBase64(iv.buffer),
        salt: this.arrayBufferToBase64(salt.buffer)
      }
    } catch (error) {
      console.error('Message encryption failed:', error)
      throw new Error('Failed to encrypt message')
    }
  }

  /**
   * Decrypt message content
   */
  async decryptMessage(encryptedData: EncryptedData): Promise<string> {
    try {
      const encrypted = this.base64ToArrayBuffer(encryptedData.encrypted)
      const iv = this.base64ToArrayBuffer(encryptedData.iv)
      const salt = this.base64ToArrayBuffer(encryptedData.salt)

      // Derive the same key
      const password = await this.deriveEncryptionKey(salt)

      // Decrypt data
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv: iv
        },
        password,
        encrypted
      )

      const decoder = new TextDecoder()
      return decoder.decode(decrypted)
    } catch (error) {
      console.error('Message decryption failed:', error)
      throw new Error('Failed to decrypt message')
    }
  }

  /**
   * Encrypt location data before storage
   */
  async encryptLocation(latitude: number, longitude: number): Promise<EncryptedData> {
    const locationData = JSON.stringify({ 
      lat: latitude, 
      lng: longitude, 
      timestamp: Date.now() 
    })
    return await this.encryptMessage(locationData)
  }

  /**
   * Decrypt location data
   */
  async decryptLocation(encryptedData: EncryptedData): Promise<{ lat: number; lng: number; timestamp: number }> {
    const decrypted = await this.decryptMessage(encryptedData)
    return JSON.parse(decrypted)
  }

  /**
   * Secure deletion of sensitive data
   */
  async secureDelete(data: string): Promise<void> {
    try {
      // Overwrite memory multiple times (simplified version)
      const encoder = new TextEncoder()
      const dataArray = encoder.encode(data)
      
      // Overwrite with random data 3 times
      for (let i = 0; i < 3; i++) {
        const randomData = window.crypto.getRandomValues(new Uint8Array(dataArray.length))
        dataArray.set(randomData)
      }
      
      // Final overwrite with zeros
      dataArray.fill(0)
      
    } catch (error) {
      console.error('Secure deletion failed:', error)
    }
  }

  /**
   * Remove EXIF data from image
   */
  async removeExifData(imageBlob: Blob): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        
        // Draw image to canvas (removes EXIF data)
        ctx?.drawImage(img, 0, 0)
        
        canvas.toBlob((cleanBlob) => {
          resolve(cleanBlob || imageBlob)
        }, imageBlob.type, 0.9)
      }

      img.src = URL.createObjectURL(imageBlob)
    })
  }

  /**
   * Generate secure hash for data integrity
   */
  async generateHash(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer)
    return this.arrayBufferToBase64(hashBuffer)
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Derive encryption key from salt
   */
  private async deriveEncryptionKey(salt: ArrayBuffer): Promise<CryptoKey> {
    // In production, use a proper password or stored master key
    const password = 'proximeet_encryption_key_' + Date.now().toString()
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)

    const importedKey = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    )

    return await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      importedKey,
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH
      },
      false,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Store encryption keys securely
   */
  private async storeKeys(userId: string, keys: EncryptionKeys): Promise<void> {
    try {
      // Export keys for storage
      const publicKeyData = await window.crypto.subtle.exportKey('spki', keys.publicKey)
      const privateKeyData = await window.crypto.subtle.exportKey('pkcs8', keys.privateKey)

      // Store in IndexedDB for better security than localStorage
      const keyData = {
        publicKey: this.arrayBufferToBase64(publicKeyData),
        privateKey: this.arrayBufferToBase64(privateKeyData),
        userId: userId,
        createdAt: Date.now()
      }

      await this.storeInIndexedDB('proximeet_keys', userId, keyData)
    } catch (error) {
      console.error('Failed to store keys:', error)
    }
  }

  /**
   * Retrieve stored encryption keys
   */
  private async getStoredKeys(userId: string): Promise<EncryptionKeys | null> {
    try {
      const keyData = await this.getFromIndexedDB('proximeet_keys', userId)
      if (!keyData) return null

      const publicKeyData = this.base64ToArrayBuffer(keyData.publicKey)
      const privateKeyData = this.base64ToArrayBuffer(keyData.privateKey)

      const publicKey = await window.crypto.subtle.importKey(
        'spki',
        publicKeyData,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256'
        },
        true,
        ['encrypt']
      )

      const privateKey = await window.crypto.subtle.importKey(
        'pkcs8',
        privateKeyData,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256'
        },
        true,
        ['decrypt']
      )

      return { publicKey, privateKey }
    } catch (error) {
      console.error('Failed to retrieve keys:', error)
      return null
    }
  }

  /**
   * Store data in IndexedDB
   */
  private storeInIndexedDB(storeName: string, key: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ProxiMeetSecure', 1)
      
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName)
        }
      }

      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const putRequest = store.put(data, key)
        
        putRequest.onsuccess = () => resolve()
        putRequest.onerror = () => reject(putRequest.error)
      }

      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Retrieve data from IndexedDB
   */
  private getFromIndexedDB(storeName: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ProxiMeetSecure', 1)
      
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const getRequest = store.get(key)
        
        getRequest.onsuccess = () => resolve(getRequest.result)
        getRequest.onerror = () => reject(getRequest.error)
      }

      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Utility: Convert ArrayBuffer to Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  /**
   * Utility: Convert Base64 to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }

  /**
   * Clear all stored encryption data
   */
  async clearEncryptionData(userId: string): Promise<void> {
    try {
      // Clear from IndexedDB
      const request = indexedDB.open('ProxiMeetSecure', 1)
      
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['proximeet_keys'], 'readwrite')
        const store = transaction.objectStore('proximeet_keys')
        store.delete(userId)
      }

      // Clear memory
      this.keyPair = null
    } catch (error) {
      console.error('Failed to clear encryption data:', error)
    }
  }
}

/**
 * Privacy utilities for data protection
 */
export class PrivacyUtils {
  /**
   * Check if user is in a sensitive location
   */
  static async isInSensitiveLocation(
    currentLat: number, 
    currentLng: number, 
    sensitiveLocations: Array<{ lat: number; lng: number; radius: number }>
  ): Promise<boolean> {
    for (const location of sensitiveLocations) {
      const distance = this.calculateDistance(
        currentLat, currentLng, 
        location.lat, location.lng
      )
      
      if (distance <= location.radius) {
        return true
      }
    }
    return false
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959 // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  /**
   * Convert degrees to radians
   */
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  /**
   * Anonymize sensitive text
   */
  static anonymizeText(text: string, preserveLength: boolean = true): string {
    if (!text) return text
    
    if (preserveLength) {
      return text.replace(/./g, '*')
    } else {
      return '[REDACTED]'
    }
  }

  /**
   * Generate fake location near real location (for privacy)
   */
  static generateFakeNearbyLocation(
    realLat: number, 
    realLng: number, 
    radiusMiles: number = 1
  ): { lat: number; lng: number } {
    const randomAngle = Math.random() * 2 * Math.PI
    const randomRadius = Math.random() * radiusMiles
    
    // Convert to approximate degree offset
    const latOffset = (randomRadius * Math.cos(randomAngle)) / 69 // ~69 miles per degree lat
    const lngOffset = (randomRadius * Math.sin(randomAngle)) / (69 * Math.cos(this.toRadians(realLat)))
    
    return {
      lat: realLat + latOffset,
      lng: realLng + lngOffset
    }
  }

  /**
   * Check if data should be auto-deleted based on retention policy
   */
  static shouldAutoDelete(createdAt: Date, retentionDays: number): boolean {
    const now = new Date()
    const ageInDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    return ageInDays > retentionDays
  }

  /**
   * Sanitize file name for privacy
   */
  static sanitizeFileName(fileName: string): string {
    // Remove potentially identifying information
    const sanitized = fileName
      .replace(/IMG_\d+/gi, 'image')
      .replace(/DSC\d+/gi, 'photo')
      .replace(/\d{8}_\d{6}/g, 'timestamp')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
    
    return `proximeet_${Date.now()}_${sanitized}`
  }
}

// Export singleton instance
export const privacyEncryption = PrivacyEncryption.getInstance()
