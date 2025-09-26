const fs = require('fs');

// Simple test script for Vision API
async function testVisionAPI() {
    // Sample base64 encoded 1x1 pixel red image for testing
    const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const requestBody = {
        image: `data:image/png;base64,${testImage}`,
        contentType: 'product-description'
    };
    
    try {
        console.log('🧪 Testing Vision API...');
        
        const response = await fetch('http://localhost:3000/api/analyze-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Vision API test successful!');
            console.log('📊 Analysis results:', result.productAnalysis);
            console.log('⏱️ Processing time:', result.processingTime + 'ms');
        } else {
            console.log('❌ Vision API test failed:', result.error);
        }
        
    } catch (error) {
        console.log('❌ Test error:', error.message);
    }
}

testVisionAPI();