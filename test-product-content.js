const fs = require('fs');

// Test product content generation with different templates
async function testProductContent() {
    // Sample base64 encoded image for testing (small test image)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const templates = [
        'product-description',
        'social-media', 
        'features-list',
        'ecommerce-listing',
        'custom'
    ];
    
    console.log('🧪 Testing Product Content Generation...');
    console.log('📦 Testing all available templates\n');
    
    for (const template of templates) {
        try {
            const requestBody = {
                image: testImage,
                contentType: template,
                customPrompt: template === 'custom' ? 'Create marketing copy that emphasizes quality and innovation' : undefined
            };
            
            console.log(`\n🎯 Testing template: ${template.toUpperCase()}`);
            console.log('⏱️ Processing...');
            
            const response = await fetch('http://localhost:3000/api/analyze-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Content generated successfully!');
                console.log('📊 Analysis:', {
                    category: result.productAnalysis?.category,
                    features: result.productAnalysis?.features?.slice(0, 3),
                    labels: result.productAnalysis?.labels?.slice(0, 3)
                });
                console.log('\n📝 Generated Content:');
                console.log('---');
                console.log(result.generatedContent?.substring(0, 300) + '...');
                console.log('---');
                console.log('⏱️ Processing time:', result.processingTime + 'ms\n');
            } else {
                console.log('❌ Failed:', result.error);
            }
            
        } catch (error) {
            console.log('❌ Test error:', error.message);
        }
    }
    
    console.log('\n🎉 All template tests completed!');
}

testProductContent();