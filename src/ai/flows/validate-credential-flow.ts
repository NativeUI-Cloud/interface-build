
'use server';
/**
 * @fileOverview A Genkit flow to validate API credentials for various LLM providers.
 *
 * - validateCredential - A function that validates credentials.
 * - ValidateCredentialInput - The input type for the validateCredential function.
 * - ValidateCredentialOutput - The return type for the validateCredential function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import OpenAI from 'openai';

const ValidateCredentialInputSchema = z.object({
  providerId: z.string().describe('The ID of the LLM provider (e.g., "openai", "google", "anthropic", "telegram_bot", "github_api", "gitlab_api", "trello_api", "dropbox_api", "google_drive_api", "bitquery_api", "firebase", "notion_api", "blockchain_node_rpc", "etherscan_api", "the_graph_api", "shopify_admin_api", "pubmed_api").'),
  apiKey: z.string().optional().describe('The API key or token for the provider. Optional for providers like Ollama.'),
  endpoint: z.string().optional().describe('The API endpoint, if applicable (e.g., GitHub server URL, Ollama endpoint, GitLab server URL, Etherscan base URL, Subgraph query URL, Shopify store URL).'),
  modelId: z.string().optional().describe('A specific model ID to test against, if applicable.'),
});
export type ValidateCredentialInput = z.infer<typeof ValidateCredentialInputSchema>;

const ValidateCredentialOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the credential is valid.'),
  error: z.string().optional().describe('Error message if validation failed.'),
});
export type ValidateCredentialOutput = z.infer<typeof ValidateCredentialOutputSchema>;

export async function validateCredential(input: ValidateCredentialInput): Promise<ValidateCredentialOutput> {
  return validateCredentialFlow(input);
}

const validateCredentialFlow = ai.defineFlow(
  {
    name: 'validateCredentialFlow',
    inputSchema: ValidateCredentialInputSchema,
    outputSchema: ValidateCredentialOutputSchema,
  },
  async (input: ValidateCredentialInput): Promise<ValidateCredentialOutput> => {
    const { providerId, apiKey, endpoint, modelId } = input;
    const effectiveApiKey = apiKey || ""; 

    let testUrlToUse: string | undefined;
    const fetchOptions: RequestInit = { headers: {} };

    const providersRequiringKey = [
      'openai', 'anthropic', 'google', 'mistral', 'deepseek', 'groq', 
      'azure-openai', 'telegram_bot', 'github_api', 'gitlab_api', 
      'dropbox_api', 'trello_api', 'bitquery_api', 'firebase', 'notion_api',
      'etherscan_api', 'shopify_admin_api' 
      // 'pubmed_api' (key is optional), 'blockchain_node_rpc' and 'the_graph_api' might be optional
    ];
    if (!effectiveApiKey && providersRequiringKey.includes(providerId)) {
         return { isValid: false, error: `API key/token is missing and required for ${providerId}.` };
    }
    
    // Default Authorization header if not handled by specific cases
    if (effectiveApiKey && !['google', 'azure-openai', 'ollama', 'telegram_bot', 'github_api', 'gitlab_api', 'trello_api', 'bitquery_api', 'firebase', 'notion_api', 'etherscan_api', 'the_graph_api', 'shopify_admin_api', 'pubmed_api'].includes(providerId)) {
        fetchOptions.headers!['Authorization'] = `Bearer ${effectiveApiKey.trim()}`;
    }


    try {
      switch (providerId) {
        case 'openai':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for OpenAI.' };
          const openaiBaseUrl = (endpoint || 'https://api.openai.com/v1').replace(/\/$/, '');
          try {
            const openaiClient = new OpenAI({
              apiKey: effectiveApiKey.trim(),
              baseURL: openaiBaseUrl,
            });
            await openaiClient.models.list(); 
            return { isValid: true };
          } catch (e: any) {
            let errorMessage = 'OpenAI API key validation failed.';
            if (e instanceof OpenAI.APIError) {
              errorMessage = `OpenAI API Error: ${e.status} ${e.name} - ${e.message}`;
               if (e.status === 401) errorMessage += " Please check your API key and permissions.";
               if (e.status === 404) errorMessage += " Ensure the endpoint is correct or model exists.";
            } else if (e.message) {
              errorMessage = e.message;
            }
            return { isValid: false, error: errorMessage };
          }

        case 'anthropic':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for Anthropic.' };
          const anthropicBase = (endpoint || 'https://api.anthropic.com/v1').replace(/\/$/, '');
          testUrlToUse = `${anthropicBase}/messages`; 
          fetchOptions.method = 'POST';
          fetchOptions.headers!['x-api-key'] = effectiveApiKey.trim(); 
          fetchOptions.headers!['anthropic-version'] = '2023-06-01';
          fetchOptions.headers!['content-type'] = 'application/json';
          fetchOptions.body = JSON.stringify({
              model: modelId || "claude-3-haiku-20240307", 
              max_tokens: 1,
              messages: [{role: "user", content: "test"}]
          });
          break;

        case 'google':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for Google AI.' };
          const googleBase = (endpoint || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
          testUrlToUse = `${googleBase}/models?key=${effectiveApiKey.trim()}`;
          fetchOptions.method = 'GET';
          delete fetchOptions.headers!['Authorization']; 
          break;

        case 'mistral':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for Mistral AI.' };
          const mistralBase = (endpoint || 'https://api.mistral.ai/v1').replace(/\/$/, '');
          testUrlToUse = `${mistralBase}/models`;
          fetchOptions.method = 'GET';
           fetchOptions.headers!['Authorization'] = `Bearer ${effectiveApiKey.trim()}`;
          break;

        case 'deepseek':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for DeepSeek.' };
          const deepseekBase = (endpoint || 'https://api.deepseek.com/v1').replace(/\/$/, '');
          testUrlToUse = `${deepseekBase}/models`;
          fetchOptions.method = 'GET';
           fetchOptions.headers!['Authorization'] = `Bearer ${effectiveApiKey.trim()}`;
          break;

        case 'groq':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for Groq.' };
          const groqBase = (endpoint || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
          testUrlToUse = `${groqBase}/models`; 
          fetchOptions.method = 'GET';
           fetchOptions.headers!['Authorization'] = `Bearer ${effectiveApiKey.trim()}`;
          break;

        case 'azure-openai':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for Azure OpenAI.' };
          if (!endpoint) return { isValid: false, error: 'Azure Endpoint (Resource Name) is required.' };
          testUrlToUse = `https://${endpoint.replace(/^https?:\/\//, '').replace(/\/$/, '')}/openai/models?api-version=2023-05-15`;
          fetchOptions.headers!['api-key'] = effectiveApiKey.trim();
          delete fetchOptions.headers!['Authorization']; 
          fetchOptions.method = 'GET';
          break;

        case 'ollama':
          if (!endpoint) return { isValid: false, error: 'Ollama Endpoint is required (e.g., http://localhost:11434).' };
          testUrlToUse = `${endpoint.replace(/\/$/, '')}/api/tags`; 
          delete fetchOptions.headers!['Authorization'];
          fetchOptions.method = 'GET';
          break;
        
        case 'telegram_bot':
          if (!effectiveApiKey) return { isValid: false, error: 'Bot Token is required for Telegram.' };
          testUrlToUse = `https://api.telegram.org/bot${effectiveApiKey.trim()}/getMe`;
          fetchOptions.method = 'GET';
          delete fetchOptions.headers!['Authorization']; 
          break;

        case 'github_api':
          if (!effectiveApiKey) return { isValid: false, error: 'Access Token is required for GitHub API.' };
          const githubServer = (endpoint || 'https://api.github.com').replace(/\/$/, '');
          testUrlToUse = `${githubServer}/user`;
          fetchOptions.method = 'GET';
          fetchOptions.headers!['Authorization'] = `token ${effectiveApiKey.trim()}`;
          fetchOptions.headers!['Accept'] = 'application/vnd.github.v3+json';
          break;
        
        case 'gitlab_api':
            if (!effectiveApiKey) return { isValid: false, error: 'Access Token is required for GitLab API.' };
            const gitlabServer = (endpoint || 'https://gitlab.com').replace(/\/$/, '');
            testUrlToUse = `${gitlabServer}/api/v4/user`;
            fetchOptions.method = 'GET';
            fetchOptions.headers!['Authorization'] = `Bearer ${effectiveApiKey.trim()}`; 
            break;

        case 'trello_api':
            if (!effectiveApiKey || !effectiveApiKey.includes('key=') || !effectiveApiKey.includes('token=')) {
                return { isValid: false, error: 'Trello API Key and Token are required in format "key=API_KEY&token=API_TOKEN".' };
            }
            const trelloBase = (endpoint || 'https://api.trello.com').replace(/\/$/, '');
            testUrlToUse = `${trelloBase}/1/members/me?${effectiveApiKey.trim()}`;
            fetchOptions.method = 'GET';
            delete fetchOptions.headers!['Authorization'];
            break;

        case 'dropbox_api':
            if (!effectiveApiKey) return { isValid: false, error: 'Access Token is required for Dropbox API.' };
            const dropboxBase = (endpoint || 'https://api.dropboxapi.com').replace(/\/$/, '');
            testUrlToUse = `${dropboxBase}/2/users/get_current_account`;
            fetchOptions.method = 'POST'; 
            fetchOptions.headers!['Authorization'] = `Bearer ${effectiveApiKey.trim()}`;
            fetchOptions.body = null; 
            break;
        
        case 'google_drive_api':
            console.warn(`Validation for ${providerId} is a placeholder. True validation requires OAuth2 flow or service account.`);
            if (!effectiveApiKey) return { isValid: false, error: 'API Key / Credentials required for Google Drive (placeholder check).' };
            return { isValid: true, error: "Placeholder validation: Assumed valid if API key/token is present. Full validation requires OAuth." };

        case 'bitquery_api':
            if (!effectiveApiKey) return { isValid: false, error: 'API Key is required for Bitquery.' };
            testUrlToUse = (endpoint || 'https://graphql.bitquery.io').replace(/\/$/, '');
            fetchOptions.method = 'POST';
            fetchOptions.headers!['Content-Type'] = 'application/json';
            fetchOptions.headers!['X-API-KEY'] = effectiveApiKey.trim();
            fetchOptions.body = JSON.stringify({ query: "query { bitquery { status } }" });
            delete fetchOptions.headers!['Authorization'];
            break;

        case 'firebase':
            if (!effectiveApiKey) return { isValid: false, error: 'Service Account JSON (stringified) is required for Firebase.' };
            try {
                JSON.parse(effectiveApiKey); 
                return { isValid: true, error: "Placeholder validation: Assumed valid if Service Account is valid JSON. Full validation requires SDK initialization." };
            } catch (e) {
                return { isValid: false, error: 'Firebase Service Account is not valid JSON.' };
            }
        
        case 'notion_api':
            if (!effectiveApiKey) return { isValid: false, error: 'Notion API Key (Integration Token) is required.' };
            const notionBase = (endpoint || 'https://api.notion.com/v1').replace(/\/$/, '');
            testUrlToUse = `${notionBase}/users/me`;
            fetchOptions.method = 'GET';
            fetchOptions.headers!['Authorization'] = `Bearer ${effectiveApiKey.trim()}`;
            fetchOptions.headers!['Notion-Version'] = '2022-06-28';
            break;

        case 'blockchain_node_rpc':
             if (!endpoint) return { isValid: false, error: 'Blockchain RPC Endpoint URL is required.' };
             testUrlToUse = endpoint.trim();
             fetchOptions.method = 'POST';
             fetchOptions.headers!['Content-Type'] = 'application/json';
             fetchOptions.body = JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 });
             if (effectiveApiKey) {
                // Some RPCs might put API key in URL, others in header, or as a param.
                // This basic test assumes public or URL-based auth if key is present.
             }
             delete fetchOptions.headers!['Authorization'];
             break;
        
        case 'etherscan_api':
            if (!effectiveApiKey) return { isValid: false, error: 'API Key is required for Etherscan API.' };
            const etherscanBaseUrl = (endpoint || 'https://api.etherscan.io/api').replace(/\/$/, '');
            testUrlToUse = `${etherscanBaseUrl}?module=stats&action=ethprice&apikey=${effectiveApiKey.trim()}`;
            fetchOptions.method = 'GET';
            delete fetchOptions.headers!['Authorization'];
            break;

        case 'the_graph_api':
            if (!endpoint) return { isValid: false, error: 'Subgraph Query URL is required for The Graph.' };
            testUrlToUse = endpoint.trim(); // Endpoint is the full query URL
            fetchOptions.method = 'POST';
            fetchOptions.headers!['Content-Type'] = 'application/json';
            // Example simple query; actual queries would be more complex
            fetchOptions.body = JSON.stringify({ query: "{indexingStatuses(first: 1){subgraph}}" }); 
            if (effectiveApiKey) {
                fetchOptions.headers!['Authorization'] = `Bearer ${effectiveApiKey.trim()}`;
            } else {
                 delete fetchOptions.headers!['Authorization'];
            }
            break;

        case 'shopify_admin_api':
            if (!effectiveApiKey) return { isValid: false, error: 'Admin API Access Token is required for Shopify.' };
            if (!endpoint) return { isValid: false, error: 'Shopify Store URL (e.g., your-store.myshopify.com) is required.' };
            // Ensure endpoint is just the domain, not https://
            const storeDomain = endpoint.replace(/^https?:\/\//, '').replace(/\/$/, '');
            testUrlToUse = `https://${storeDomain}/admin/api/2023-10/shop.json`; // Use a recent stable API version
            fetchOptions.method = 'GET';
            fetchOptions.headers!['X-Shopify-Access-Token'] = effectiveApiKey.trim();
            delete fetchOptions.headers!['Authorization'];
            break;

        case 'pubmed_api':
            const pubmedBaseUrl = (endpoint || 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/').replace(/\/$/, '');
            testUrlToUse = `${pubmedBaseUrl}/einfo.fcgi?retmode=json`;
            if (effectiveApiKey) {
                testUrlToUse += `&api_key=${effectiveApiKey.trim()}`;
            }
            fetchOptions.method = 'GET';
            delete fetchOptions.headers!['Authorization'];
            break;

        case 'aws-bedrock':
        case 'google-vertex':
          console.warn(`Validation for ${providerId} is complex and usually relies on SDK default credential chains or specific configurations not covered by simple API key/endpoint tests. Assuming valid if configured in environment.`);
          return { isValid: true, error: "Validation for this provider is complex and not fully implemented via simple API key test. Assumed valid if environment is configured." };
        
        default:
          return { isValid: false, error: `Unsupported provider for validation: ${providerId}` };
      }

      if (testUrlToUse) {
        const response = await fetch(testUrlToUse, fetchOptions);
        if (!response.ok) {
          let errorPrefix = `API request for ${providerId} failed: ${response.status} - `;
          let errorDetail = `Server returned status ${response.status}. Check endpoint and API key/token.`;
          try {
            const errorJson = await response.json();
            if (providerId === 'trello_api' && typeof errorJson === 'string') { 
                errorDetail = errorJson;
            } else if (['telegram_bot', 'github_api', 'gitlab_api', 'dropbox_api', 'bitquery_api', 'notion_api', 'blockchain_node_rpc', 'etherscan_api', 'the_graph_api', 'shopify_admin_api', 'pubmed_api'].includes(providerId) && (errorJson.description || errorJson.message || errorJson.error_summary || (errorJson.errors && errorJson.errors[0]?.message) || errorJson.error || errorJson.result ) ) {
                 errorDetail = errorJson.description || errorJson.message || (providerId === 'dropbox_api' ? errorJson.error_summary : ( (providerId === 'bitquery_api' || providerId === 'blockchain_node_rpc' || providerId === 'the_graph_api' || providerId === 'shopify_admin_api') && errorJson.errors ? (typeof errorJson.errors === 'string' ? errorJson.errors : errorJson.errors[0].message) : (providerId === 'notion_api' ? errorJson.message : ( (providerId === 'etherscan_api' && errorJson.result) ? errorJson.result : (providerId === 'blockchain_node_rpc' && errorJson.error ? errorJson.error.message : (providerId === 'pubmed_api' && errorJson.error ? errorJson.error : JSON.stringify(errorJson))) ) ) ) );
            } else if (errorJson.error?.message) {
                errorDetail = errorJson.error.message;
            } else if (errorJson.detail) {
                errorDetail = errorJson.detail;
            } else if (typeof errorJson === 'object' && errorJson !== null) {
                errorDetail = JSON.stringify(errorJson);
            }


            if (providerId === 'google') {
              const keySnippet = effectiveApiKey.length > 4 ? `...${effectiveApiKey.slice(-4)}` : 'the provided key';
              errorPrefix = `Google API request using key ending in '${keySnippet}' failed: ${response.status} - `;
              if (errorDetail.toLowerCase().includes('api key not valid') || errorDetail.toLowerCase().includes('permission denied')) {
                errorDetail += " (This error from Google likely means the API key is invalid, not enabled for the Generative Language API, or lacks proper permissions for the model. Please verify the key and its configuration in your Google Cloud Console.)";
              }
            }
            if ((['github_api', 'gitlab_api', 'dropbox_api', 'bitquery_api', 'notion_api', 'etherscan_api', 'shopify_admin_api'].includes(providerId)) && response.status === 401) {
                errorDetail = `${providerId.replace('_api','')} API: Bad credentials. Check your Access Token/API Key and its permissions.`;
            }
            if (providerId === 'the_graph_api' && response.status === 401) {
                errorDetail = `The Graph: Authentication error. Check API key or if the subgraph requires authentication.`;
            }
            if (providerId === 'trello_api' && response.status === 401) {
                errorDetail = "Trello API: Invalid API key or token. Ensure format 'key=API_KEY&token=API_TOKEN'."
            }
            if (providerId === 'blockchain_node_rpc' && (response.status === 401 || response.status === 403)) {
                errorDetail = `Blockchain RPC: Authentication error (${response.status}). Check your endpoint URL and API key if required.`;
            }


          } catch (e) { 
            const textResponse = await response.text(); 
            errorDetail = textResponse || response.statusText || `Server returned status ${response.status}.`;
          }
          return { isValid: false, error: `${errorPrefix}${errorDetail}` };
        }
        
        if (['telegram_bot', 'github_api', 'gitlab_api', 'dropbox_api', 'trello_api', 'bitquery_api', 'notion_api', 'blockchain_node_rpc', 'etherscan_api', 'the_graph_api', 'shopify_admin_api', 'pubmed_api'].includes(providerId)) {
            const responseJson = await response.json();
            let successCondition = false;
            let errorMsg = `${providerId.replace('_api','')} API error: Response did not indicate success.`;

            if (providerId === 'telegram_bot' && responseJson.ok) successCondition = true;
            else if (providerId === 'github_api' && responseJson.login) successCondition = true; 
            else if (providerId === 'gitlab_api' && responseJson.id) successCondition = true; 
            else if (providerId === 'dropbox_api' && responseJson.account_id) successCondition = true;
            else if (providerId === 'trello_api' && responseJson.id) successCondition = true; 
            else if (providerId === 'bitquery_api' && responseJson.data?.bitquery?.status) successCondition = true;
            else if (providerId === 'notion_api' && responseJson.id) successCondition = true; 
            else if (providerId === 'blockchain_node_rpc' && responseJson.result) successCondition = true; 
            else if (providerId === 'etherscan_api' && responseJson.status === "1" && responseJson.message === "OK") successCondition = true;
            else if (providerId === 'the_graph_api' && responseJson.data?.indexingStatuses) successCondition = true;
            else if (providerId === 'shopify_admin_api' && responseJson.shop) successCondition = true;
            else if (providerId === 'pubmed_api' && responseJson.result?.dbinfo) successCondition = true;


            if (successCondition) return { isValid: true };
            
            if (providerId === 'telegram_bot') errorMsg = responseJson.description ? `Telegram API error: ${responseJson.description}` : `Telegram API error code: ${responseJson.error_code}`;
            else if (providerId === 'github_api' || providerId === 'gitlab_api') errorMsg = responseJson.message || `${providerId.replace('_api','')} API error: Unexpected response.`;
            else if (providerId === 'dropbox_api') errorMsg = responseJson.error_summary || 'Dropbox API error: Unexpected response.';
            else if (providerId === 'trello_api') errorMsg = responseJson.message || (await response.text()) || 'Trello API error: Unexpected response.'; 
            else if (providerId === 'bitquery_api') errorMsg = responseJson.errors?.[0]?.message || 'Bitquery API error: Could not get status or unexpected response.';
            else if (providerId === 'notion_api') errorMsg = responseJson.message || 'Notion API error: Unexpected response.';
            else if (providerId === 'blockchain_node_rpc') errorMsg = responseJson.error?.message || 'Blockchain RPC error: Invalid response or missing result.';
            else if (providerId === 'etherscan_api') errorMsg = responseJson.result || responseJson.message || 'Etherscan API error: Invalid response or API key issue.';
            else if (providerId === 'the_graph_api') errorMsg = responseJson.errors?.[0]?.message || 'The Graph API error: Query failed or invalid response.';
            else if (providerId === 'shopify_admin_api') errorMsg = responseJson.errors || 'Shopify API error: Could not fetch shop details.';
            else if (providerId === 'pubmed_api') errorMsg = responseJson.error || 'PubMed API error: Could not fetch einfo.';


            return { isValid: false, error: errorMsg };
        }
        return { isValid: true }; 
      } else {
        return { isValid: false, error: 'Internal error: Test URL not defined or SDK path failed silently before network request.' };
      }

    } catch (error: any) {
      console.error(`Network or other error during validation for ${providerId}:`, error);
      return { isValid: false, error: error.message || `An unexpected error occurred during ${providerId} validation.` };
    }
  }
);
