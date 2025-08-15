const axios = require('axios');

// PayPal API credentials
const CLIENT_ID = 'Abnz_dIwA50AWSeKzCk-021q3fosUWLg6JDFmmmKFmVawGGhNaJr9rEjPSWEiqLdk5Qnn0NTR_XsZarX';
const CLIENT_SECRET = 'EP17NhhOFHFwhSwMX5mlLf3WY46hfUxt8QRXxJcJC6QOYdIQEvNj-_7HxRbtO8hnmKlfsIPk8zW2etha';
const BASE_URL = 'https://api-m.paypal.com'; // Live environment

async function getAccessToken() {
    try {
        const response = await axios.post(`${BASE_URL}/v1/oauth2/token`, 
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response?.data || error.message);
        throw error;
    }
}

async function createWebExperienceProfile(accessToken) {
    try {
        const profileData = {
            name: "RilindiShpkWebProfile",
            presentation: {
                brand_name: "Rilindi Shpk",
                logo_image: "https://rilindishpk.com/agjensiLogo.jpg",
                locale_code: "en_US"
            },
            input_fields: {
                allow_note: true,
                no_shipping: 1,
                address_override: 1
            },
            flow_config: {
                landing_page_type: "billing",
                bank_txn_pending_url: "https://rilindishpk.com",
                return_uri_http_method: "GET"
            }
        };

        const response = await axios.post(
            `${BASE_URL}/v1/payment-experience/web-profiles`,
            profileData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        console.log('✅ Web Experience Profile created successfully!');
        console.log('Profile ID:', response.data.id);
        console.log('Profile Name:', response.data.name);
        console.log('Full Response:', JSON.stringify(response.data, null, 2));
        
        return response.data.id;
    } catch (error) {
        console.error('❌ Error creating web experience profile:', error.response?.data || error.message);
        throw error;
    }
}

async function listWebExperienceProfiles(accessToken) {
    try {
        const response = await axios.get(
            `${BASE_URL}/v1/payment-experience/web-profiles`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        console.log('📋 Existing Web Experience Profiles:');
        response.data.forEach(profile => {
            console.log(`- ID: ${profile.id}, Name: ${profile.name}`);
        });
        
        return response.data;
    } catch (error) {
        console.error('❌ Error listing web experience profiles:', error.response?.data || error.message);
        throw error;
    }
}

async function main() {
    console.log('🚀 Starting PayPal Web Experience Profile creation...');
    console.log('Domain: rilindishpk.com');
    console.log('Client ID:', CLIENT_ID);
    
    try {
        // Get access token
        console.log('\n🔑 Getting access token...');
        const accessToken = await getAccessToken();
        console.log('✅ Access token obtained');
        
        // List existing profiles
        console.log('\n📋 Checking existing profiles...');
        await listWebExperienceProfiles(accessToken);
        
        // Create new profile
        console.log('\n🛠️ Creating new web experience profile...');
        const profileId = await createWebExperienceProfile(accessToken);
        
        console.log('\n🎉 SUCCESS! Your web experience profile has been created.');
        console.log('Profile ID:', profileId);
        console.log('\n📝 Next steps:');
        console.log('1. Update your PayPal integration to use this profile ID');
        console.log('2. Test your payment flow again');
        
    } catch (error) {
        console.error('\n❌ Failed to create web experience profile:', error.message);
        console.log('\n💡 Make sure to:');
        console.log('1. Replace YOUR_CLIENT_SECRET_HERE with your actual client secret');
        console.log('2. Check that your PayPal app has the right permissions');
    }
}

// Instructions for running this script
console.log('📋 INSTRUCTIONS:');
console.log('1. Install axios: npm install axios');
console.log('2. Replace YOUR_CLIENT_SECRET_HERE with your actual PayPal client secret');
console.log('3. Run: node create-web-experience.js');
console.log('\n' + '='.repeat(50) + '\n');

// Run the script
main();
