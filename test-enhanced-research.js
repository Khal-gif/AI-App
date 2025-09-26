async function testEnhancedResearch() {
    // Test with a simple image to see the research enhancement
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    try {
        console.log('🧪 Testing Enhanced API with Internet Research...\n');
        
        const response = await fetch('http://localhost:3000/api/analyze-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: testImage,
                contentType: 'product-description'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ ENHANCED CONTENT WITH INTERNET RESEARCH:');
            console.log('='.repeat(70));
            console.log('🔍 Analysis:', result.productAnalysis?.category);
            console.log('🔬 Research Enhanced:', !!result.productAnalysis?.research);
            console.log('\n📝 Enhanced Content:');
            console.log(result.generatedContent);
            console.log('='.repeat(70));
            console.log(`⏱️ Processing time: ${result.processingTime}ms`);
            
            if (result.productAnalysis?.research) {
                console.log('\n📊 Research Data Found:');
                console.log('• Search Results:', result.productAnalysis.research.searchResults?.length || 0);
                console.log('• Pricing Info:', result.productAnalysis.research.pricing?.length || 0);
                console.log('• Market Context:', !!result.productAnalysis.research.marketContext);
            }
        } else {
            console.log('❌ Test failed:', result.error);
        }
        
    } catch (error) {
        console.log('❌ Test error:', error.message);
    }
}

testEnhancedResearch();