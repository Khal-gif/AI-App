async function testWithRealImage() {
    try {
        // Convert a real image URL to base64
        const imageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'; // Nike shoe image
        
        console.log('🔄 Fetching real product image...');
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64}`;
        
        console.log('📸 Testing with real Nike shoe image...\n');
        
        const apiResponse = await fetch('http://localhost:3000/api/analyze-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: dataUrl,
                contentType: 'social-media'
            })
        });
        
        const result = await apiResponse.json();
        
        if (result.success) {
            console.log('✅ REAL CONTENT GENERATED:');
            console.log('='.repeat(60));
            console.log('🔍 Analysis:', result.productAnalysis);
            console.log('\n📝 Generated Content:');
            console.log(result.generatedContent);
            console.log('='.repeat(60));
        } else {
            console.log('❌ Error:', result.error);
        }
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
    }
}

testWithRealImage();