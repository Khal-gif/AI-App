const fs = require('fs');

// Test single template for cleaner output
async function testSingleTemplate() {
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const requestBody = {
        image: testImage,
        contentType: 'product-description'
    };
    
    try {
        console.log('🧪 Testing improved product description...\n');
        
        const response = await fetch('http://localhost:3000/api/analyze-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Content generated successfully!\n');
            console.log('📝 IMPROVED CONTENT:');
            console.log('='.repeat(50));
            console.log(result.generatedContent);
            console.log('='.repeat(50));
            console.log(`\n⏱️ Processing time: ${result.processingTime}ms`);
        } else {
            console.log('❌ Failed:', result.error);
        }
        
    } catch (error) {
        console.log('❌ Test error:', error.message);
    }
}

testSingleTemplate();