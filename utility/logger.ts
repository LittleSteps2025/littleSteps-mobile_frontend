// Utility functions for logging objects and arrays to console
// Use these functions throughout your app for better debugging

export class ConsoleLogger {
  
  /**
   * Log object with pretty formatting
   * @param label - Label for the log
   * @param obj - Object to log
   * @param depth - How deep to stringify (default: 2)
   */
  static logObject(label: string, obj: any, depth = 2) {
    console.log(`=== ${label.toUpperCase()} ===`);
    console.log(JSON.stringify(obj, null, depth));
    console.log('='.repeat(label.length + 8));
  }

  /**
   * Log array with individual item details
   * @param label - Label for the log
   * @param arr - Array to log
   * @param itemProcessor - Optional function to process each item
   */
  static logArray(label: string, arr: any[], itemProcessor?: (item: any, index: number) => void) {
    console.log(`=== ${label.toUpperCase()} (${arr.length} items) ===`);
    
    if (arr.length === 0) {
      console.log('Array is empty');
      return;
    }

    arr.forEach((item, index) => {
      console.log(`\n--- Item ${index + 1} ---`);
      console.log(JSON.stringify(item, null, 2));
      
      if (itemProcessor) {
        itemProcessor(item, index);
      }
    });
    console.log('='.repeat(label.length + 8));
  }

  /**
   * Log children data specifically with formatted output
   * @param children - Array of child objects
   */
  static logChildren(children: any[]) {
    if (!children || children.length === 0) {
      console.log('=== CHILDREN DATA ===');
      console.log('No children found or children array is empty');
      return;
    }

    console.log('=== CHILDREN DATA ===');
    console.log(`Total children: ${children.length}`);
    
    children.forEach((child, index) => {
      console.log(`\n👶 Child ${index + 1}:`);
      console.log(`  🆔 ID: ${child.child_id || 'N/A'}`);
      console.log(`  📝 Name: ${child.name || 'N/A'}`);
      console.log(`  🎂 Age: ${child.age || 'N/A'}`);
      console.log(`  ⚧️ Gender: ${child.gender || 'N/A'}`);
      console.log(`  📅 DOB: ${child.dob || 'N/A'}`);
      console.log(`  🩸 Blood Type: ${child.blood_type || 'Not specified'}`);
      console.log(`  👥 Group ID: ${child.group_id || 'N/A'}`);
      console.log(`  ✅ Status: ${child.status || 'N/A'}`);
      console.log(`  📷 Image: ${child.image || 'No image'}`);
      console.log(`  📆 Created: ${child.created_at || 'N/A'}`);
      
      // Log the full object for reference
      console.log(`  🔧 Full Object:`, JSON.stringify(child, null, 2));
    });
    console.log('==================');
  }

  /**
   * Log API response structure for debugging
   * @param response - API response object
   * @param endpoint - API endpoint name for context
   */
  static logApiResponse(response: any, endpoint: string) {
    console.log(`=== API RESPONSE: ${endpoint.toUpperCase()} ===`);
    console.log('Response structure:');
    
    // Log top-level properties
    Object.keys(response).forEach(key => {
      const value = response[key];
      const type = Array.isArray(value) ? `array(${value.length})` : typeof value;
      console.log(`  ${key}: ${type}`);
    });
    
    // Log full response
    console.log('\nFull response:');
    console.log(JSON.stringify(response, null, 2));
    
    // If there's nested data, show its structure too
    if (response.data) {
      console.log('\nData structure:');
      Object.keys(response.data).forEach(key => {
        const value = response.data[key];
        const type = Array.isArray(value) ? `array(${value.length})` : typeof value;
        console.log(`  data.${key}: ${type}`);
      });
    }
    
    console.log('='.repeat(endpoint.length + 20));
  }

  /**
   * Log object properties with their types
   * @param obj - Object to analyze
   * @param label - Label for the log
   */
  static analyzeObject(obj: any, label = 'Object') {
    console.log(`=== ${label.toUpperCase()} ANALYSIS ===`);
    
    if (!obj) {
      console.log('Object is null or undefined');
      return;
    }
    
    console.log(`Type: ${typeof obj}`);
    console.log(`Is Array: ${Array.isArray(obj)}`);
    
    if (typeof obj === 'object') {
      console.log('Properties:');
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        let type: string = typeof value;
        
        if (Array.isArray(value)) {
          type = `array(${value.length})`;
        } else if (value === null) {
          type = 'null';
        } else if (value instanceof Date) {
          type = 'Date';
        }
        
        console.log(`  ${key}: ${type}`);
        
        // Show preview for strings and numbers
        if (typeof value === 'string' || typeof value === 'number') {
          const preview = String(value).length > 50 ? 
            String(value).substring(0, 50) + '...' : 
            String(value);
          console.log(`    └─ "${preview}"`);
        }
      });
      
      console.log('\nFull object:');
      console.log(JSON.stringify(obj, null, 2));
    }
    
    console.log('='.repeat(label.length + 20));
  }
}

// Example usage functions that you can call directly

/**
 * Quick log for debugging objects
 */
export const logObj = (obj: any, label = 'Debug Object') => {
  ConsoleLogger.logObject(label, obj);
};

/**
 * Quick log for debugging arrays
 */
export const logArr = (arr: any[], label = 'Debug Array') => {
  ConsoleLogger.logArray(label, arr);
};

/**
 * Quick log for children data
 */
export const logChildren = (children: any[]) => {
  ConsoleLogger.logChildren(children);
};

/**
 * Quick log for API responses
 */
export const logApiResponse = (response: any, endpoint: string) => {
  ConsoleLogger.logApiResponse(response, endpoint);
};

/**
 * Quick analyze object structure
 */
export const analyzeObj = (obj: any, label = 'Object') => {
  ConsoleLogger.analyzeObject(obj, label);
};

// Usage examples in comments:
/*

// Basic object logging
logObj(userData, 'User Data');

// Array logging with custom processing
ConsoleLogger.logArray('Children', childrenArray, (child, index) => {
  console.log(`Processing child ${index}: ${child.name}`);
});

// Children-specific logging
logChildren(childrenData);

// API response logging
logApiResponse(loginResponse, 'Parent Login');

// Object analysis
analyzeObj(complexObject, 'Complex Data Structure');

// Traditional logging (still works)
console.log('Simple data:', simpleData);
console.log('Object with formatting:', JSON.stringify(complexData, null, 2));

*/