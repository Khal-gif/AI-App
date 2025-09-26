async function testHEICSupport() {
    try {
        console.log('📱 Testing HEIC Support...\n');
        
        // Check if HEIC is in supported formats
        const response = await fetch('http://localhost:3000/api/process-image');
        const data = await response.json();
        
        console.log('✅ API Status:', data.status);
        console.log('📋 Total supported formats:', data.supportedFormats?.length || 0);
        
        const heicFormats = data.supportedFormats?.filter(format => 
            format.includes('heic') || format.includes('heif')
        ) || [];
        
        console.log('📱 HEIC/HEIF formats supported:', heicFormats);
        
        if (heicFormats.length > 0) {
            console.log('✅ HEIC support is enabled!');
            console.log('\n📝 To test with real HEIC files:');
            console.log('1. Take a photo with iPhone/iPad (saves as HEIC by default)');
            console.log('2. Upload it to http://localhost:3000');
            console.log('3. Watch the conversion process in action');
            console.log('4. Check the Vision API analysis results');
        } else {
            console.log('❌ HEIC support not detected');
        }
        
        console.log('\n🔧 Available capabilities:');
        data.capabilities?.forEach(cap => {
            console.log(`• ${cap}`);
        });
        
    } catch (error) {
        console.log('❌ Test error:', error.message);
    }
}

testHEICSupport();